<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { Button } from "$lib/components/ui/button";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb";
    import { Separator } from "$lib/components/ui/separator";
    import MarkdownEditor from "$lib/components/editor/markdown-editor.svelte";
    import MarkdownPreview from "$lib/components/editor/markdown-preview.svelte";
    import ResizablePanel from "$lib/components/editor/resizable-panel.svelte";
    
    let { children } = $props();
    
    // Panel width configuration
    let leftWidth = $state(200);
    let rightWidth = $state(650);
    const LEFT_MIN_WIDTH = 100;
    const LEFT_MAX_WIDTH = 300;
    const RIGHT_MIN_WIDTH = 500;
    const RIGHT_MAX_WIDTH = 800;
    
    export const defaultMarkdown = `
# Heading 1

## Heading 2

### Heading 3

This is a link to [Google](https://www.google.com/).

Here is an example of inline code: \`console.log('Hello, World!');\`.

Below is a code block:

\`\`\`javascript
function greet(name) {
    console.log(\`Hello!\`);
}
greet('Alice');
\`\`\`

This is **bold text** and this is *italic text*. You can also combine them like ***bold and italic***.

## Lists

### Unordered
- Create a list by starting a line with \`+\`, \`-\`, or \`*\`
- Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    - Ac tristique libero volutpat at

### Ordered
1. Lorem ipsum dolor sit amet
2. You can use sequential numbers...
3. ...or keep all the numbers as \`1.\`

Start numbering with offset:
57. foo
58. bar

Here is an image:

![Landscape](https://img0.baidu.com/it/u=1090967238,1582698902&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500)
    `;

    
    // Initial Markdown text
    let markdownText = $state(defaultMarkdown);

    function handleEditorChange(event: CustomEvent<string>) {
        markdownText = event.detail;
    }
    
    function handleLeftResize(event: CustomEvent<number>) {
        leftWidth = event.detail;
    }
    
    function handleRightResize(event: CustomEvent<number>) {
        rightWidth = event.detail;
    }
    
    function formatMarkdown() {
        // Implement markdown formatting logic here
        console.log('Format markdown');
    }
</script>

<div class="h-screen flex flex-col">
    <header class="h-15 flex items-center justify-between px-4 py-1 border-b border-gray-200">
        <a href="/" class="text-xl flex items-center">
            <enhanced:img class="w-12 h-12" src="$lib/images/logo.svg" alt="Logo" />
            <span class="ml-2">{ m.app_name() }</span>
        </a>
        
        <div class="hidden md:flex items-center">
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    <Breadcrumb.Item class="hidden md:block">
                        <Breadcrumb.Link href="#">Username</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator class="hidden md:block" />
                    <Breadcrumb.Item>
                        <Breadcrumb.Page>Project name</Breadcrumb.Page>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
        </div>
        
        <div class="hidden md:flex items-center gap-4">
            <Button variant="link" href="#" size="sm" class="text-primary-foreground">{ m.share() }</Button>
            <Button variant="secondary" href="#" size="sm" class="shadow-md hover:shadow-lg transition-all duration-300">{ m.download() }</Button>
        </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
        <!-- Left Sidebar -->
        <ResizablePanel 
            width={leftWidth} 
            minWidth={LEFT_MIN_WIDTH} 
            maxWidth={LEFT_MAX_WIDTH}
            on:resize={handleLeftResize}
        >
            <div class="h-full p-4 overflow-y-auto">
                <h3 class="text-sm font-semibold text-gray-500 mb-4">Files</h3>
                <div class="text-gray-700">File Tree</div>
            </div>
        </ResizablePanel>

        <!-- Editor Area -->
        <div class="flex-1 flex flex-col bg-gray-50" style="width: calc(100% - {leftWidth + rightWidth}px)">
            <div class="p-2 border-b border-gray-200 bg-white">
                <Button variant="secondary" class="text-gray-600" size="sm" on:click={formatMarkdown}>Format</Button>
            </div>
            <div class="flex-1 h-full">
                <MarkdownEditor initialValue={markdownText} on:change={handleEditorChange} />
            </div>
        </div>

        <!-- Right Preview -->
        <ResizablePanel 
            width={rightWidth} 
            minWidth={RIGHT_MIN_WIDTH} 
            maxWidth={RIGHT_MAX_WIDTH}
            resizeFrom="left"
            on:resize={handleRightResize}
        >
            <div class="h-full p-4 overflow-y-auto">
                <h3 class="text-sm font-semibold text-gray-500 mb-4">Preview</h3>
                <MarkdownPreview content={markdownText} />
            </div>
        </ResizablePanel>
    </div>
</div>
