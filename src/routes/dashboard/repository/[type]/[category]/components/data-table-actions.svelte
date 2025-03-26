<script lang="ts">
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { deleteProject, deleteProjects } from '$lib/api/dashboard';
  import { notification } from '$lib/components/ui/toast';
  import { me } from '$lib/trans';
  import { invalidateAll } from '$app/navigation';

	let { id, selectedIds = [], onDelete }: { id: string; selectedIds?: string[]; onDelete?: () => void } = $props();
	let showDeleteDialog = $state(false);
  let showBulkDeleteDialog = $state(false);

  async function handleDelete() {
    try {
      await deleteProject(id);
      notification('Project deleted successfully');
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
      notification('Projects deleted successfully');
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
			<DropdownMenu.Item class="flex justify-between items-center"
      onclick={() => showDeleteDialog = true}
      aria-label="Delete selected items">
				Delete
				<Trash2 class="ml-2 size-4" />
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<AlertDialog.Root bind:open={showDeleteDialog}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete this project.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action onclick={handleDelete}>Delete</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

{#if selectedIds && selectedIds.length > 0}
  <div class="fixed bottom-4 right-4">
    <Button 
      variant="destructive" 
      class="flex items-center gap-2"
      onclick={() => showBulkDeleteDialog = true}>
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
        This action cannot be undone. This will permanently delete {selectedIds.length} selected projects.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action onclick={handleBulkDelete}>Delete</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
