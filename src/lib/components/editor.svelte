<script lang="ts">
  import { onMount } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { lineNumbers } from '@codemirror/view';
  import { EditorState } from '@codemirror/state';
  import { markdown } from '@codemirror/lang-markdown';
  import {
      getTextFromDoc,
      LoroExtensions,
  } from "loro-codemirror";
  import { Awareness, LoroDoc, UndoManager } from "loro-crdt";
  import { BACKEND_ADDR_WEBSOCKET } from '$lib/constants';

    
  let {
      value = $bindable(),
      // TODO pass user type
      username,
      project_id,
      // TODO handle situation at the first connecting, the access_token is expired and
      // needed to be refershed
      access_token,
  }: {
      value: any,
      username: string,
      project_id: string,
      access_token: string
  } = $props();

  let editorAreaElem: HTMLElement;

  onMount(() => {
      const ws = new WebSocket(new URL(
          `/project/${project_id}/ws/cursor?token=${access_token}`,
          BACKEND_ADDR_WEBSOCKET
      ));

      ws.addEventListener("open", () => {
          console.log("WebSocket connected");
      });

      const startState = EditorState.create({
          doc: value,
          extensions: [
              basicSetup,
              markdown(), 
              lineNumbers({}),
              lineNumbers({}),
              EditorView.lineWrapping,
              EditorView.theme({
                  "&": { height: "100%", fontSize: "18px" },
              }),
              EditorView.updateListener.of((update) => {
                  if (update.docChanged) {
                      value = update.state.doc.toString();
                  }
              })
          ]
      });

      new EditorView({
          state: startState,
          parent: editorAreaElem
      });
  });
</script>

<div bind:this={editorAreaElem} class="editor size-full"></div>
