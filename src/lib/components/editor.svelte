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
                        "background-color": "#f9f9f9",
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

<div bind:this={editorAreaElem} class="w-full h-full"></div>
