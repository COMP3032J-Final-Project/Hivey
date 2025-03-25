<script lang="ts">
    import MarkdownIt from 'markdown-it';

    let {
        fileType = '',
        content = ''
    }: {
        fileType: string,
        content: string
    } = $props();
    
    // Initialize MarkdownIt instance
    const markdownRender = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
    });

    let renenderedHTML = $derived(markdownRender.render(content))
    let paddingClass = $derived.by(() => {
        switch (fileType) {
            case "markdown":
                return "p-2";
            default:
                return "";
        }
    });
</script>

<div class="flex flex-col h-full">
    <div class="w-full h-full prose lg:prose-md max-w-none overflow-y-auto shadow-inner {paddingClass} break-words">
        {@html renenderedHTML}
    </div>
</div>
