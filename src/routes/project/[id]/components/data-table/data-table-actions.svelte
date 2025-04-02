<script lang="ts">
  import Ellipsis from "@lucide/svelte/icons/ellipsis";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
  import { removeMember, updateMember } from "../../store.svelte";
  import { mpp } from '$lib/trans';
  import { getProjectMemberPermission, removeProjectMember, updateProjectMemberPermission } from '$lib/api/project';
  import { UserPermissionEnum } from '$lib/types/auth';
  import { page } from '$app/stores';
  import { success, failure } from '$lib/components/ui/toast';
  
  let { id }: { id: string } = $props();

  function handleDelete() {
    //TODO
    removeMember(id);
  }

  function handleEditPermission() {
    //TODO
    console.log('Edit permission for user:', id);
  }
 </script>
  
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
   {#snippet child({ props })}
    <Button
     {...props}
     variant="ghost"
     size="icon"
     class="relative size-8 p-0"
    >
     <span class="sr-only">Open menu</span>
     <Ellipsis />
    </Button>
   {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
   <DropdownMenu.Group>
    <DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
    <DropdownMenu.Item onclick={handleEditPermission}>Edit Permission</DropdownMenu.Item>
    <DropdownMenu.Item onclick={handleDelete} class="text-destructive">Delete Member</DropdownMenu.Item>
   </DropdownMenu.Group>
  </DropdownMenu.Content>
 </DropdownMenu.Root>
