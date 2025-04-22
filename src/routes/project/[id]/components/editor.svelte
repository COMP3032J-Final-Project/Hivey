<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { Awareness, LoroDoc, UndoManager, type AwarenessListener } from 'loro-crdt';
  import { type WSResponse } from '$lib/types/websocket';
  import { uint8ArrayToBase64, base64ToUint8Array } from '$lib/utils';
  import { UserPermissionEnum } from '$lib/types/auth';
  import type { WebSocketClient } from '$lib/api/websocket';
  import { search, openSearchPanel, findNext as cmFindNext, findPrevious as cmFindPrevious } from '@codemirror/search';
  import { getContext } from 'svelte';
	import { getFileMissingOps } from '$lib/api/editor';

  // code mirror
  import { EditorView, basicSetup } from 'codemirror';
  import { lineNumbers } from '@codemirror/view';
  import { Compartment, EditorState } from '@codemirror/state';
  
  import { markdown } from '@codemirror/lang-markdown';
  import { latex } from 'codemirror-lang-latex';
	import { javascript } from '@codemirror/lang-javascript';
  import { LoroExtensions } from 'loro-codemirror';


  import { project, currentFile } from './../store.svelte';
  
  let {
      // NOTE: they are also state-ful (can be tracked as dependency inside `$effect`)
      username,
      permission,
  }: {
      username: string;
      permission: UserPermissionEnum;
  } = $props();

  const getWsClient = getContext<() => WebSocketClient | null>('websocket-client');
  const wsClient = $derived(getWsClient ? getWsClient() : null);
  
  let editorView: EditorView | undefined;
  let loroDoc: LoroDoc | undefined = new LoroDoc();
	let loroAwareness: Awareness | undefined = new Awareness(loroDoc.peerIdStr);
	let undoManager: UndoManager | undefined = new UndoManager(loroDoc, {});

	let isLoadingFileContent = $state(false);
  let editorContainerElem: HTMLElement | undefined = $state();
  
  // --- Compartments for Dynamic Configuration ---
	let languageCompartment = new Compartment();
	let readOnlyCompartment = new Compartment();
	let loroCompartment = new Compartment(); // To reconfigure LoroExtensions with new instances


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
	function getLanguageExtension(filetype: string | undefined) {
		  switch (filetype?.toLowerCase()) {
			    case 'md':
              return markdown();
			    case 'js':
              return javascript();
          case 'tex':
              return latex();
			    default:
              return markdown();
		  }
	}


  // --- Editor --- 
  // Life cycle Management

  function loroSubscribeLocalUpdateFn(update: Uint8Array) {
      const fileId = $currentFile.id;
			if (wsClient && fileId) {
				  const updateData = uint8ArrayToBase64(update);
				  wsClient.sendCRDTUpdateMessage(fileId, updateData);
			}
  }

  function loroAwarenessListener(
      updates: Parameters<AwarenessListener>[0],
      origin: Parameters<AwarenessListener>[1]
  ) {
      const fileId = $currentFile.id;
			if (wsClient && origin === 'local' && fileId && loroAwareness) {
				  const changes = updates.added.concat(updates.removed).concat(updates.updated);
				  if (changes.length > 0) {
					    const awarenessData = uint8ArrayToBase64(loroAwareness.encode(changes));
					    wsClient.sendAwarenessUpdateMessage(fileId, awarenessData);
				  }
			}
	}
  
  $effect(() => {
      const fileId = $currentFile.id;
      const fileType = $currentFile.filetype
      const fileContent = $currentFile.fileContent;
      const loroUserName = username;
      const pid = $project.id;

      if (!fileId) return;
      untrack(() => {
          isLoadingFileContent = true;
      })
		  
      if (fileContent == null) return;
      
      loroDoc = new LoroDoc();
		  loroAwareness = new Awareness(loroDoc.peerIdStr);
		  undoManager = new UndoManager(loroDoc, {});

      // TODO get file content(CRDT snapshot)

      getFileMissingOps(pid, fileId, loroDoc)
          .then((missingOpLogs) => {
              if (!loroDoc || !loroAwareness || !undoManager) return;
              
					    console.log(`Importing ops/snapshot for ${fileId}`);
					    loroDoc.import(missingOpLogs);
      
              const isReadOnly = untrack(() => permission) === UserPermissionEnum.Viewer || untrack(() => permission) === UserPermissionEnum.NonMember;
			        const extensions = [
					        basicSetup,
					        lineNumbers(),
					        EditorView.lineWrapping,
					        search(),
					        EditorView.theme({
						          '&': { height: '100%', fontSize: '18px' },
					        }),
					        languageCompartment.of(getLanguageExtension(fileType)),
					        readOnlyCompartment.of([
						          EditorState.readOnly.of(isReadOnly),
						          EditorView.editable.of(!isReadOnly),
                      // EditorView.contentAttributes.of({ tabindex: '0' })''
					        ]),
					        loroCompartment.of(
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
			        ];

              try {
					        const editorState = EditorState.create({ extensions });
					        editorView = new EditorView({ state: editorState, parent: editorContainerElem });
					        console.debug(`EditorView created successfully for ${fileId}`);
			        } catch (error) {
					        console.error(`Failed to create EditorView for ${fileId}:`, error);
                  return;
			        }
              
			        editorView.focus();

              loroDoc.subscribeLocalUpdates(loroSubscribeLocalUpdateFn);
		          loroAwareness.addListener(loroAwarenessListener);
          })
      		.catch((err) => {
				      console.error(`Failed to get CRDT operations for ${fileId}:`, err);
			    })
			    .finally(() => {
              untrack(() => {
					        isLoadingFileContent = false;
              });
			    });



      return () => {
				  if (editorView) {
					    console.debug(`Destroying EditorView for previous file: ${fileId}`);
					    editorView.destroy();
				  }
          // TODO cancel getFileMissingOps if exists
          
				  // Reset state associated with the old editor instance
				  editorView = undefined;
				  loroDoc = undefined;
				  loroAwareness = undefined;
				  undoManager = undefined;
			};

  });

  
  // read only state change
  $effect(() => {
      const isReadOnly = permission === UserPermissionEnum.Viewer || permission === UserPermissionEnum.NonMember;
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
					    const updateData = base64ToUint8Array(data.data);
					    loroDoc.import(updateData);
				  } else if (response.payload.type === 'awareness') {
					    const awarenessData = base64ToUint8Array(data.data);
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


{#if !$currentFile.id}
	<div class="flex items-center justify-center size-full text-muted-foreground">
		Select a file to start editing.
	</div>
{:else if $currentFile.filetype === 'pdf'}
  <div class="flex items-center justify-center size-full text-muted-foreground">
		PDF preview
	</div>
{:else}
	<div class="relative size-full">
		{#if isLoadingFileContent}
			<div class="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
				Loading content for {$currentFile.filename}...
			</div>
		{/if}
		<div bind:this={editorContainerElem} class="editor size-full"></div>
	</div>
{/if}
