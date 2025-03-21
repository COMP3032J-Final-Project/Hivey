<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import {Button, buttonVariants} from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import { FileDropZone } from "$lib/components/ui/file-drop-zone/index.js";
	import type { NewFile } from '$lib/types/editor';
	import { success, failure } from '$lib/components/ui/toast';
	import { FilePlus, Folder } from 'lucide-svelte';

	interface NavItem {
	title: string;
	url: string;
	icon?: any;
	isActive?: boolean;
	items?: NavItem[];
	}

	interface Data {
	navMain: NavItem[];
	}

	// Sample data
	const SampleData = {
		navMain: [
		{
			title: "Projects",
			url: "#",
			icon: Folder,
			isActive: true,
			items: [
			{
				title: "All",
				url: "#",
			},
			{
				title: "Mine",
				url: "#",
			},
			{
				title: "Shared with Me",
				url: "#",
			},],
		},
		{
			title: "Templates",
			url: "#",
			icon: Folder,
			items: [
			{
				title: "All",
				url: "#",
			},
			{
				title: "Mine",
				url: "#",
			},
			{
				title: "Shared with Me",
				url: "#",
			},
			{
				title: "Favourite",
				url: "#",
			},],
		}]
	};

	let folderValue = $state("");
	let fileTypeValue = $state("");

	const foldersData = [
		{ value: "root", label: "root" },
		{ value: "Projects", label: "Projects" },
		{ value: "Templates", label: "Templates" }
	];

	const triggerContent = $derived(
		foldersData.find((folder) => folder.value === folderValue)?.label ?? "选择文件夹"
	);

	const fileTypes = [
		{ value: "md", label: "md" },
		{ value: "tex", label: "tex" },
		{ value: "typ", label: "typ" }
	];
 
	const triggerContent1 = $derived(
		fileTypes.find((f) => f.value === fileTypeValue)?.label ?? "选择文件类型"
	);

	let formData: NewFile = {
		title: '',      // 文件标题
		suffix: '',     // 文件后缀
		path: '',       // 文件路径
	};


	const createFile = async (e: Event) => {
		console.log('Create file');

		e.preventDefault();

		const filenameInput = document.getElementById('filename') as HTMLInputElement;
		const filename = filenameInput.value.trim();

		try{
			if ( !folderValue || !fileTypeValue || !filename) {
				console.log('Please complete the form', folderValue, fileTypeValue, filename);
				throw new Error("Please complete the form");
			}
			else{
				formData = {
					title: filename,      // 文件标题
					suffix: fileTypeValue, // 文件后缀
					path: folderValue,    // 文件路径
				};
				//TODO 接后端

				console.log(formData);
				success('Create file successfully');
				document.getElementById("dialog-close-btn")?.click();
			}
		} catch (error) {
			// 直接使用错误消息
			const errorMessage = (error as Error).message;
			failure(errorMessage || m.error_unknown());
		}
	};

	let files = $state<File[]>([]);
	let uploading = false;

	async function handleUpload(uploadedFiles: File[]) {
		files = uploadedFiles;
		console.log('上传的文件:', files);
	}
</script>


<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "outline", size: "icon" })} aria-label="New File">
		<FilePlus class="w-5 h-5" /> 
	</Dialog.Trigger> 
    <Dialog.Content class="sm:max-w-[500px]">
		<Tabs.Root value="createFile" class="w-[400px]">
			<Tabs.List>
			  	<Tabs.Trigger value="createFile">Create new file</Tabs.Trigger>
			  	<Tabs.Trigger value="uploadFile">Upload file</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="createFile">
				<form onsubmit={createFile}>
					<div class="grid gap-4 py-4">
						<div class="flex items-center justify-center gap-4">
							<Label for="folder-select" class="text-right w-1/3">选择文件夹：</Label>
							<Select.Root type="single" name="folder" bind:value={folderValue}>
								<Select.Trigger id="folder-select" class="w-[180px]">
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
						<div class="flex items-center justify-center gap-4">
							<Label for="filename" class="text-right w-1/3">输入文件名：</Label>
							<Input id="filename" name="filename" value="" class="w-[180px]" />
						</div>
						<div class="flex items-center justify-center gap-4">
							<Label for="filetype" class="text-right w-1/3">选择文件类型：</Label>
							<Select.Root type="single" name="filetype" bind:value={fileTypeValue}>
								<Select.Trigger id="filetype" class="w-[180px]">
								{triggerContent1}
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										{#each fileTypes as fileType}
										<Select.Item value={fileType.value} label={fileType.label}
											>{fileType.label}</Select.Item
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
			</Tabs.Content>
			<Tabs.Content value="uploadFile">
				<FileDropZone onUpload={handleUpload} maxFiles={5} maxFileSize={10 * 1024 * 1024}>
					<p>拖拽文件到这里，或点击选择文件</p>
				</FileDropZone>
				{#if files.length}
					<h3>已选择文件：</h3>
					<ul>
						{#each files as file}
						<li>{file.name} - {(file.size / 1024).toFixed(2)} KB</li>
						{/each}
					</ul>
					<Button onclick={() => handleUpload} disabled={uploading}>
						{uploading ? '上传中...' : '上传文件'}
					</Button>
				{/if}
			</Tabs.Content>
		</Tabs.Root>
    </Dialog.Content>
</Dialog.Root>

