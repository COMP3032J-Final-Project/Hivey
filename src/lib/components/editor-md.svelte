<script lang="ts">
    import { onMount } from 'svelte';
    import { EditorView, basicSetup } from 'codemirror';
    import { lineNumbers } from '@codemirror/view';
    import { EditorState } from '@codemirror/state';
    import { markdown } from '@codemirror/lang-markdown';
    
    let { value = $bindable() } = $props();

    let editorAreaElem: HTMLElement;

    onMount(() => {
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

<div bind:this={editorAreaElem}
  class="editor size-full">
</div>
