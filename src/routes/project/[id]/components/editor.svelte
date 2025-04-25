<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { Awareness, LoroDoc, UndoManager, type AwarenessListener } from 'loro-crdt';
  import { type WSResponse } from '$lib/types/websocket';
  import { UserPermissionEnum } from '$lib/types/auth';
  import type { WebSocketClient } from '$lib/api/websocket';
  import { search, openSearchPanel, findNext as cmFindNext, findPrevious as cmFindPrevious } from '@codemirror/search';
  import { getContext } from 'svelte';
	import { getFileMissingOps } from '$lib/api/editor';
  import { Base64 } from 'js-base64';
  import { keymap } from '@codemirror/view';
  import { debounce } from 'lodash-es';
  import Notification from './notification.svelte';
  import { getFileCategory  } from '$lib/utils';

  // code mirror
  import { EditorView, basicSetup } from 'codemirror';
  import { lineNumbers } from '@codemirror/view';
  import { Compartment, EditorState } from '@codemirror/state';
  
  import { markdown } from '@codemirror/lang-markdown';
  import { latex } from 'codemirror-lang-latex';
	import { javascript } from '@codemirror/lang-javascript';
  import { LoroExtensions } from 'loro-codemirror';
  import type { FileType } from '$lib/types/editor';


  import { project, currentFile } from './../store.svelte';
  
  let {
      // NOTE: they are also state-ful (can be tracked as dependency inside `$effect`)
      docContent = $bindable(),
      username,
      permission,
  }: {
      docContent: string | undefined,
      username: string;
      permission: UserPermissionEnum;
  } = $props();

  const getWsClient = getContext<() => WebSocketClient | null>('websocket-client');
  const wsClient = $derived(getWsClient ? getWsClient() : null);
  
  let editorView: EditorView | undefined;
  let isEditorSettled: boolean = false;
  let loroDoc: LoroDoc | undefined;
	let loroAwareness: Awareness | undefined;
	let undoManager: UndoManager | undefined;
  
  let noFileEditing = $derived(
      $currentFile.id == null ||
      $currentFile.filetype == null || 
      getFileCategory($currentFile.filetype) !== "PlainText"
  );

	let isLoadingFileContent = $state(false);
  let editorContainerElem: HTMLElement | undefined = $state();
  
  // --- Compartments for Dynamic Configuration ---
	let languageCompartment = new Compartment();
	let readOnlyCompartment = new Compartment();
	let loroCompartment = new Compartment(); // To reconfigure LoroExtensions with new instances

  let showNotification = $state(false);

  const showNotificationDebounced = debounce(() => {
    showNotification = true;
  }, 1000, { leading: true, trailing: false });

  // --- Export Functions ---
  export function hasSurroundingSymbols(prefix: string, suffix: string) {
      if (!editorView) return false;

      const selection = editorView.state.selection;
      if (selection.main.empty) return false;

      const { from, to } = selection.main;
      const doc = editorView.state.doc;

      // 检查选中区域前是否有符号
      const pre = doc.slice(Math.max(0, from - prefix.length), from).toString();
      // 检查选中区域后是否有符号
      const suf = doc.slice(to, Math.min(doc.length, to + suffix.length)).toString();

      return pre === prefix && suf === suffix;
  }

  export function wrapSelection(prefix: string, suffix: string) {
      if (!editorView) {
          console.error('EditorView is not initialized');
          return;
      }

      const selection = editorView.state.selection;
      if (selection.main.empty) {
          const cursorPos = selection.main.from;
          editorView.dispatch({
              changes: [
                  { from: cursorPos, insert: prefix },
                  { from: cursorPos, insert: suffix }
              ]
          });
          console.log('insert into empty editor');
          return;
      }

      const { from, to } = selection.main;
      console.log('from', from, 'to', to);

      editorView.dispatch({
          changes: [
              { from, insert: prefix },
              { from: to, insert: suffix }
          ],
          selection: {
              anchor: from + prefix.length,
              head: to + suffix.length
          }
      });
  }

  export function unwrapSelection(prefix: string, suffix: string) {
      if (!editorView) {
          console.error('EditorView is not initialized');
          return;
      }

      const selection = editorView.state.selection;
      if (selection.main.empty) {
          const cursorPos = selection.main.from;
          editorView.dispatch({
              changes: [
                  { from: cursorPos, insert: prefix },
                  { from: cursorPos, insert: suffix }
              ]
          });
          console.log('insert into empty editor');
          return;
      }

      const { from, to } = selection.main;
      console.log('from', from, 'to', to);

      editorView.dispatch({
          changes: [
              { from: from - prefix.length, to: from, insert: '' },
              { from: to, to: to + suffix.length, insert: '' }
          ],
          selection: {
              anchor: from - prefix.length,
              head: to - prefix.length
          }
      });
  }

  export function undo() {
      if (!editorView || !undoManager) return;
      undoManager.undo();
  }

  export function redo() {
      if (!editorView || !undoManager) return;
      undoManager.redo();
  }

  export function findReplace() {
      if (!editorView) return;
      openSearchPanel(editorView);
  }

  export function findNext() {
      if (!editorView) return;
      cmFindNext(editorView); 
  }

  export function findPrevious() {
      if (!editorView) return;
      cmFindPrevious(editorView);
  }

  export function cutSelection() {
      if (!editorView) return;
      const { state } = editorView;
      const { selection } = state;
      if (selection.main.empty) return;

      const text = state.sliceDoc(selection.main.from, selection.main.to);
      navigator.clipboard.writeText(text).then(() => {
          if (!editorView) return;
          editorView.dispatch({
              changes: { from: selection.main.from, to: selection.main.to, insert: '' }
          });
      });
  }

  export function copySelection() {
      if (!editorView) return;
      const { state } = editorView;
      const { selection } = state;
      if (selection.main.empty) return;

      const text = state.sliceDoc(selection.main.from, selection.main.to);
      navigator.clipboard.writeText(text);
  }

  export function pasteAtCursor() {
      if (!editorView) return;
      navigator.clipboard.readText().then((text) => {
          if (!editorView) return;
          const { state } = editorView;
          const { selection } = state;
          editorView.dispatch({
              changes: { from: selection.main.from, to: selection.main.to, insert: text }
          });
      });
  }


  // --- Language Mapping ---
	function getLanguageExtension(filetype: FileType | undefined) {
      if (filetype == null) return markdown(); // new doc
      
      switch (filetype) {
			    case 'markdown':
              return markdown();
          case 'latex':
              return latex();
			    default:
              return [];
      }
	}


  // --- Editor --- 
  // Life cycle Management
  // state variables inside function will cause `$effect` rerun
  // see example: https://svelte.dev/playground/a832ed82bf244d748bea12b233f1e3f0?version=5.28.1

  function loroSubscribeLocalUpdateFn(update: Uint8Array) {
      const fileId = untrack(() => $currentFile.id);
      const ws = untrack(() => wsClient);
			if (ws && fileId) {
				  const updateData = Base64.fromUint8Array(update);
				  ws.sendCRDTUpdateMessage(fileId, updateData);
			}
  }

  function loroAwarenessListener(
      updates: Parameters<AwarenessListener>[0],
      origin: Parameters<AwarenessListener>[1]
  ) {
      const fileId = untrack(() => $currentFile.id);
      const ws = untrack(() => wsClient);
      
			if (ws && origin === 'local' && fileId && loroAwareness) {
				  const changes = updates.added.concat(updates.removed).concat(updates.updated);
				  if (changes.length > 0) {
					    const awarenessData = Base64.fromUint8Array(loroAwareness.encode(changes));
					    ws.sendAwarenessUpdateMessage(fileId, awarenessData);
				  }
			}
	}

  function readOnlyP() {
      const perm = untrack(() => permission);
      const projectType = untrack(() => $project.type);
      return projectType === 'template' || perm === UserPermissionEnum.Viewer || perm === UserPermissionEnum.NonMember;
  }

  function readOnlyP_trackable() {
      const perm = permission;
      const projectType = $project.type;
      return projectType === 'template' || perm === UserPermissionEnum.Viewer || perm === UserPermissionEnum.NonMember;
  }

  const updateListener = EditorView.updateListener.of(update => {
			if (update.docChanged) {
					docContent = update.state.doc.toString();
			}
	});

  function setupEditor() {
      untrack(() => { isLoadingFileContent = true; })

			const extensions = [
					basicSetup,
					lineNumbers(),
					EditorView.lineWrapping,
					search(),
					EditorView.theme({
						  '&': { height: '100%', fontSize: '18px' },
					}),
          updateListener,
					languageCompartment.of([]),
					readOnlyCompartment.of([
            EditorState.readOnly.of(readOnlyP()),
            EditorView.editable.of(!readOnlyP())
          ]),
					loroCompartment.of([]),
          keymap.of([
            {
              key: 'Mod-s',
              run: () => {
                showNotificationDebounced();
                return true;
              }
            }
          ])
			];

			const editorState = EditorState.create({ extensions });
			editorView = new EditorView({ state: editorState, parent: editorContainerElem });

      untrack(() => { isLoadingFileContent = false; })
  }

  // CRDT & language
  $effect(() => {
      const fileId = $currentFile.id;
      const fileType = $currentFile.filetype
      const rawData = $currentFile.rawData;
      const loroUserName = username;
      const pid = $project.id;

      if (!fileId || !fileType) return;

      const fileCategory = getFileCategory(fileType);
      if (fileCategory !== "PlainText") return;
      
      if (!isEditorSettled) {
          setupEditor();
          isEditorSettled = true;
      }
      
      untrack(() => { isLoadingFileContent = true; })
      
      if (rawData == null) return;

      loroDoc = new LoroDoc();
		  loroAwareness = new Awareness(loroDoc.peerIdStr);
		  undoManager = new UndoManager(loroDoc, {});
      
      loroDoc.import(rawData);

      let unsubFn: () => void | undefined;
      
      getFileMissingOps(pid, fileId, loroDoc)
          .then((missingOpLogs) => {
              if (!loroDoc || !loroAwareness || !undoManager) return;
              
					    console.log(`Importing ops/snapshot for ${fileId}`);
					    loroDoc.import(missingOpLogs);

              unsubFn = loroDoc.subscribeLocalUpdates(loroSubscribeLocalUpdateFn);
		          loroAwareness.addListener(loroAwarenessListener);

              if (editorView) {
                  editorView.dispatch({
					            effects: languageCompartment.reconfigure(
                          getLanguageExtension(fileType)
                      )
                  });

                  editorView.dispatch({
					            effects: loroCompartment.reconfigure(
						              LoroExtensions(
							                loroDoc,
							                {
								                  user: {
                                      name: loroUserName,
                                      colorClassName: 'bg-orange-500 text-orange-500'
                                  },
								                  awareness: loroAwareness,
							                },
							                undoManager
						              )
					            )
				          });
              }
          })
          .catch((err) => {
				      console.error(`Failed to get CRDT operations for ${fileId}:`, err);
			    })
			    .finally(() => {
              untrack(() => { isLoadingFileContent = false; });
			    });


      return () => {
          if (unsubFn) unsubFn();
          loroAwareness?.removeListener(loroAwarenessListener);
          
          if (editorView) {
              editorView.dispatch({
					        effects: languageCompartment.reconfigure([])
              });

              editorView.dispatch({
					        effects: loroCompartment.reconfigure([])
              });
          }
          
          // TODO cancel getFileMissingOps if exists

					// Destroy the editor instance
					if (editorView) {
						editorView.destroy();
						editorView = undefined;
					}
          
				  // Reset state associated with the old editor instance
					isEditorSettled = false;
				  loroDoc = undefined;
				  loroAwareness = undefined;
				  undoManager = undefined;
          docContent = undefined;
			};
  })
  
  // read only state change
  $effect(() => {
      const isReadOnly = readOnlyP_trackable();
      
      if (editorView) {
  				editorView.dispatch({
					    effects: readOnlyCompartment.reconfigure([
						      EditorState.readOnly.of(isReadOnly),
						      EditorView.editable.of(!isReadOnly)
					    ])
				  });
      }
  })

  function handleCRDTEvent(response: WSResponse) {
      const data = response.payload.data;
      const currentFileId = $currentFile.id;
      
      if (data.file_id != currentFileId) return;
			if (!loroDoc || !loroAwareness) return;

			try {
				  if (response.payload.type === 'update') {
					    const updateData = Base64.toUint8Array(data.data);
					    loroDoc.import(updateData);
				  } else if (response.payload.type === 'awareness') {
					    const awarenessData = Base64.toUint8Array(data.data);
					    loroAwareness.apply(awarenessData);
				  }
			} catch (error) {
				  console.error(`WS: Error handling CRDT event:`, error);
			}
  }

  // setup webscoket
  $effect(() => {
		  if (!wsClient || untrack(() => isLoadingFileContent)) return;
		  wsClient.crdtEventHandler = handleCRDTEvent;
  })
  
</script>


{#if noFileEditing}
	<div class="flex items-center justify-center size-full text-muted-foreground">
		Select a file to start editing.
	</div>
{:else}
	{#key $currentFile.id}
	<div class="relative size-full">
		{#if isLoadingFileContent}
			<div class="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
				Loading content for {$currentFile.filename}...
			</div>
		{/if}
		<div bind:this={editorContainerElem} class="editor size-full"></div>
    <Notification
      title="Auto Save"
      description="File is automatically saved, no need to save manually"
      show={showNotification}
      on:close={() => showNotification = false}
    />
	</div>
	{/key}
{/if}
