<script lang="ts">
  import {Button, buttonVariants} from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Trash2 } from 'lucide-svelte';
  import { me, mpp } from '$lib/trans'
  import type { TreeNode } from '$lib/types/editor';
  import { deleteFile } from '$lib/api/editor';
  import { files, tempFolders, setTempFolders, setFilesStruct } from './../store.svelte';
  import { buildFileTree } from '$lib/utils'; 

	let { file } : {file : TreeNode}= $props();
	let deleteDialogRef: HTMLElement | null = $state(null);

	const deleteFolderRecursively = async (folder: TreeNode) => {
		if (!folder.children || folder.children.length === 0) {
			// 空文件夹，直接删除
			setTempFolders($tempFolders.filter((f: TreeNode) => f.id !== folder.id));
			console.log('delete folder', folder.filename);
			console.log('tempFolders', $tempFolders);
			return;
		}
		// 递归删除子文件夹及文件
		for (const child of folder.children) {
			if (child.filetype === 'file') {
				await deleteFile(child.project_id, child.id);
				console.log('delete file', child.filename);
			} else {
				// 递归删除子文件夹
				await deleteFolderRecursively(child);
			}
		}
		// 删除当前文件夹本身
		setTempFolders($tempFolders.filter((f: TreeNode) => f.id !== folder.id));
		console.log('delete folder', folder.filename);
	};

	const handleTriggerClick = (e: MouseEvent) => {
        e.stopPropagation(); // 阻止事件冒泡
    };

	const handleDeleteFile = async (e: Event) => {
		e.preventDefault();
		if (file.filetype === 'file') {
			await deleteFile(file.project_id, file.id);
		} else {
			await deleteFolderRecursively(file);
		}
		const filesStruct = buildFileTree($files, $tempFolders)
		setFilesStruct(filesStruct);
		deleteDialogRef?.click();
	};
</script>
  
<Dialog.Root>
	<Dialog.Trigger class="flex w-full items-center justify-between p-0" onclick={handleTriggerClick}>
		<span>Delete</span>
		<Trash2 class="size-4" />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{mpp.delete_file()}</Dialog.Title>
	  </Dialog.Header>
		<form onsubmit={handleDeleteFile}>
      {mpp.delete_file_description()}
      <Dialog.Footer>
        <Button type="submit">Confirm</Button>
        <Dialog.Close bind:ref={deleteDialogRef} class="hidden" />
      </Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
