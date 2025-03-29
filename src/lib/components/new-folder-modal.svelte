<script lang="ts">
	import {Button, buttonVariants} from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { FolderPlus } from 'lucide-svelte';
	import type { createFileFrom, EditorFileInfo } from '$lib/types/editor';
	import { success, failure } from '$lib/components/ui/toast';
    import { me, mpp } from '$lib/trans'
	import { createFile as createNewFile } from '$lib/api/editor';
	import { getContext } from 'svelte';

	let { projectId } : {projectId : string}= $props();
	const { reloadFiles } = getContext<EditorFileInfo>('editor-context');
	const project_id = projectId;

	let folderValue = $state("");

	const foldersData = [
		{ value: "root", label: "root" },
	];

	const triggerContent = $derived(
		foldersData.find((folder) => folder.value === folderValue)?.label ?? mpp.choose_file_path()
	);

	let formData: createFileFrom = {
		title: '',      	// 文件标题
		suffix: '',     	// 文件后缀
		path: '',       	// 文件路径
		filetype: 'folder',	// 文件类型
	};

	const createFolder = async (e: Event) => {
		console.log('Create folder');

		e.preventDefault();

		const foldernameInput = document.getElementById('foldername') as HTMLInputElement;
		const foldername = foldernameInput.value.trim();

		try{
			if ( !foldername) {
				console.log('Please complete the form');
				throw new Error("Please complete the form");
			}
			else{
				formData = {
					title: foldername,
					suffix: '',     	// 文件后缀
					path: '',       	// 文件路径
					filetype: 'folder',	// 文件类型
				};
				//TODO 接后端
				createNewFile(project_id, formData);
				success('Create file successfully');
				document.getElementById("dialog-close-btn")?.click();
				if (reloadFiles) {
					// Assume file has an id property, or use title as fallback
					await reloadFiles(projectId);
					console.log("reload files for projectId:", projectId);
				}
			}
		} catch (error) {
			// 直接使用错误消息
			const errorMessage = (error as Error).message;
			failure(errorMessage || me.error_unknown());
		}
	};
</script>
   
<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "ghost", size: "icon"})}>
		<FolderPlus />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{mpp.create_new_folder()}</Dialog.Title>
	  	</Dialog.Header>
		<form onsubmit={createFolder}>
			<div class="grid gap-4 py-4">
				<Input id="foldername" name="foldername" value="" placeholder={mpp.enter_folder_name()} />
			</div>
		<Dialog.Footer>
			<Button type="submit">Confirm</Button>
			<Dialog.Close id="dialog-close-btn" class="hidden" />
		</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
