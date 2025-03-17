<script lang="ts">
    import { onMount } from 'svelte';
    import { EditorState, StateField } from '@codemirror/state';
    import { EditorView } from "@codemirror/view";
    import {
        getTextFromDoc,
        LoroExtensions,
    } from "loro-codemirror";
    import { Awareness, LoroDoc, UndoManager } from "loro-crdt";
    import { basicSetup } from "codemirror";
    import { lineNumbers } from '@codemirror/view';
    import { markdown } from '@codemirror/lang-markdown';

    let editorArea1: HTMLElement;
    let editorArea2: HTMLElement;

    onMount(() => {
        const doc1 = new LoroDoc();
        const awareness1: Awareness = new Awareness(doc1.peerIdStr);
        const undoManager1 = new UndoManager(doc1, {});
        const doc2 = new LoroDoc();
        const awareness2: Awareness = new Awareness(doc2.peerIdStr);
        const undoManager2 = new UndoManager(doc2, {});
        
        doc1.subscribeLocalUpdates((update) => {
            doc2.import(update);
        });
        // Initialize the document
        getTextFromDoc(doc1).insert(0, "hello");
        doc1.commit();
        doc2.subscribeLocalUpdates((update) => {
            doc1.import(update);
        });

        awareness1.addListener((updates, origin) => {
            const changes = updates.added
                .concat(updates.removed)
                .concat(updates.updated);
            // console.log(updates, origin);
            if (origin === "local") {
                awareness2.apply(awareness1.encode(changes));
            }
        });

        awareness2.addListener((updates, origin) => {
            const changes = updates.added
                .concat(updates.removed)
                .concat(updates.updated);
            if (origin === "local") {
                awareness1.apply(awareness2.encode(changes));
            }
        });
        
        new EditorView({
            state: EditorState.create({
                doc: "",
                extensions: [
                    basicSetup,
                    markdown(), 
                    lineNumbers({}),
                    EditorView.lineWrapping,
                    EditorView.theme({
                        "&": { height: "100%", fontSize: "18px" },
                    }),
                    LoroExtensions(
                        doc1,
                        {
                            user: { name: "User 1", colorClassName: "bg-orange-500 text-orange-500" },
                            awareness: awareness1,
                        },
                        undoManager1,
                    ),
                ]
            }),
            parent: editorArea1
        });

        new EditorView({
            state: EditorState.create({
                doc: "",
                extensions: [
                    basicSetup,
                    markdown(), 
                    lineNumbers({}),
                    EditorView.lineWrapping,
                    EditorView.theme({
                        "&": { height: "100%", fontSize: "18px" },
                    }),
                    LoroExtensions(
                        doc2,
                        {
                            user: { name: "User 2", colorClassName: "bg-purple-500 text-purple-500" },
                            awareness: awareness2,
                        },
                        undoManager2,
                    ),
                ]
            }),
            parent: editorArea2
        })
    });
</script>


<div class="header">
    <h1>Loro CodeMirror Plugin</h1>
</div>
<div class="editor-container">
    <div class="editor-wrapper">
        <h2>
            Editor 1
            <span class="editor-badge" style="background-color: #ed4f47"
            >User 1</span
            >
        </h2>
        <div bind:this={editorArea1} class="editor"></div>
    </div>
    <div class="editor-wrapper">
        <h2>
            Editor 2
            <span class="editor-badge" style="background-color: #32bf76"
            >User 2</span
            >
        </h2>
        <div bind:this={editorArea2} class="editor"></div>
    </div>
</div>

<style>
    :root {
        --primary-color: #4f46e5;
        --secondary-color: #6366f1;
        --background-color: #f9fafb;
        --border-color: #e5e7eb;
        --text-color: #1f2937;
    }

    .header {
        text-align: center;
        margin-bottom: 40px;
    }

    .header h1 {
        font-size: 2.5rem;
        color: var(--primary-color);
        margin: 0 0 12px 0;
        font-weight: 700;
    }

    .header p {
        font-size: 1.1rem;
        color: #6b7280;
        max-width: 600px;
        margin: 0 auto;
    }

    .editor-container {
        display: flex;
        gap: 32px;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
                    0 2px 4px -2px rgb(0 0 0 / 0.1);
    }

    .editor-wrapper {
        flex: 1;
        min-width: 0;
    }

    .editor {
        border: 1px solid var(--border-color);
        border-radius: 8px;
        height: 300px;
        background: white;
        overflow: hidden;
        transition: border-color 0.2s;
    }

    .editor:hover {
        border-color: var(--secondary-color);
    }

    h2 {
        margin: 0 0 16px 0;
        font-size: 1.25rem;
        color: var(--text-color);
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .editor-badge {
        font-size: 0.875rem;
        padding: 4px 8px;
        border-radius: 6px;
        font-weight: 500;
    }

    .user1 {
        background-color: #ed4f47;
        color: #e11d48;
    }

    .user2 {
        background-color: #32bf76;
        color: #047857;
    }

    @media (max-width: 768px) {
        .editor-container {
            flex-direction: column;
        }

        .editor {
            height: 400px;
        }
    }
</style>
