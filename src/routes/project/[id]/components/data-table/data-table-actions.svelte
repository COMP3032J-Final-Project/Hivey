<script lang="ts">
	import { MoreHorizontal, Trash2, Pencil } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { removeMember, updateMember } from '../../store.svelte';
	import {
		getProjectMemberPermission,
		removeProjectMember,
		updateProjectMemberPermission
	} from '$lib/api/project';
	import { UserPermissionEnum } from '$lib/types/auth';
	import { failure, notification } from '$lib/components/ui/toast';
	import { mpp } from '$lib/trans';

	let { id, projectId, currentUser }: { id: string; projectId: string; currentUser: any } =
		$props();
	let isDeleting = $state(false);
	let dialogOpen = $state(false);
	let permissionDialogOpen = $state(false);
	let isUpdating = $state(false);
	let selectedPermission = $state<string>('');
	let currentMemberPermission = $state<UserPermissionEnum | null>(null);
	let menuOpen = $state(false);
	let permissionsLoaded = $state(false);

	// 权限选项
	const permissionOptions = [
		{ value: UserPermissionEnum.Admin, label: mpp.permission_admin() },
		{ value: UserPermissionEnum.Writer, label: mpp.permission_writer() },
		{ value: UserPermissionEnum.Viewer, label: mpp.permission_viewer() }
	];

	// 检查当前用户是否有权限编辑目标成员的权限
	function canEditPermission() {
		// 如果当前用户是 Viewer，不能编辑任何权限
		if (currentUser.permission === UserPermissionEnum.Viewer) {
			return false;
		}

		// 如果当前用户是 Writer，不能编辑任何权限
		if (currentUser.permission === UserPermissionEnum.Writer) {
			return false;
		}

		// 如果当前用户是 Admin
		if (currentUser.permission === UserPermissionEnum.Admin) {
			// Admin 不能编辑其他 Admin 的权限
			if (currentMemberPermission === UserPermissionEnum.Admin) {
				return false;
			}
			// Admin 不能编辑 Owner 的权限
			if (currentMemberPermission === UserPermissionEnum.Owner) {
				return false;
			}
			return true;
		}

		// 如果当前用户是 Owner，可以编辑所有人的权限（除了自己的权限）
		if (currentUser.permission === UserPermissionEnum.Owner) {
			return currentUser.username !== id;
		}

		return false;
	}

	// 检查当前用户是否有权限删除目标成员
	function canDeleteMember() {
		// 任何用户都可以删除自己（离开项目），除了Owner
		if (currentUser.username === id) {
			// Owner只有在项目中没有其他成员时才能离开项目
			if (currentUser.permission === UserPermissionEnum.Owner) {
				// 如果没有成员计数数据，假设不能离开
				return false;
			}
			return currentUser.permission !== UserPermissionEnum.Owner;
		}

		// 如果当前用户是 Viewer 或 Writer，不能删除任何其他人
		if (currentUser.permission === UserPermissionEnum.Viewer || 
			currentUser.permission === UserPermissionEnum.Writer) {
			return false;
		}

		// 如果当前用户是 Admin
		if (currentUser.permission === UserPermissionEnum.Admin) {
			// Admin 不能删除 Owner 或其他 Admin
			if (currentMemberPermission === UserPermissionEnum.Owner || 
				currentMemberPermission === UserPermissionEnum.Admin) {
				return false;
			}
			return true;
		}

		// 如果当前用户是 Owner，可以删除任何其他成员
		if (currentUser.permission === UserPermissionEnum.Owner) {
			return true;
		}

		return false;
	}

	// 根据当前用户权限过滤可选权限
	function getAvailablePermissions() {
		if (currentUser.permission === UserPermissionEnum.Owner) {
			// Owner 不能修改自己的权限
			if (currentUser.username === id) {
				return [];
			}
			// Owner 可以将权限改为任何级别
			return permissionOptions;
		} else if (currentUser.permission === UserPermissionEnum.Admin) {
			// Admin 只能设置 Writer 和 Viewer 权限
			return permissionOptions.filter(
				(p) => p.value === UserPermissionEnum.Writer || p.value === UserPermissionEnum.Viewer
			);
		}
		return [];
	}

	async function handleDelete() {
		try {
			isDeleting = true;
			
			// 如果是删除自己（离开项目）
			if (currentUser.username === id) {
				// 这里可以调用离开项目的API，目前使用removeProjectMember
				await removeProjectMember({
					currentUser,
					projectId,
					memberName: id
				});
				notification(`You have successfully left the project`);
				// 离开项目后跳转到项目列表页
				window.location.href = '/dashboard/repository/projects/all';
				return;
			}
			
			await removeProjectMember({
				currentUser,
				projectId,
				memberName: id
			});
			removeMember(id);
			notification(`Member ${id} has been removed!`);
		} catch (error) {
			failure(error instanceof Error ? error.message : 'Failed to remove member');
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
			permissionsLoaded = true;
		} catch (error) {
			failure('Failed to fetch member permission');
		}
	}

	async function handleEditPermission() {
		permissionDialogOpen = true;
	}

	async function handlePermissionUpdate() {
		try {
			if (!selectedPermission) {
				failure('Please select a permission');
				return;
			}

			const typedSelectedPermission = selectedPermission as UserPermissionEnum;

			// 权限没变化
			if (typedSelectedPermission === currentMemberPermission) {
				permissionDialogOpen = false;
				return;
			}

			// 检查是否有权限编辑
			if (!canEditPermission()) {
				failure(mpp.error_edit_member_permission());
				return;
			}

			// 检查新权限是否在允许范围内
			const availablePermissions = getAvailablePermissions();
			if (!availablePermissions.some((p) => p.value === typedSelectedPermission)) {
				failure(mpp.error_add_member_admin_permission());
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
			failure(error instanceof Error ? error.message : 'Failed to update permission');
		} finally {
			isUpdating = false;
		}
	}

	// 当菜单打开时加载权限
	function handleMenuOpenChange(open: boolean) {
		menuOpen = open;
		if (open && !permissionsLoaded) {
			fetchCurrentPermission();
		}
	}
</script>

<DropdownMenu.Root onOpenChange={handleMenuOpenChange}>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<MoreHorizontal />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
			{#if !permissionsLoaded}
				<DropdownMenu.Item disabled>
					<span>Loading...</span>
				</DropdownMenu.Item>
			{:else}
				{#if canEditPermission()}
					<DropdownMenu.Item onclick={handleEditPermission} class="flex items-center justify-between">
						<span>Edit Permission</span>
						<Pencil class="size-4" />
					</DropdownMenu.Item>
				{/if}
				{#if canDeleteMember()}
					<DropdownMenu.Item onclick={() => (dialogOpen = true)} class="flex items-center justify-between">
						<span>Delete Member</span>
						<Trash2 class="size-4" />
					</DropdownMenu.Item>
				{/if}
				{#if !canEditPermission() && !canDeleteMember()}
					<DropdownMenu.Item disabled>
						<span>No available actions</span>
					</DropdownMenu.Item>
				{/if}
			{/if}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<!-- 删除成员对话框 -->
<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{currentUser.username === id ? 'Leave Project' : 'Remove Member'}</Dialog.Title>
			<Dialog.Description>
				{#if currentUser.username === id}
					Are you sure you want to leave this project?
				{:else}
					Are you sure you want to remove {id} from this project?
				{/if}
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (dialogOpen = false)} disabled={isDeleting}
				>Cancel</Button
			>
			<Button variant="destructive" onclick={handleDelete} disabled={isDeleting}>
				{#if isDeleting}
					{currentUser.username === id ? 'Leaving...' : 'Removing...'}
				{:else}
					{currentUser.username === id ? 'Leaving...' : 'Removing...'}
				{/if}
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
					{#each getAvailablePermissions() as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (permissionDialogOpen = false)} disabled={isUpdating}
				>Cancel</Button>
			<Button variant="default" onclick={handlePermissionUpdate} disabled={isUpdating}>
				{isUpdating ? 'Updating...' : 'Save'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
