<script lang="ts">
  import Ellipsis from "@lucide/svelte/icons/ellipsis";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Dialog from '$lib/components/ui/dialog';
  import { removeMember, updateMember } from "../../store.svelte";
  import { getProjectMemberPermission, removeProjectMember, updateProjectMemberPermission } from '$lib/api/project';
  import { UserPermissionEnum } from '$lib/types/auth';
  import { failure, notification } from '$lib/components/ui/toast';
  
  let { id, projectId, currentUser }: { id: string; projectId: string; currentUser: any } = $props();
  let isDeleting = $state(false);
  let dialogOpen = $state(false);
  let permissionDialogOpen = $state(false);
  let isUpdating = $state(false);
  let selectedPermission = $state<string>("");
  let currentMemberPermission = $state<UserPermissionEnum | null>(null);
  
  // 权限选项
  const permissionOptions = [
    { value: UserPermissionEnum.Admin, label: 'Admin' },
    { value: UserPermissionEnum.Writer, label: 'Writer' },
    { value: UserPermissionEnum.Viewer, label: 'Viewer' }
  ];

  // 根据当前用户权限过滤可选权限
  function getAvailablePermissions() {
    if (currentUser.permission === UserPermissionEnum.Owner) {
      return permissionOptions;
    } else if (currentUser.permission === UserPermissionEnum.Admin) {
      // Admin只能设置Writer和Viewer权限
      return permissionOptions.filter(p => 
        p.value === UserPermissionEnum.Writer || 
        p.value === UserPermissionEnum.Viewer
      );
    }
    return [];
  }

  async function handleDelete() {
    try {
      isDeleting = true;
      await removeProjectMember({
        currentUser,
        projectId,
        memberName: id
      });
      removeMember(id);
      notification(`Member ${id} has been removed!`);
    } catch (error) {
      failure(error instanceof Error ? error.message : "Failed to remove member"); 
    } finally {
      isDeleting = false;
      dialogOpen = false;
    }
  }

  async function fetchCurrentPermission() {
    try {
      const permission = await getProjectMemberPermission(projectId, id);
      currentMemberPermission = permission;
      selectedPermission = permission;
    } catch (error) {
      failure("Failed to fetch member permission");
    }
  }

  async function handleEditPermission() {
    permissionDialogOpen = true;
    await fetchCurrentPermission();
  }

  async function handlePermissionUpdate() {
    try {
      if (!selectedPermission) {
        failure("Please select a permission");
        return;
      }

      const typedSelectedPermission = selectedPermission as UserPermissionEnum;

      // 权限没变化
      if (typedSelectedPermission === currentMemberPermission) {
        permissionDialogOpen = false;
        return;
      }

      isUpdating = true;
      await updateProjectMemberPermission({
        currentUser,
        projectId,
        memberName: id,
        newPermission: typedSelectedPermission
      });
      
      // 更新本地状态
      updateMember(id, { permission: typedSelectedPermission });
      notification(`Permission updated for ${id}`);
      permissionDialogOpen = false;
    } catch (error) {
      failure(error instanceof Error ? error.message : "Failed to update permission");
    } finally {
      isUpdating = false;
    }
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
    <DropdownMenu.Item onclick={() => dialogOpen = true} class="text-destructive">Delete Member</DropdownMenu.Item>
   </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<!-- 删除成员对话框 -->
<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Remove Member</Dialog.Title>
      <Dialog.Description>
        Are you sure you want to remove {id} from this project?
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => dialogOpen = false} disabled={isDeleting}>Cancel</Button>
      <Button variant="destructive" onclick={handleDelete} disabled={isDeleting}>
        {isDeleting ? "Removing..." : "Remove"}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- 编辑权限对话框 -->
<Dialog.Root bind:open={permissionDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Edit Permission</Dialog.Title>
      <Dialog.Description>
        Change permission level for {id}
      </Dialog.Description>
    </Dialog.Header>
    <div class="py-4">
      <div class="relative w-full">
        <select
          class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          bind:value={selectedPermission}
          disabled={isUpdating}
        >
          <option value="">Select permission</option>
          {#each getAvailablePermissions() as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => permissionDialogOpen = false} disabled={isUpdating}>Cancel</Button>
      <Button variant="default" onclick={handlePermissionUpdate} disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Save"}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
