<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { Button } from "$lib/components/ui/button";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb";
    import * as Resizable from "$lib/components/ui/resizable/index.js";
    import Editor from "$lib/components/editor.svelte";
    import Previewer from "$lib/components/previewer.svelte";
    
    let docContent = $state("");

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

    <Resizable.PaneGroup direction="horizontal">
        <Resizable.Pane defaultSize={20}>
            <div class="h-full p-4 overflow-y-auto">
                <h3 class="text-sm font-semibold text-gray-500 mb-4">Files</h3>
                <div class="text-gray-700">File Tree</div>
            </div>
        </Resizable.Pane>
        <Resizable.Handle />
        <Resizable.Pane>
            <div class="flex-1 flex flex-col bg-gray-50">
                <div class="p-2 border-b border-gray-200 bg-white">
                    <Button variant="secondary" class="text-gray-600" size="sm" onclick={formatMarkdown}>Format</Button>
                </div>
                <div class="flex-1 h-full">
                    <Editor bind:value={docContent}/>
                </div>
            </div>
        </Resizable.Pane>
        <Resizable.Handle />
        <Resizable.Pane>
            <Previewer fileType="markdown" content={docContent} />
        </Resizable.Pane>
    </Resizable.PaneGroup>
</div>
