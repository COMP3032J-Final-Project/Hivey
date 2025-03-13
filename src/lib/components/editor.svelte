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
                EditorView.lineWrapping, 
                EditorView.theme({
                    ".cm-scroller": {
                        overflow: "auto", // address browser scrollbar issue
                        height: "100%",
                        "font-family": "monospace",
                        "font-size": "14px",
                        "line-height": 1.5,
                    },
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

<style>
    .editor {
        width: 100%;
        height: 100%;
        max-height: 88vh;
        padding: 5px;
        font-family: monospace;
        font-size: 14px;
        line-height: 1.5;
        border: none;
        outline: none;
        resize: none;
        background-color: var(--background);
        overflow-y: auto;
    }
</style>

<div bind:this={editorAreaElem} class="editor"></div>
