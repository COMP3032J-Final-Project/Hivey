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

<div class="flex flex-col">
    <h3 class="flex h-10">Preview</h3>
    <div class="size-full prose lg:prose-xl overflow-y-auto shadow-inner {paddingClass}">
        {@html renenderedHTML}
    </div>
</div>
