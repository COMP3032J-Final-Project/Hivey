<script lang="ts">
	import {Button, buttonVariants} from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Trash2 } from 'lucide-svelte';
	import type { updateFileFrom, EditorFileInfo } from '$lib/types/editor';
	import { success, failure } from '$lib/components/ui/toast';
    import { me, mpp } from '$lib/trans'
	import type { TreeNode } from '$lib/types/editor';
	import { getContext } from 'svelte';
	import { deleteFile as deleteAPI } from '$lib/api/editor';

	let { file } : {file : TreeNode}= $props();

	let open = $state(false);
	const { reloadFiles } = getContext<EditorFileInfo>('editor-context');

	const handleTriggerClick = (e: MouseEvent) => {
        e.stopPropagation(); // 阻止事件冒泡
        //e.preventDefault(); // 防止默认行为
    };

	const deleteFile = async (e: Event) => {
		e.preventDefault();
		deleteAPI(file.project_id, file.id);
		await new Promise((resolve) => setTimeout(resolve, 200));
		reloadFiles(file.project_id);
		open = false;
	};
</script>
   
<Dialog.Root bind:open={open}>
	<Dialog.Trigger class={buttonVariants({ size:"sm", variant: "ghost" })} onclick={handleTriggerClick}>
		<span>Delete</span>
		<Trash2 />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{mpp.delete_file()}</Dialog.Title>
	  	</Dialog.Header>
		<form onsubmit={deleteFile}>
		{mpp.delete_file_description()}
		<Dialog.Footer>
			<Button type="submit">Confirm</Button>
			<Dialog.Close id="dialog-close-btn" class="hidden" />
		</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
