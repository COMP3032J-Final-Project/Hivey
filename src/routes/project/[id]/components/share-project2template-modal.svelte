<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { success, failure } from '$lib/components/ui/toast';
	import { Share } from 'lucide-svelte';
	import { shareProject2Template } from '$lib/api/project';
	import { UserPermissionEnum } from '$lib/types/auth';
	import type { Project } from '$lib/types/dashboard';
	import type { ShareProject2TemplateForm } from '$lib/types/editor';
	let {
      projectId,
      currentUser,
      project,
      iconSize = 24,
      open,
      onOpenChange
  }: {
      projectId: string,
      currentUser: any,
      project: Project,
      iconSize?: number,
      open?: boolean,
      onOpenChange?: (open: boolean) => void
  } = $props();

	let dialogOpen = $state(open || false);
	let templateNameValue = $state(project?.name || '');
	let isPublicValue = $state('public');
  let isCreating = $state(false);

	const visibilityOptions = [
		{ value: 'public', label: 'Public' },
		{ value: 'private', label: 'Private' }
	];

  // 根据isPublicValue的值返回对应的visibilityOptions的label
	const triggerContent = $derived(
		visibilityOptions.find((opt) => opt.value === isPublicValue)?.label ?? 'Choose Visibility'
	);

	const shareProject = async (e: Event) => {
		e.preventDefault();

		try {
			if (!templateNameValue) {
				throw new Error('Enter Template Name');
			}
      isCreating = true;
			const form: ShareProject2TemplateForm = {
				projectId,
				currentUser,
				templateName: templateNameValue,
				isPublic: isPublicValue === 'public'
			};
      await shareProject2Template(form);
			success('Share Template Success!');
			
			// 使用onOpenChange关闭对话框
			if (onOpenChange) {
				dialogOpen = false;
				onOpenChange(false);
			} else {
				document.getElementById('share-dialog-close-btn')?.click();
			}
		} catch (error) {
			const errorMessage = (error as Error).message;
			failure(errorMessage || 'Unknown Error');
		} finally {
      isCreating = false;
    }
	};

	const handleTriggerClick = (e: MouseEvent) => {
		if (currentUser.permission !== UserPermissionEnum.Owner) {
			e.preventDefault();
			failure('You are not the owner of this project!');
			return;
		}
		templateNameValue = project?.name || ''; // 设置默认模板名称为当前项目名称
		dialogOpen = true;
	};

	$effect(() => {
		if (open !== undefined) {
			dialogOpen = open;
			
			// 当对话框打开时，设置模板名称为项目名称
			if (open) {
				templateNameValue = project?.name || '';
			}
		}
	});

	$effect(() => {
		if (onOpenChange && dialogOpen !== open) {
			onOpenChange(dialogOpen);
		}
	});
</script>

<Dialog.Root bind:open={dialogOpen}>
	{#if !onOpenChange}
	<Dialog.Trigger
		class={buttonVariants({ variant: 'ghost', size: 'icon' })}
		aria-label="Share as Template"
		onclick={handleTriggerClick}
	>
		<Share size={iconSize} />
	</Dialog.Trigger>
	{/if}
  
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Share as Template</Dialog.Title>
			<Dialog.Description>Share your project as a template</Dialog.Description>
		</Dialog.Header>
		<form onsubmit={shareProject}>
			<div class="grid gap-4 py-4">
				<div class="flex items-center gap-4">
					<div class="text-right whitespace-nowrap">Template Name</div>
					<Input
						id="template-name"
						name="template-name"
						placeholder="Enter Template Name"
						class="flex-1"
						bind:value={templateNameValue}
					/>
				</div>
				<div class="flex items-center gap-4">
					<div class="text-right whitespace-nowrap">Visibility</div>
					<div class="flex-1">
						<Select.Root type="single" name="visibility" bind:value={isPublicValue}>
							<Select.Trigger id="visibility-select" class="w-full">
								{triggerContent}
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									{#each visibilityOptions as option}
										<Select.Item value={option.value} label={option.label}
											>{option.label}</Select.Item
										>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit" disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Confirm'}
        </Button>
				<Dialog.Close id="share-dialog-close-btn" class="hidden" />
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
