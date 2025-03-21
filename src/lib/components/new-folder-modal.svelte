<script lang="ts">
	import {Button, buttonVariants} from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { FilePlus, Folder } from 'lucide-svelte';

	import { writable } from 'svelte/store';
	import type { SidebarFolder } from '$lib/types/editor';

	let { items }: { items: SidebarFolder[] } = $props();

	const folders = writable(items);

	// function createFolder(index: number, event: Event) {
	// 	const input = event.target as HTMLInputElement;
	// 	const newTitle = input.value.trim();

	// 	//TODO 连接后端
	// 	folders.update((currentItems) => {
	// 		currentItems[index].title = newTitle || 'New Folder';
	// 		currentItems[index].isEditing = false; // 结束编辑
	// 		return [...currentItems];
	// 	});
	// }
	const createFolder = async (e: Event) => {
		console.log('Create folder');
		e.preventDefault();
	};
</script>


<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "outline", size: "icon" })} aria-label="New File">
		<FilePlus class="w-5 h-5" /> 
	</Dialog.Trigger> 
    <Dialog.Content class="sm:max-w-[500px]">
		<Dialog.Header class="items-center">
			<Dialog.Title>Create new file</Dialog.Title>
			<Dialog.Description>
			Make changes to your profile here. Click save when you're done.
			</Dialog.Description>
		</Dialog.Header>
		<form onsubmit={createFolder}>
			<div class="flex items-center justify-center gap-4">
				<Label for="filename" class="text-right w-1/3">输入文件名：</Label>
				<Input id="filename" name="filename" value="" class="w-[180px]" />
			</div>
			<Dialog.Footer>
				<Button type="submit">Confirm</Button>
			</Dialog.Footer>
		</form>
    </Dialog.Content>
</Dialog.Root>

