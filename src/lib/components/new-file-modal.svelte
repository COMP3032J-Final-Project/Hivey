<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { FileDropZone } from '$lib/components/ui/file-drop-zone/index.js';
	import type { createFileFrom, EditorFileInfo } from '$lib/types/editor';
	import { success, failure } from '$lib/components/ui/toast';
	import { FilePlus } from 'lucide-svelte';
	import { me, mpp } from '$lib/trans';
	import { createFile as createNewFile } from '$lib/api/editor';
	import { getContext } from 'svelte';
	import { getFolders } from '$lib/utils';
	import { UserPermissionEnum } from '$lib/types/auth';

	let { projectId, currentUser }: { projectId: string; currentUser: any } = $props();
	const { currentFiles: latestFiles, reloadFiles } = getContext<EditorFileInfo>('editor-context');

	const project_id = projectId;
	let dialogOpen = $state(false);

	let folderValue = $state('');
	let fileTypeValue = $state('');
	let foldersData = $state([{ value: 'root', label: 'root' }]);

	latestFiles?.subscribe((value) => {
		foldersData = getFolders(value);
		console.log('[Create File Dialog] Folder update to:', foldersData);
	});

	const triggerContent = $derived(
		foldersData.find((folder) => folder.value === folderValue)?.label ?? mpp.choose_file_path()
	);

	const fileTypes = [
		{ value: 'md', label: 'md' },
		{ value: 'tex', label: 'tex' },
		{ value: 'typ', label: 'typ' }
	];

	const triggerContent1 = $derived(
		fileTypes.find((f) => f.value === fileTypeValue)?.label ?? mpp.choose_file_type()
	);

	let formData: createFileFrom = {
		title: '', // 文件标题
		suffix: '', // 文件后缀
		path: '', // 文件路径
		filetype: 'file' // 文件类型
	};

	const createFile = async (e: Event) => {
		console.log('Create file');

		e.preventDefault();

		const filenameInput = document.getElementById('filename') as HTMLInputElement;
		const filename = filenameInput.value.trim();

		try {
			if (!folderValue || !fileTypeValue || !filename) {
				console.log('Please complete the form', folderValue, fileTypeValue, filename);
				throw new Error('Please complete the form');
			} else {
				if (folderValue == 'root') {
					folderValue = '';
				}
				formData = {
					title: filename, // 文件标题
					suffix: fileTypeValue, // 文件后缀
					path: folderValue, // 文件路径
					filetype: 'file' // 文件类型
				};
				console.log(formData);
				createNewFile(project_id, formData);
				success('Create file successfully');
				document.getElementById('dialog-close-btn')?.click();
				console.log('[Create File Dialog] Reload files for projectId:', projectId);
				// 后端有延迟，必须要等一会
				await new Promise((resolve) => setTimeout(resolve, 200));
				await reloadFiles(projectId);
			}
		} catch (error) {
			// 直接使用错误消息
			const errorMessage = (error as Error).message;
			failure(errorMessage || me.unknown());
		}
	};

	let files = $state<File[]>([]);
	let uploading = false;

	async function handleUpload(uploadedFiles: File[]) {
		files = uploadedFiles;
		console.log('upload file:', files);
	}

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
		aria-label="New File"
		onclick={handleTriggerClick}
	>
		<FilePlus />
	</Dialog.Trigger>
	<Dialog.Content>
		<Tabs.Root value="createFile">
			<Tabs.List>
				<Tabs.Trigger value="createFile">{mpp.create_new_file()}</Tabs.Trigger>
				<Tabs.Trigger value="uploadFile">{mpp.upload_file()}</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="createFile">
				<form onsubmit={createFile}>
					<div class="grid gap-4 py-4">
						<div class="flex items-center justify-center gap-4">
							<Label for="filename" class="w-1/4 text-right">{mpp.file_name()}</Label>
							<Input
								id="filename"
								name="filename"
								placeholder={mpp.enter_file_name()}
								class="w-[250px]"
							/>
						</div>
						<div class="flex items-center justify-center gap-4">
							<Label for="filetype" class="w-1/4 text-right">{mpp.file_type()}</Label>
							<Select.Root type="single" name="filetype" bind:value={fileTypeValue}>
								<Select.Trigger id="filetype" class="w-[250px]">
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
						<div class="flex items-center justify-center gap-4">
							<Label for="folder-select" class="w-1/4 text-right">{mpp.file_path()}</Label>
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
			</Tabs.Content>
			<Tabs.Content value="uploadFile">
				<FileDropZone onUpload={handleUpload} maxFiles={5} maxFileSize={10 * 1024 * 1024}>
					<p>{mpp.upload_file_hint()}</p>
				</FileDropZone>
				{#if files.length}
					<h3>{mpp.select_file()}</h3>
					<ul>
						{#each files as file}
							<li>{file.name} - {(file.size / 1024).toFixed(2)} KB</li>
						{/each}
					</ul>
					<Button onclick={() => handleUpload} disabled={uploading}>
						{uploading ? mpp.uploading_file() : mpp.upload_file()}
					</Button>
				{/if}
			</Tabs.Content>
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>
