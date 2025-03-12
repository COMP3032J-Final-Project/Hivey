<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { Button } from "$lib/components/ui/button";
    import * as Resizable from "$lib/components/ui/resizable/index.js";
    import * as AvatarGroup from '$lib/components/ui/avatar-group';
    import Editor from "$lib/components/editor.svelte";
    import Previewer from "$lib/components/previewer.svelte";
    
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
    <header class="h-12 flex justify-between px-4 bg-primary/50">
        <div class="hidden md:flex items-center">
            Actions Here
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
        <Resizable.Pane defaultSize={40}>
            <Previewer fileType="markdown" content={docContent} />
        </Resizable.Pane>
    </Resizable.PaneGroup>
</div>
