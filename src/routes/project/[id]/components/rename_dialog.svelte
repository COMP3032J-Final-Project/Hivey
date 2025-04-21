<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Pencil } from 'lucide-svelte';
	import { me, mpp } from '$lib/trans';
	import type { TreeNode, updateFileFrom } from '$lib/types/editor';
	import { updateFile } from '$lib/api/editor';
	import { loadFiles, tempFolders } from './../store.svelte';

	let { file }: { file: TreeNode } = $props();

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

		let formData: updateFileFrom = {
			filename: filename,
			filepath: file.filepath
		};
		updateFile(file.project_id, file.id, formData);
		await new Promise((resolve) => setTimeout(resolve, 200));
		loadFiles(file.project_id, $tempFolders);
		open = false;
	};
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class="flex w-full items-center justify-between p-0" onclick={handleTriggerClick}>
		<span>Rename</span>
		<Pencil class="size-4" />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{mpp.rename_file()}</Dialog.Title>
		</Dialog.Header>
		<form onsubmit={renameFile}>
			<div class="grid gap-4 py-4">
				<div class="flex items-center justify-center gap-4">
					<Input
						id="filename"
						name="filename"
						value={file.filename}
						placeholder={mpp.enter_folder_name()}
						class="w-[200px]"
					/>
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Confirm</Button>
				<Dialog.Close id="dialog-close-btn" class="hidden" />
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
