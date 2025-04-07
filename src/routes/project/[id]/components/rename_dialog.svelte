<script lang="ts">
	import {Button, buttonVariants} from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Pencil } from 'lucide-svelte';
	import type { updateFileFrom, EditorFileInfo } from '$lib/types/editor';
	import { success, failure } from '$lib/components/ui/toast';
    import { me, mpp } from '$lib/trans'
	import { getContext } from 'svelte';
	import { getFolders } from '$lib/utils';
	import type { TreeNode } from '$lib/types/editor';

	let { file } : {file : TreeNode}= $props();

	let open = $state(false);

	const handleTriggerClick = (e: MouseEvent) => {
        e.stopPropagation(); // 阻止事件冒泡
    };

	const renameFile = async (e: Event) => {
		e.preventDefault();

		const filenameInput = document.getElementById('filename') as HTMLInputElement;
		const filename = filenameInput.value.trim();
		console.log('Edit file:', file.id, ' to:', filename);
		// TODO: 接入后端
		open = false;
	};
</script>
   
<Dialog.Root bind:open={open}>
	<Dialog.Trigger class={buttonVariants({ size:"sm", variant: "ghost" })} onclick={handleTriggerClick}>
		<span>Rename</span>
		<Pencil />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{mpp.rename_file()}</Dialog.Title>
	  	</Dialog.Header>
		<form onsubmit={renameFile}>
			<div class="grid gap-4 py-4">
				<div class="flex items-center justify-center gap-4">
					<Input id="filename" name="filename" value={file.filename} placeholder={mpp.enter_folder_name()} class="w-[200px]"/>
				</div>
			</div> 
		<Dialog.Footer>
			<Button type="submit">Confirm</Button>
			<Dialog.Close id="dialog-close-btn" class="hidden" />
		</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
