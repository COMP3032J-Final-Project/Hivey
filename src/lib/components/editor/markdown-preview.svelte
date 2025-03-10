<script lang="ts">
    import { onMount } from 'svelte';
    import MarkdownIt from 'markdown-it';

    export let content: string = '';
    
    // Initialize MarkdownIt instance
    const markdownRender = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
    });

    // Render Markdown text
    $: renderedHtml = markdownRender.render(content);
</script>

<div class="preview-area">
    {@html renderedHtml}
</div>

<style>
    .preview-area {
        width: 100%;
        height: 100%;
        padding: 16px;
        overflow-y: auto;
        background-color: #fff;
    }

    .preview-area :global(h1) {
        @apply text-2xl leading-[48px] font-extrabold;
    }

    .preview-area :global(h2) {
        @apply text-xl leading-[42px] font-bold;
    }

    .preview-area :global(h3) {
        @apply text-lg leading-9 font-semibold;
    }

    .preview-area :global(img) {
        max-width: 100%;
        height: auto;
    }

    .preview-area :global(a) {
        @apply text-blue-600 leading-5 hover:underline;
    }

    .preview-area :global(p) {
        @apply leading-5 mb-4;
    }

    .preview-area :global(ol) {
        @apply list-decimal pl-5;
    }

    .preview-area :global(ul) {
        @apply list-disc pl-5;
    }

    .preview-area :global(li) {
        @apply mb-2;
    }

    .preview-area :global(table) {
        @apply w-full border-collapse my-4;
    }

    .preview-area :global(th),
    .preview-area :global(td) {
        @apply border border-gray-300 p-2 text-left;
    }

    .preview-area :global(th) {
        @apply bg-gray-100 font-bold;
    }

    .preview-area :global(tbody tr:nth-child(odd)) {
        @apply bg-gray-50;
    }

    .preview-area :global(tbody tr:nth-child(even)) {
        @apply bg-white;
    }

    .preview-area :global(tbody tr:hover) {
        @apply bg-gray-100;
    }

    .preview-area :global(thead) {
        @apply sticky top-0 bg-gray-100 z-10;
    }

    @media (max-width: 768px) {
        .preview-area :global(table) {
            @apply block overflow-x-auto whitespace-nowrap;
        }
    }
</style>
