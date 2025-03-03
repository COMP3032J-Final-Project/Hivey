<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { Button } from "$lib/components/ui/button/index";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { writable } from 'svelte/store';
    import MarkdownIt from 'markdown-it';
    let { children } = $props();
    
    const leftWidth = writable(200);
    const rightWidth = writable(650);
    const LEFT_MIN_WIDTH = 100;
    const LEFT_MAX_WIDTH = 300;
    const RIGHT_MIN_WIDTH = 500;
    const RIGHT_MAX_WIDTH = 800;
    
    // left
    let isDraggingLeft = false;
    let startX = 0;
    let startLeftWidth = 0;

    function startLeftDrag(e: MouseEvent) {
      isDraggingLeft = true;
      startX = e.clientX;
      startLeftWidth = $leftWidth;
      window.addEventListener('mousemove', handleLeftDrag);
      window.addEventListener('mouseup', stopLeftDrag);
    }

    function handleLeftDrag(e: MouseEvent) {
      if (!isDraggingLeft) return;
      const delta = e.clientX - startX;
      const newWidth = Math.min(LEFT_MAX_WIDTH, Math.max(LEFT_MIN_WIDTH, startLeftWidth + delta));
      leftWidth.set(newWidth);
    }

    function stopLeftDrag() {
      isDraggingLeft = false;
      window.removeEventListener('mousemove', handleLeftDrag);
      window.removeEventListener('mouseup', stopLeftDrag);
    }

    // right
    let isDraggingRight = false;
    let startRightWidth = 0;

    function startRightDrag(e: MouseEvent) {
      isDraggingRight = true;
      startX = e.clientX;
      startRightWidth = $rightWidth;
      window.addEventListener('mousemove', handleRightDrag);
      window.addEventListener('mouseup', stopRightDrag);
    }

    function handleRightDrag(e: MouseEvent) {
      if (!isDraggingRight) return;
      const delta = startX - e.clientX;
      const newWidth = Math.min(RIGHT_MAX_WIDTH, Math.max(RIGHT_MIN_WIDTH, startRightWidth + delta));
      rightWidth.set(newWidth);
    }

    function stopRightDrag() {
      isDraggingRight = false;
      window.removeEventListener('mousemove', handleRightDrag);
      window.removeEventListener('mouseup', stopRightDrag);
    }

    // 初始化 MarkdownIt 实例
    const markdownRender = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    });
    
    // 初始 Markdown 文本
    let markDownText = $state(
    `
# Heading 1

## Heading 2

### Heading 3

This is a link to [Google](https://www.google.com/).

Here is an example of inline code: \`console.log('Hello, World!');\`.

Below is a code block:

\`\`\`javascript
function greet(name) {
    console.log(\`Hello, ${name}!\`);
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

`
    );

    // 渲染 Markdown 文本
    let renderMdText = (text: string) => {
    return markdownRender.render(text);
    };

    // 实时更新预览
    let previewHtml = writable('');

    $effect(() => {
    const htmlString = renderMdText(markDownText);
    previewHtml.set(htmlString);
    console.log("previewHtml:", $previewHtml);
    });
</script>

<div class="h-screen flex flex-col">
    <header class="h-15 flex items-center justify-between px-4 py-1 border-b border-gray-200">
        <a href="/" class="text-xl flex items-center">
            <enhanced:img class="w-12 h-12" src="$lib/images/logo.svg" alt="Logo" />
            <span class="ml-2">{ m.app_name() }</span>
        </a>
        <div class="hidden md:flex items-center">
            <div class="flex items-center">
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
        </div>
        <div class="hidden md:flex items-center gap-8">
            <div class="flex items-center gap-4">
                <Button variant="link" href="#" size="sm" class="text-primary-foreground">{ m.share() }</Button>
                <Button variant="secondary" href="#" size="sm" class="shadow-md hover:shadow-lg transition-all duration-300">{ m.download() }</Button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
        <!-- Left Sidebar -->
        <div class="relative border-gray-200 overflow-y-auto" style="width: {$leftWidth}px">
            <div class="p-4">
                <h3 class="text-sm font-semibold text-gray-500 mb-4">Files</h3>
                <!-- Content -->
                <div class="text-gray-700">File Tree</div>
            </div>
            <div class="absolute top-0 right-[-2px] w-1 h-full bg-gray-200 hover:bg-gray-300 cursor-col-resize" on:mousedown={startLeftDrag}/>
        </div>

        <!-- Editor Area -->
        <div class="flex-1 flex flex-col bg-gray-50" style="width: calc(100% - {$leftWidth + $rightWidth}px)">
            <div class="p-2 border-b border-gray-200 bg-white">
                <Button variant="secondary" class="text-gray-600" size="sm">Format</Button>
            </div>
            <textarea
                class="editor-area"
                bind:value={markDownText}
                placeholder="Start typing...">
            </textarea>
            <!-- <textarea class="flex-1 p-4 font-mono text-sm outline-none resize-none bg-transparent" placeholder="Start typing..."/> -->
        </div>

        <!-- Right Preview -->
        <div class="relative border-gray-200 overflow-y-auto" style="width: {$rightWidth}px">
            <div class="p-4">
                <h3 class="text-sm font-semibold text-gray-500 mb-4">Preview</h3>
                <!-- 插槽用于放置预览内容 -->
                <!-- {@html previewHtml} -->
                <div class="preview-area">
                    {@html $previewHtml}
                </div>
            </div>
            <div class="absolute top-0 left-[-2px] w-1 h-full bg-gray-200 hover:bg-gray-300 cursor-col-resize" on:mousedown={startRightDrag}/>
        </div>
        
    </div>
</div>


<style>
    .editor-area {
        width: 100%;
        height: 100%;
        padding: 16px;
        font-family: monospace;
        font-size: 14px;
        line-height: 1.5;
        border: none;
        outline: none;
        resize: none;
        background-color: #f9f9f9;
    }

    .preview-area {
        width: 100%;
        height: 100%;
        padding: 16px;
        overflow-y: auto;
        background-color: #fff;
    }

    .preview-area :global(h1) {
        font-size: 24px;
        line-height: 48px;
        font-weight: 800;
    }

    .preview-area :global(h2) {
        font-size: 22px;
        line-height: 42px;
        font-weight: 700;
    }

    .preview-area :global(h3) {
        font-size: 20px;
        line-height: 36px;
        font-weight: 600;
    }

    .preview-area :global(img) {
        width: 500px;
    }

    .preview-area :global(a) {
        color: #335fee;
        line-height: 20px;
    }

    .preview-area :global(p) {
        line-height: 20px;
    }

    .preview-area :global(ol) {
    list-style-type: decimal;
    padding-left: 20px;
    }

    .preview-area :global(ul) {
        list-style-type: disc;
        padding-left: 20px;
    }

    .preview-area :global(li) {
        margin-bottom: 8px;
    }

    .preview-area :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    }

    .preview-area :global(th),
    .preview-area :global(td) {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    }

    .preview-area :global(th) {
    background-color: #f5f5f5;
    font-weight: bold;
    }

    .preview-area :global(tbody tr:nth-child(odd)) {
    background-color: #f9f9f9;
    }

    .preview-area :global(tbody tr:nth-child(even)) {
    background-color: #fff;
    }

    .preview-area :global(tbody tr:hover) {
    background-color: #f1f1f1;
    }

    .preview-area :global(thead) {
    position: sticky;
    top: 0;
    background-color: #f5f5f5;
    z-index: 1;
    }

    @media (max-width: 768px) {
    .preview-area :global(table) {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
    }
    }
</style>