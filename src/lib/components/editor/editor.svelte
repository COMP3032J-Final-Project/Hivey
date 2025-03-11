<script lang="ts">
    import { onMount } from 'svelte';
    import { EditorView, basicSetup } from 'codemirror';
    import { lineNumbers } from '@codemirror/view';
    import { EditorState } from '@codemirror/state';
    import { markdown } from '@codemirror/lang-markdown';
    
    let { value = $bindable() } = $props(); 

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
                        const newText = update.state.doc.toString();
                        value = newText;
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
