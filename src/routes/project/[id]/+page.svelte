<script lang="ts">
  import * as m from '$lib/paraglide/messages';
  import * as Menubar from "$lib/components/ui/menubar";
  import { Button } from "$lib/components/ui/button";
  import * as Resizable from "$lib/components/ui/resizable/index.js";
  import * as AvatarGroup from '$lib/components/ui/avatar-group';
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
  import { Pencil } from 'lucide-svelte';
  import Editor from "$lib/components/editor.svelte";
  import Previewer from "$lib/components/previewer.svelte";
  import InviteButton from "./components/button/invite-button.svelte";
  import Exportbutton from "./components/button/export-button.svelte";
  import Bold from "@lucide/svelte/icons/bold";
  import Italic from "@lucide/svelte/icons/italic";
  import Underline from "@lucide/svelte/icons/underline";
  import { Input } from "$lib/components/ui/input/index.js";
  import { putUpdateProject } from '$lib/api/dashboard';
  import { success, failure } from '$lib/components/ui/toast';
  import { onMount } from 'svelte';
  import type { Project } from '$lib/types/dashboard';
  import type { PageProps } from './$types';
  import type { User } from '$lib/types/auth';

  let { data }: PageProps = $props();
  
  let project: Project = $state(data.project);
  let members: User[] = $state(data.members);
  let currentUser: User = $state(data.currentUser);
  let isEditingName = $state(false);
  let tempProjectName = $state("");

  let docContent = $state("");

  function formatMarkdown() {
      //TODO Implement markdown formatting logic here
      console.log('Format markdown');
  }

  async function handleProjectNameUpdate() {
      try {
          const updatedProject = await putUpdateProject({
              id: project.id,
              name: tempProjectName
          });
          project.name = updatedProject.name;
          isEditingName = false;
          success('Project name modified success');
      } catch (error) {
          failure('Project name modified failed');
      }
  }

  function startEditing() {
      tempProjectName = project.name;
      isEditingName = true;
  }
</script>

<div class="size-full flex flex-col">
  <header class="h-12 flex justify-between px-4 border-b">
    <div class="hidden md:flex items-center">
      <Sidebar.Trigger class="-ml-1" />
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
      {#if isEditingName}
        <div class="flex items-center gap-2">
          <Input 
            bind:value={tempProjectName} 
            class="w-48"
            onkeydown={(e) => {
              if (e.key === 'Enter') {
              handleProjectNameUpdate();
              } else if (e.key === 'Escape') {
                isEditingName = false;
              }
              }}
          />
          <Button variant="ghost" size="sm" onclick={handleProjectNameUpdate}>Save</Button>
          <Button variant="ghost" size="sm" onclick={() => isEditingName = false}>Cancel</Button>
        </div>
      {:else}
        <span class="text-xl font-medium">{project.name}</span>
        <Button variant="ghost" size="icon" class="ml-2" onclick={startEditing}>
          <Pencil class="size-4" />
        </Button>
      {/if}
    </div>
        
    <div class="hidden md:flex items-center gap-4">
      <AvatarGroup.Root>
	      {#each members.slice(0, 3) as member (member.username)}
		      <AvatarGroup.Member class="size-8">
			      <AvatarGroup.MemberImage src={member.avatar} alt={member.username} />
			      <AvatarGroup.MemberFallback>
				      {member.username[0]}
			      </AvatarGroup.MemberFallback>
		      </AvatarGroup.Member>
	      {/each}
	      {#if members.length > 3}
          <AvatarGroup.Etc class="size-8" plus={members.length - 3} />
        {/if}
      </AvatarGroup.Root>
      <InviteButton currentUser={currentUser} projectId={project.id} />
    </div>
  </header>

  <Resizable.PaneGroup direction="horizontal" autoSaveId="project">

    <Resizable.Pane  defaultSize={50}>
      <div class="flex flex-col h-full">
        <div class="p-1 border-b flex space-x-2 items-center">
          <Button size="sm" onclick={formatMarkdown}>Format</Button>
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
        <div class="flex-1">
          <Editor bind:value={docContent}
            username={data.currentUser.username}
            project_id={data.project.id}
            access_token={data.authInfo.access_token}
          />
        </div>
      </div>
    </Resizable.Pane>

    <Resizable.Handle />

    <Resizable.Pane defaultSize={50}>
      <div class="flex-1 flex flex-col h-full">
        <div class="p-1 border-b">
          <div class="flex justify-between items-center">
            <div class="flex">
              <p class="p-3 h-10 flex items-center justify-center">Preview</p>
            </div>
            <div class="flex">
              <Exportbutton />
            </div>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto"> 
          <Previewer fileType="markdown" content={docContent} />
        </div>
      </div>
    </Resizable.Pane>

  </Resizable.PaneGroup>
</div>
