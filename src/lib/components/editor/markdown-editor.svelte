<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { EditorView, basicSetup } from 'codemirror';
    import { lineNumbers } from '@codemirror/view';
    import { EditorState } from '@codemirror/state';
    import { markdown } from '@codemirror/lang-markdown';

    export let initialValue: string = '';
    
    const dispatch = createEventDispatcher<{
        change: string;
    }>();

    onMount(() => {
        const startState = EditorState.create({
            doc: initialValue,
            extensions: [
                basicSetup, 
                markdown(), 
                lineNumbers({}),
                EditorView.lineWrapping, 
                EditorView.theme({
                    ".cm-scroller": {
                        overflow: "auto",
                    },
                }),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        const newText = update.state.doc.toString();
                        dispatch('change', newText);
                    }
                })
            ]
        });

        new EditorView({
            state: startState,
            parent: document.getElementById('editor-area') as HTMLElement
        });
    });
</script>

<div id="editor-area" class="w-full h-full"></div>

<style>
    :global(.cm-editor) {
        height: 100%;
        max-height: 87vh;
        font-family: monospace;
        font-size: 14px;
        line-height: 1.5;
        background-color: #f9f9f9;
    }
</style>
