<script lang="ts">
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import Trash2 from '@lucide/svelte/icons/trash-2';
  import Star from '@lucide/svelte/icons/star';
  import { CirclePlus } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { deleteProject, deleteProjects, createProjectFromTemplate, favoriteTemplate } from '$lib/api/dashboard';
  import { notification, success } from '$lib/components/ui/toast';
  import { me, mpd } from '$lib/trans';
  import { failure } from '$lib/components/ui/toast';
  import { invalidateAll } from '$app/navigation';
  import { Input } from '$lib/components/ui/input/index.js';
  import { goto } from '$app/navigation';
  import { localizeHref } from '$lib/paraglide/runtime';

	let { id, selectedIds = [], onDelete, isFavorite = false, isOwner = false }: { id: string; selectedIds?: string[]; onDelete?: () => void; isFavorite?: boolean; isOwner?: boolean } = $props();
	let showDeleteDialog = $state(false);
  let showBulkDeleteDialog = $state(false);
  let showCreateProjectDialog = $state(false);
  let newProjectName = $state('');
  let isCreating = $state(false);
  let errorMessage = $state('');
  let isTogglingFavorite = $state(false);

  async function handleDelete() {
    try {
      await deleteProject(id);
      notification('Template deleted successfully');
      showDeleteDialog = false;
      if (onDelete) onDelete();
      await invalidateAll();
    } catch (error) {
      if (error instanceof Error) {
        notification(error.message);
      } else {
        notification(me.unknown());
      }
    }
  }

  async function handleBulkDelete() {
    try {
      await deleteProjects(selectedIds);
      notification('Templates deleted successfully');
      showBulkDeleteDialog = false;
      if (onDelete) onDelete();
      await invalidateAll();
    } catch (error) {
      if (error instanceof Error) {
        notification(error.message);
      } else {
        notification(me.unknown());
      }
    }
  }
  
  async function handleCreateProject() {
    errorMessage = '';
    
    if (!newProjectName.trim()) {
      errorMessage = 'Project name cannot be empty';
      return;
    }
    
    isCreating = true;
    try {
      const project = await createProjectFromTemplate(id, newProjectName);
      success(mpd.success_project_create());
      showCreateProjectDialog = false;
      newProjectName = '';
      await invalidateAll();
      
      await goto(localizeHref(`/project/${project.id}`));
    } catch (error) {
      if (error instanceof Error) {
        failure(error.message);
      } else {
        failure(me.unknown());
      }
    } finally {
      isCreating = false;
    }
  }
  
  function handleCancel() {
    newProjectName = '';
    errorMessage = '';
    showCreateProjectDialog = false;
  }
  
  $effect(() => {
    if (!showCreateProjectDialog) {
      newProjectName = '';
      errorMessage = '';
    }
  });

  async function handleToggleFavorite() {
    isTogglingFavorite = true;
    try {
      const newStatus = await favoriteTemplate(id);
      if (newStatus) {
        success('Template added to favorites');
      } else {
        success('Template removed from favorites');
      }
      isFavorite = newStatus;
      await invalidateAll();
      window.location.reload();
    } catch (error) {
      if (error instanceof Error) {
        failure(error.message);
      } else {
        failure(me.unknown());
      }
    } finally {
      isTogglingFavorite = false;
    }
  }
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<Ellipsis />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
			<DropdownMenu.Item
				class="flex items-center justify-between"
				onclick={() => (showCreateProjectDialog = true)}
				aria-label="Create project from template" >
				Create
				<CirclePlus class="ml-2 size-4" />
			</DropdownMenu.Item>
      <DropdownMenu.Item
				class="flex items-center justify-between"
				onclick={handleToggleFavorite}
				aria-label="Toggle favorite" >
				{isFavorite ? 'Unfavourite' : 'Favourite'}
				<Star class={`ml-2 size-4 ${isFavorite ? 'fill-primary' : ''}`} />
			</DropdownMenu.Item>
			{#if isOwner}
			<DropdownMenu.Item
				class="flex items-center justify-between"
				onclick={() => (showDeleteDialog = true)}
				aria-label="Delete selected items" >
				Delete
				<Trash2 class="ml-2 size-4" />
			</DropdownMenu.Item>
			{/if}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<AlertDialog.Root bind:open={showDeleteDialog}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete this template.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action onclick={handleDelete}>Delete</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={showCreateProjectDialog}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Create Project from Template</AlertDialog.Title>
    </AlertDialog.Header>

    <div class="space-y-4">
      <Input 
        id="project-name" 
        name="project-name"
        bind:value={newProjectName} 
        type="text" 
        placeholder="Enter project name" 
      />

      {#if errorMessage}
        <div class="text-sm text-destructive">{errorMessage}</div>
      {/if}
    </div>

    <AlertDialog.Footer>
      <AlertDialog.Cancel onclick={handleCancel}>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action onclick={handleCreateProject} disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Create'}
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

{#if selectedIds && selectedIds.length > 0 && isOwner}
	<div class="fixed bottom-4 right-4">
		<Button
			variant="destructive"
			class="flex items-center gap-2"
			onclick={() => (showBulkDeleteDialog = true)}
		>
			<Trash2 class="size-4" />
			Delete Selected ({selectedIds.length})
		</Button>
	</div>
{/if}

<AlertDialog.Root bind:open={showBulkDeleteDialog}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete {selectedIds.length} selected templates.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action onclick={handleBulkDelete}>Delete</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root> 
