<script lang="ts">
  import {Button, buttonVariants} from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Trash2 } from 'lucide-svelte';
  import { me, mpp } from '$lib/trans'
  import type { TreeNode } from '$lib/types/editor';
  import { deleteFile } from '$lib/api/editor';
  import { loadFiles, tempFolders } from './../store.svelte';

	let { file } : {file : TreeNode}= $props();

	let open = $state(false);

	const handleTriggerClick = (e: MouseEvent) => {
        e.stopPropagation(); // 阻止事件冒泡
        //e.preventDefault(); // 防止默认行为
    };

	const handleDeleteFile = async (e: Event) => {
		e.preventDefault();
		await deleteFile(file.project_id, file.id);
		loadFiles(file.project_id, $tempFolders);
		open = false;
	};
</script>
   
<Dialog.Root bind:open={open}>
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
        <Dialog.Close id="dialog-close-btn" class="hidden" />
      </Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
