<script lang="ts">
  import * as m from '$lib/paraglide/messages';
  import * as Menubar from "$lib/components/ui/menubar";
  import { Button } from "$lib/components/ui/button";
  import * as Resizable from "$lib/components/ui/resizable/index.js";
  import * as AvatarGroup from '$lib/components/ui/avatar-group';
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
  import { Pencil } from 'lucide-svelte';
  import Editor_md from "$lib/components/editor-md.svelte";
  import Previewer_md from "$lib/components/previewer-md.svelte";
  import InviteButton from "./components/button/invite-button.svelte";
  import Exportbutton from "./components/button/export-button.svelte";
  import Bold from "@lucide/svelte/icons/bold";
  import Italic from "@lucide/svelte/icons/italic";
  import Underline from "@lucide/svelte/icons/underline";
  import { Input } from "$lib/components/ui/input/index.js";
  import { putUpdateProject } from '$lib/api/dashboard';
  import { success, failure } from '$lib/components/ui/toast';
  import { onMount, getContext } from 'svelte';
  import type { Project } from '$lib/types/dashboard';
  import { ProjectType } from '$lib/types/dashboard';
  import type { EditorFileType } from '$lib/types/editor';
    
  import type { User } from '$lib/types/auth';

  let { data } = $props();

  let project: Project = $state(data.project);
  let members: User[] = $state(data.members);
  let docContent = $state("");
  let isEditing = $state(false);
  let tempProjectName = $state("");
  let project: Project | null = $state(null);

  const ctx = getContext<EditorFileType>('editor-context');

  async function loadComponents(fileType: string) {
    try {
      switch (fileType) {
        case "md":
          Editor = (await import("$lib/components/editor-md.svelte")).default;
          Previewer = (await import("$lib/components/previewer-md.svelte")).default;
          break;
        // 其他文件类型...
        default:
          // 默认加载 Markdown 组件
          Editor = (await import("$lib/components/editor-md.svelte")).default;
          Previewer = (await import("$lib/components/previewer-md.svelte")).default;
      }
    } catch (error) {
        console.error("Failed to load components:", error);
    }
  }
  
  $effect(() => {
    const unsubscribe = ctx.currentFileType.subscribe((type: string) => {
    console.log('[Page] currentFileType:', type);
    loadComponents(type);
  });

    return () => unsubscribe();
  });

  let Editor = $state<typeof Editor_md | null>(Editor_md);
  let Previewer = $state<typeof Previewer_md | null>(Previewer_md);


  onMount(async () => {
      try {
          const projectId = window.location.pathname.split('/').pop() ?? '';
          project = await getProjectById(projectId);
          if (project) {
              projectName = project.name;
          }
      } catch (error) {
          failure('Failed to load project');
      }
  });

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
          isEditing = false;
          success('Project name modified success');
      } catch (error) {
          failure('Project name modified failed');
      }
  }

  function startEditing() {
      tempProjectName = project.name;
      isEditing = true;
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
      {#if isEditing}
        <div class="flex items-center gap-2">
          <Input 
            bind:value={tempProjectName} 
            class="w-48"
            onkeydown={(e) => {
              if (e.key === 'Enter') {
              handleProjectNameUpdate();
              } else if (e.key === 'Escape') {
                isEditing = false;
              }
              }}
          />
          <Button variant="ghost" size="sm" onclick={handleProjectNameUpdate}>Save</Button>
          <Button variant="ghost" size="sm" onclick={() => isEditing = false}>Cancel</Button>
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
	      {#each members as member (member.username)}
		      <AvatarGroup.Member class="size-8">
			      <AvatarGroup.MemberImage src={member.avatar} alt={member.username} />
			      <AvatarGroup.MemberFallback>
				      {member.username[0]}
			      </AvatarGroup.MemberFallback>
		      </AvatarGroup.Member>
	      {/each}
	      <AvatarGroup.Etc class="size-8" plus={2} />
      </AvatarGroup.Root>
      <InviteButton />
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
          <Editor bind:value={docContent}/>
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
