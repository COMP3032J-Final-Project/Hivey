<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { Button } from "$lib/components/ui/button/index";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { writable } from 'svelte/store';
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
            <textarea class="flex-1 p-4 font-mono text-sm outline-none resize-none bg-transparent" placeholder="Start typing..."/>
        </div>

        <!-- Right Preview -->
        <div class="relative border-gray-200 overflow-y-auto" style="width: {$rightWidth}px">
            <div class="p-4">
                <h3 class="text-sm font-semibold text-gray-500 mb-4">Preview</h3>
                <!-- Content -->
                <div class="text-gray-700">Preview Content</div>
            </div>
            <div class="absolute top-0 left-[-2px] w-1 h-full bg-gray-200 hover:bg-gray-300 cursor-col-resize" on:mousedown={startRightDrag}/>
        </div>
        
    </div>
</div>