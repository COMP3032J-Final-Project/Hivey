<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import * as Menubar from "$lib/components/ui/menubar";
    import { Button } from "$lib/components/ui/button";
    import * as Resizable from "$lib/components/ui/resizable/index.js";
    import * as AvatarGroup from '$lib/components/ui/avatar-group';
    import Editor from "$lib/components/editor.svelte";
    import Previewer from "$lib/components/previewer.svelte";
    import Exportbutton from "$lib/components/edit-button/export-button.svelte";
    import Watchbutton from "$lib/components/edit-button/watch-button.svelte";
    import FullScreenbutton from "$lib/components/edit-button/full-screen-button.svelte";
    import BoldButton from '$lib/components/edit-button/bold-button.svelte';
    import ItalicButton from '$lib/components/edit-button/italic-button.svelte';
    
    let docContent = $state("");

    function formatMarkdown() {
        // Implement markdown formatting logic here
        console.log('Format markdown');
    }

    const members = [
		    {
			      username: 'huntabyte',
			      image: 'https://github.com/huntabyte.png'
		    },
		    {
			      username: 'AdrianGonz97',
			      image: 'https://github.com/AdrianGonz97.png'
		    },
		    {
			      username: 'shyakadavis',
			      image: 'https://github.com/shyakadavis.png'
		    }
	  ];
</script>

<div class="h-screen flex flex-col">
    <header class="h-12 flex justify-between px-4 bg-sidebar">
        <div class="hidden md:flex items-center">
            <Menubar.Root class="border-0 bg-transparent">
                <Menubar.Menu>
                    <Menubar.Trigger >File</Menubar.Trigger>
                    <Menubar.Content>
                        <Menubar.Item>
                            New File
                            <Menubar.Shortcut>⌘T</Menubar.Shortcut>
                        </Menubar.Item>
                        <Menubar.Separator />
                        <Menubar.Sub>
                            <Menubar.SubTrigger>Export As</Menubar.SubTrigger>
                            <Menubar.SubContent>
                                <Menubar.Item>PDF</Menubar.Item>
                                <Menubar.Item>PNG</Menubar.Item>
                            </Menubar.SubContent>
                        </Menubar.Sub>
                    </Menubar.Content>
                </Menubar.Menu>
                <Menubar.Menu>
                    <Menubar.Trigger>Edit</Menubar.Trigger>
                    <Menubar.Content>
                        <Menubar.Item>
                            Search & Replace
                            <Menubar.Shortcut>⌘T</Menubar.Shortcut>
                        </Menubar.Item>
                    </Menubar.Content>
                </Menubar.Menu>
                <Menubar.Menu>
                    <Menubar.Trigger>View</Menubar.Trigger>
                    <Menubar.Content>
                        <Menubar.Item>
                            Search & Replace
                            <Menubar.Shortcut>⌘T</Menubar.Shortcut>
                        </Menubar.Item>
                    </Menubar.Content>
                </Menubar.Menu>
            </Menubar.Root>
        </div>
        
        <div class="flex items-center">
            <span class="text-xl font-medium">Project Name</span>
        </div>
        
        <div class="hidden md:flex items-center gap-4">
            <AvatarGroup.Root>
	              {#each members as member (member.username)}
		                <AvatarGroup.Member class="size-8">
			                  <AvatarGroup.MemberImage src={member.image} alt={member.username} />
			                  <AvatarGroup.MemberFallback>
				                    {member.username[0]}
			                  </AvatarGroup.MemberFallback>
		                </AvatarGroup.Member>
	              {/each}
	              <AvatarGroup.Etc class="size-8" plus={2} />
            </AvatarGroup.Root>
        </div>
    </header>

    <Resizable.PaneGroup direction="horizontal" autoSaveId="project">
        <Resizable.Pane defaultSize={20}>
            <div class="h-full p-4 overflow-y-auto">
                <h3 class="text-sm font-semibold text-gray-500 mb-4">Files</h3>
                <div class="text-gray-700">File Tree</div>
            </div>
        </Resizable.Pane>
        <Resizable.Handle />
        <Resizable.Pane  defaultSize={40}>
            <div class="flex-1 flex flex-col h-full">
                <div class="p-2 border-b flex space-x-2 items-end">
                    <Button variant="secondary" size="sm" onclick={formatMarkdown}>Markdown</Button>
                    <BoldButton/>
                    <ItalicButton/>
                </div>
                <div class="flex-1 h-full">
                    <Editor bind:value={docContent}/>
                </div>
            </div>
        </Resizable.Pane>
        <Resizable.Handle />
        <Resizable.Pane defaultSize={40}>
            <div class="flex-1 flex flex-col h-full">
                <div class="p-2 border-b">
                    <div class="flex justify-between items-center">
                        <div class="flex space-x-2">
                            <p class="p-3 h-9 flex items-center justify-center">Preview</p>
                        </div>
                        <div class="flex space-x-2">
                            <Exportbutton/>
                            <Watchbutton/>
                            <FullScreenbutton/>
                        </div>
                    </div>
                </div>
                <div class="flex-1 h-full overflow-y-auto"> 
                    <Previewer fileType="markdown" content={docContent} />
                </div>
            </div>
        </Resizable.Pane>
    </Resizable.PaneGroup>
</div>
