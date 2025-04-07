<script lang="ts">
	import {Button, buttonVariants} from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { FolderPlus } from 'lucide-svelte';
	import type { createFileFrom, EditorFileInfo } from '$lib/types/editor';
	import { success, failure } from '$lib/components/ui/toast';
    import { me, mpp } from '$lib/trans'
	import { createFile as createNewFile } from '$lib/api/editor';
	import { getContext } from 'svelte';
	import { getFolders } from '$lib/utils';

	let { projectId } : {projectId : string}= $props();
	const { currentFiles: latestFiles, reloadFiles } = getContext<EditorFileInfo>('editor-context');
	
	const project_id = projectId;

	let folderValue = $state("");
	let foldersData = $state([
		{ value: "root", label: "root" },
	]);

	latestFiles?.subscribe((value) => {
        foldersData = getFolders(value);
		console.log('[Create Folder Dialog] Files value:', value);
        console.log('[Create Folder Dialog] Folder update to:', foldersData);
    });

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
				if( folderValue == "root" ){
					folderValue = "" ;
				}
				formData = {
					title: foldername,
					suffix: '',     	// 文件后缀
					path: folderValue,  // 文件路径
					filetype: 'folder',	// 文件类型
				};
				//TODO 接后端
				createNewFile(project_id, formData);
				success('Create file successfully');
				document.getElementById("dialog-close-btn")?.click();
				console.log("[Create Folder Dialog] Reload files for projectId:", projectId);
				// 后端有延迟，必须要等一会
				await new Promise(resolve => setTimeout(resolve, 200));
				await reloadFiles(projectId);
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
				<div class="flex items-center justify-center gap-4">
					<Label for="filename" class="text-right w-1/4">{mpp.folder_name()}</Label>
					<Input id="foldername" name="foldername" value="" placeholder={mpp.enter_folder_name()} class="w-[250px]"/>
				</div>
				<div class="flex items-center justify-center gap-4">
					<Label for="folder-select" class="text-right w-1/4">{mpp.folder_path()}</Label>
					<Select.Root type="single" name="folder" bind:value={folderValue}>
						<Select.Trigger id="folder-select" class="w-[250px]">
							{triggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each foldersData as folder}
								<Select.Item value={folder.value} label={folder.label}
									>{folder.label}</Select.Item
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
