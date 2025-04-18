<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { FolderPlus } from 'lucide-svelte';
	import type { createFileFrom, TreeNode } from '$lib/types/editor';
	import { success, failure } from '$lib/components/ui/toast';
	import { me, mpp } from '$lib/trans';
	import { getFolders, buildFileTree } from '$lib/utils';
	import { UserPermissionEnum } from '$lib/types/auth';
	import { files, loadFiles, setFilesStruct, tempFolders, setTempFolders } from '../store.svelte';

	let {
      projectId,
      currentUser,
      iconSize = 24
  }: {
      projectId: string,
      currentUser: any,
      iconSize?: number
  } = $props();

	const project_id = projectId;
	let dialogOpen = $state(false);

	let folderValue = $state('');
	let foldersData = $derived($files ? getFolders($files, $tempFolders) : [{ value: 'root', label: 'root' }]);

	const triggerContent = $derived(
		foldersData.find((folder) => folder.value === folderValue)?.label ?? mpp.choose_file_path()
	);
	const createFolder = async (e: Event) => {
		console.log('Create folder');

		e.preventDefault();

		const foldernameInput = document.getElementById('foldername') as HTMLInputElement;
		const foldername = foldernameInput.value.trim();

		try {
			if (!foldername) {
				console.log('Please complete the form');
				throw new Error('Please complete the form');
			} else {
				if (folderValue == 'root') {
					folderValue = '';
				}
				//TODO 接后端
				const newNode: TreeNode = {
					id: project_id + $tempFolders.length,        // 需确保唯一性
					project_id: project_id,
					filename: foldername,
					filepath: folderValue + '/' + foldername,
					filetype: "folder",         // 或 'file' 根据需求修改
					children: []                // 文件夹建议用空数组，文件用 null
				};
				setTempFolders([...$tempFolders, newNode]);
				console.log('newNode', newNode);
				console.log('tempFolders', $tempFolders);
				console.log('foldersData', foldersData);
				success('Create folder successfully');
				document.getElementById('dialog-close-btn')?.click();
				const filesStruct = buildFileTree($files, $tempFolders)
				console.log('filesStruct', filesStruct);
				setFilesStruct(filesStruct);
			}
		} catch (error) {
			// 直接使用错误消息
			const errorMessage = (error as Error).message;
			failure(errorMessage || me.unknown());
		}
	};

	const handleTriggerClick = (e: MouseEvent) => {
		if (currentUser.permission === UserPermissionEnum.Viewer) {
			e.preventDefault();
			failure(mpp.error_no_permission());
			return;
		}
		dialogOpen = true;
	};
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'ghost', size: 'icon' })}
		onclick={handleTriggerClick}
	>
		<FolderPlus size={iconSize} />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{mpp.create_new_folder()}</Dialog.Title>
		</Dialog.Header>
		<form onsubmit={createFolder}>
			<div class="grid gap-4 py-4">
				<div class="flex items-center justify-center gap-4">
					<Label for="filename" class="w-1/4 text-right">{mpp.folder_name()}</Label>
					<Input
						id="foldername"
						name="foldername"
						value=""
						placeholder={mpp.enter_folder_name()}
						class="w-[250px]"
					/>
				</div>
				<div class="flex items-center justify-center gap-4">
					<Label for="folder-select" class="w-1/4 text-right">{mpp.folder_path()}</Label>
					<Select.Root type="single" name="folder" bind:value={folderValue}>
						<Select.Trigger id="folder-select" class="w-[250px]">
							{triggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each foldersData as folder}
									<Select.Item value={folder.value} label={folder.label}>{folder.label}</Select.Item
									>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Confirm</Button>
				<Dialog.Close id="dialog-close-btn" class="hidden" />
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
