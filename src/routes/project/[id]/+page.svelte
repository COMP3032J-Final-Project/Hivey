<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import * as Menubar from "$lib/components/ui/menubar";
    import { Button } from "$lib/components/ui/button";
    import * as Resizable from "$lib/components/ui/resizable/index.js";
    import * as AvatarGroup from '$lib/components/ui/avatar-group';
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import Editor_md from "$lib/components/editor-md.svelte";
    import Previewer_md from "$lib/components/previewer-md.svelte";
    import Exportbutton from "$lib/components/edit-button/export-button.svelte";
    import Bold from "@lucide/svelte/icons/bold";
    import Italic from "@lucide/svelte/icons/italic";
    import Underline from "@lucide/svelte/icons/underline";
    
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
        <Resizable.Pane  defaultSize={50}>
            <div class="flex-1 flex flex-col h-full">
                <div class="p-2 border-b flex space-x-2 items-center">
                    <Sidebar.Trigger class="-ml-1" />
                    <Separator orientation="vertical" class="mr-2 h-4" />
                    <Button variant="secondary" size="sm" onclick={formatMarkdown}>Markdown</Button>
                    <ToggleGroup.Root type="multiple">
                        <ToggleGroup.Item value="bold" aria-label="Toggle bold">
                          <Bold class="size-4 p-0" />
                        </ToggleGroup.Item>
                        <ToggleGroup.Item value="italic" aria-label="Toggle italic">
                          <Italic class="size-4 p-0" />
                        </ToggleGroup.Item>
                        <ToggleGroup.Item value="strikethrough" aria-label="Toggle strikethrough">
                          <Underline class="size-4 p-0" />
                        </ToggleGroup.Item>
                    </ToggleGroup.Root>
                </div>
                <div class="flex-1 h-full">
                    <Editor_md bind:value={docContent}/>
                </div>
            </div>
        </Resizable.Pane>
        <Resizable.Handle />
        <Resizable.Pane defaultSize={50}>
            <div class="flex-1 flex flex-col h-full">
                <div class="p-2 border-b">
                    <div class="flex justify-between items-center">
                        <div class="flex">
                            <p class="p-3 h-10 flex items-center justify-center">Preview</p>
                        </div>
                        <div class="flex">
                          <Exportbutton />
                        </div>
                    </div>
                </div>
                <div class="flex-1 h-full overflow-y-auto"> 
                    <Previewer_md fileType="markdown" content={docContent} />
                </div>
            </div>
        </Resizable.Pane>
    </Resizable.PaneGroup>
</div>
