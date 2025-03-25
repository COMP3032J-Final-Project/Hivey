<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { closeProjectDialog } from '../../../../store.svelte';
	import type { CreateProjectForm, ProjectFormCategory } from '$lib/types/dashboard';
	import { success, failure } from '$lib/components/ui/toast';
	import { mpd } from '$lib/trans';
	import { goto } from '$app/navigation';

	let {
		open = $bindable(false),
		category = 'blank' as ProjectFormCategory,
		onSubmit = async (form: CreateProjectForm) => {}
	} = $props();

	const dialogTitleMap = {
		blank: mpd.create_blank_project(),
		example: mpd.create_example_project(),
		upload: mpd.upload_project()
	};

	let projectName = $state('');
	let projectFile = $state<File | null>(null);
	let errorMessage = $state('');

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		(e.currentTarget as HTMLElement).classList.remove('bg-muted/50');

		if (e.dataTransfer?.files?.length) {
			const file = e.dataTransfer.files[0];

			// 检查文件类型
			if (!file.name.endsWith('.zip')) {
				errorMessage = mpd.error_project_format();
				return;
			}

			// 检查文件大小 (50MB)
			if (file.size > 52428800) {
				errorMessage = mpd.error_project_size();
				return;
			}

			projectFile = file;
		}
	}

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			// 检查文件大小
			if (input.files[0].size > 52428800) {
				errorMessage = mpd.error_project_size();
				input.value = '';
			} else {
				projectFile = input.files[0];
			}
		}
	}

	async function handleSubmit() {
		errorMessage = '';

		if (!projectName.trim()) {
			errorMessage = mpd.error_empty_project_name();
			return;
		}

		if (category === 'upload' && !projectFile) {
			errorMessage = mpd.error_empty_project_file();
			return;
		}

		let createProjectForm: CreateProjectForm = {
			name: projectName,
			category: category,
			file: projectFile || undefined
		};

		try {
			const project = await onSubmit(createProjectForm);
      console.log(project);
			success(mpd.success_project_create());
      goto(`/project/${project.id}`);
		} catch (error) {
			failure(mpd.error_project_create());
		} finally {
			// 重置表单
			projectName = '';
			projectFile = null;
			errorMessage = '';
			closeProjectDialog();
		}
	}

	function handleCancel() {
		// 重置表单
		projectName = '';
		projectFile = null;
		errorMessage = '';
		closeProjectDialog();
	}

	$effect(() => {
		if (!open) {
			projectName = '';
			projectFile = null;
			errorMessage = '';
		}
	});
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{dialogTitleMap[category]}</AlertDialog.Title>
			{#if category === 'upload'}
				<AlertDialog.Description>{mpd.upload_file_description()}</AlertDialog.Description>
			{/if}
		</AlertDialog.Header>

		<div class="space-y-4">
			<div class="space-y-2">
				<label for="project-name" class="text-sm font-medium">{mpd.project_name()}</label>
				<Input id="project-name" bind:value={projectName} type="text" placeholder={mpd.input_project_name()} />
			</div>

			{#if category === 'upload'}
				<div class="space-y-2">
					<label for="project-file" class="text-sm font-medium">{mpd.project_file()}</label>
					{#if projectFile}
						<div class="flex items-center justify-between rounded-md border p-3">
							<span class="truncate">{projectFile.name}</span>
							<button
								type="button"
								class="ml-2 text-destructive hover:underline"
								onclick={() => {
									projectFile = null;
								}}
							>
								{mpd.delete_project_file()}
							</button>
						</div>
					{:else}
						<button
							type="button"
							class="w-full cursor-pointer rounded-md border-2 border-dashed p-4 text-center transition-colors hover:bg-muted/50"
							onclick={() => document.getElementById('project-file')?.click()}
							ondragover={(e) => {
								e.preventDefault();
								e.stopPropagation();
								e.currentTarget.classList.add('bg-muted/50');
							}}
							ondragleave={(e) => {
								e.preventDefault();
								e.stopPropagation();
								e.currentTarget.classList.remove('bg-muted/50');
							}}
							ondrop={handleDrop}
						>
							<p class="mb-2 text-sm text-muted-foreground">{mpd.drop_file_here()}</p>
							<p class="text-xs text-muted-foreground">{mpd.upload_file_description()}</p>
							<input
								type="file"
								id="project-file"
								accept=".zip"
								class="hidden"
								onchange={handleFileChange}
							/>
						</button>
					{/if}
				</div>
			{/if}

			{#if errorMessage}
				<div class="text-sm text-destructive">{errorMessage}</div>
			{/if}
		</div>

		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={handleCancel}>{mpd.cancel()}</AlertDialog.Cancel>
			<AlertDialog.Action onclick={handleSubmit}>
				{mpd.create()}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
