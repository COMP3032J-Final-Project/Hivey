<script lang="ts">
	import { onMount } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { postCreateProject } from '$lib/api/dashboard';
	import { X, Upload } from 'lucide-svelte';
	import { CreateProjectForm } from '$lib/types/dashboard';

	let { type = 'project', isOpen = false } = $props();

	// 表单状态
	let name = $state('');
	let category = $state('Blank');
	let file = $state<File | null>(null);
	let isSubmitting = $state(false);
	let errorMessage = $state('');

	function onDrop(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer?.files?.length) {
			file = e.dataTransfer.files[0];
		}
	}

	function onFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files?.length) {
			file = target.files[0];
		}
	}

	async function handleSubmit() {
		try {
			isSubmitting = true;
			errorMessage = '';

			if (!name.trim()) {
				errorMessage = '请输入名称';
				return;
			}

			if (category === 'Upload' && !file) {
				errorMessage = '请上传文件';
				return;
			}

			const projectData: CreateProjectForm = {
				name,
				type,
				category,
				file
			};

			await postCreateProject(projectData);

			// 创建成功后关闭模态框并重置表单
			isOpen = false;
			resetForm();
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = '创建失败，请重试';
			}
		} finally {
			isSubmitting = false;
		}
	}

	function resetForm() {
		name = '';
		category = 'Blank';
		file = null;
		errorMessage = '';
	}

	$effect(() => {
		if (!isOpen) {
			resetForm();
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>创建{type === 'project' ? '项目' : '模板'}</Dialog.Title>
			<Dialog.Description>
				填写以下信息创建新的{type === 'project' ? '项目' : '模板'}
			</Dialog.Description>
		</Dialog.Header>

		<form
			class="space-y-4"
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
		>
			<div class="space-y-2">
				<Label for="name">名称</Label>
				<Input id="name" placeholder="输入名称" bind:value={name} required />
			</div>

			<div class="space-y-2">
				<Label>类型</Label>
				<Input value={type} disabled readonly />
			</div>

			<div class="space-y-2">
				<Label>选择类别</Label>
				<RadioGroup.Root bind:value={category} class="flex flex-col space-y-2">
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="Blank" id="blank" />
						<Label for="blank" class="cursor-pointer">空白项目</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="Example" id="example" />
						<Label for="example" class="cursor-pointer">示例项目</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="Upload" id="upload" />
						<Label for="upload" class="cursor-pointer">上传文件</Label>
					</div>
				</RadioGroup.Root>
			</div>

			{#if category === 'Upload'}
				<div class="space-y-2">
					<Label>上传文件</Label>
					{#if file}
						<div class="flex items-center justify-between rounded-md border p-3">
							<span class="truncate">{file.name}</span>
							<Button
								variant="ghost"
								size="icon"
								class="h-8 w-8"
								type="button"
								onclick={() => (file = null)}
							>
								<X class="h-4 w-4" />
							</Button>
						</div>
					{:else}
						<button
							type="button"
							class="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 transition-colors hover:bg-muted/50"
							ondragover={(e) => e.preventDefault()}
							ondrop={(e) => {
								e.preventDefault();
								onDrop(e);
							}}
							onclick={() => document.getElementById('file-input')?.click()}
						>
							<Upload class="h-8 w-8 text-muted-foreground" />
							<p class="text-sm text-muted-foreground">拖放文件或点击上传</p>
							<input type="file" id="file-input" class="hidden" onchange={onFileChange} />
						</button>
					{/if}
				</div>
			{/if}

			{#if errorMessage}
				<div class="text-sm text-destructive">{errorMessage}</div>
			{/if}

			<Dialog.Footer>
				<Button variant="outline" type="button" onclick={() => (isOpen = false)}>取消</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? '创建中...' : '创建'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
