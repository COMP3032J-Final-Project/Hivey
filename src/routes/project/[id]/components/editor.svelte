<script lang="ts">
  import { onMount } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { lineNumbers } from '@codemirror/view';
  import { EditorState } from '@codemirror/state';
  import { markdown } from '@codemirror/lang-markdown';
  import { getTextFromDoc, LoroExtensions } from 'loro-codemirror';
  import { Awareness, LoroDoc, UndoManager } from 'loro-crdt';
  import * as v from 'valibot';
  import { Message, type WSRequest, type WSResponse } from '$lib/types/websocket';
  import { uint8ArrayToBase64, base64ToUint8Array } from '$lib/utils';
  import { UserPermissionEnum } from '$lib/types/auth';
  import type { WebSocketClient } from '$lib/api/websocket';
  import { search, openSearchPanel, findNext as cmFindNext, findPrevious as cmFindPrevious } from '@codemirror/search';
  import { getContext } from 'svelte';
  import { currentFile } from './../store.svelte';

  let {
      // TODO pass user type
      username,
      project_id,
      // TODO handle situation at the first connecting, the access_token is expired and needed to be refershed
      access_token,
      permission,
  }: {
      username: string;
      project_id: string;
      access_token: string;
      permission: UserPermissionEnum;
  } = $props();

  const getWsClient = getContext<() => WebSocketClient | null>('websocket-client'); // 从context中获取WebSocket客户端的函数
  let wsClient = $derived(getWsClient ? getWsClient() : null); // 获取当前的wsClient实例
  let editorAreaElem: HTMLElement;
  let isConnected = $state(false);
  let editorView: EditorView;
  let isExternalUpdate = false;

  const doc = new LoroDoc();
  // TODO setPeerId()
  const awareness: Awareness = new Awareness(doc.peerIdStr);
  const undoManager = new UndoManager(doc, {});

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
      if (!editorView) return;
      undoManager.undo();
  }

  export function redo() {
      if (!editorView) return;
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
          const { state } = editorView;
          const { selection } = state;
          editorView.dispatch({
              changes: { from: selection.main.from, to: selection.main.to, insert: text }
          });
      });
  }

  function handleWsMessage(message: Message) {
      message = v.parse(Message, message);
      if (message.action !== 'send_message' || message.client_id == username) return;
      const data = message.message;
      switch (data.type) {
          case 'update':
              // console.log('update', message.client_id, base64ToUint8Array(data.data));
              doc.import(base64ToUint8Array(data.data));
              break;
          case 'awareness':
              // console.log('awareness', message.client_id, base64ToUint8Array(data.data));
              awareness.apply(base64ToUint8Array(data.data));
              break;
          default:
              break;
      }
  }

  onMount(async () => {
      // basic extensions
      const extensions = [
          basicSetup,
          markdown(),
          lineNumbers({}),
          EditorView.lineWrapping,
          search(),
          EditorView.theme({
              '&': { height: '100%', fontSize: '18px' }
          }),
          LoroExtensions(
              doc,
              {
                  user: { name: username, colorClassName: 'bg-orange-500 text-orange-500' },
                  awareness: awareness
              },
              undoManager
          )
      ];

      if (permission === UserPermissionEnum.Viewer) {
          // 如果用户只有查看权限则配置编辑器为只读
          extensions.push(
              EditorState.readOnly.of(true),
              EditorView.editable.of(false),
              EditorView.contentAttributes.of({ tabindex: '0' })
          );
      }

      const startState = EditorState.create({
          doc: $currentFile.fileContent,
          extensions: extensions
      });

      editorView = new EditorView({
          state: startState,
          parent: editorAreaElem
      });

      
      $effect(() => {
          // update editor content when value changes
          if (editorView && $currentFile.fileContent !== editorView.state.doc.toString()) {
              editorView.dispatch({
                  changes: { from: 0, to: editorView.state.doc.length, insert: $currentFile.fileContent }
              });
          }
      });
  });

  $effect(() => {
      // 由于wsClient在+layout.svelte中的初始化是异步的, 因此需要使用$effect来确保wsClient在初始化后才进行回调函数设置
      if (wsClient) {
          // 为wsClinet设置crdtEventHandler的回调函数
          wsClient.crdtEventHandler = (response: WSResponse) => {
              try {
                  if (response.payload.type === 'update') {
                      // 处理文档更新
                      const updateData = base64ToUint8Array(response.payload.data);
                      doc.import(updateData);
                  } else if (response.payload.type === 'awareness') {
                      // 处理awareness更新
                      const awarenessData = base64ToUint8Array(response.payload.data);
                      awareness.apply(awarenessData);
                  }
              } catch (error) {
                  console.error('Error handling CRDT event:', error);
              }
          }

          isConnected = true; 

          // 订阅文档更新
          doc.subscribeLocalUpdates((update) => {
              if (wsClient && isConnected) {
                  // 使用WebSocketClient发送CRDT更新
                  const updateData = uint8ArrayToBase64(update);
                  wsClient.sendCRDTUpdateMessage(updateData);
              }
          });
      
          // 订阅awareness更新
          awareness.addListener((updates, origin) => {
              if (isConnected && origin === 'local') {
                  // 使用WebSocketClient发送awareness更新
                  const changes = updates.added.concat(updates.removed).concat(updates.updated);
                  const awarenessData = uint8ArrayToBase64(awareness.encode(changes));
                  wsClient.sendAwarenessUpdateMessage(awarenessData);
              }
          });
      }
  });
</script>

{#if $currentFile.filetype!='pdf'}
  <div bind:this={editorAreaElem} class="editor size-full"></div>
{:else}
  <div></div>
{/if}
