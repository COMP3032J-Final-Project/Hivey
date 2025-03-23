<script lang="ts">
  import { Checkbox } from '$lib/components/ui/checkbox';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { Button } from '$lib/components/ui/button';

  export let checked: boolean = false;
  export let indeterminate: boolean = false;
  export let onCheckedChange: (value: boolean) => void;
  export let onDelete: () => void;
  
  let showDeleteDialog = false;
  
  function handleDelete() {
    showDeleteDialog = false;
    onDelete();
  }
</script>

<div class="flex items-center space-x-2">
  <Checkbox 
    {checked}
    {indeterminate}
    onCheckedChange={onCheckedChange}
    aria-label="Select all"
  />
  {#if checked || indeterminate}
    <Button 
      variant="ghost" size="icon"
      onclick={() => showDeleteDialog = true}
      aria-label="Delete selected items"
    >
      <Trash2 class="h-4 w-4" />
    </Button>
  {/if}
</div> 

<AlertDialog.Root bind:open={showDeleteDialog}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete all your selected projects.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action onclick={handleDelete}>Delete</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
