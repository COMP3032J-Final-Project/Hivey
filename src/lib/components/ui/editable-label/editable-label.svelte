<script lang="ts">
	import { cn } from '$lib/utils';
	import { Pencil } from 'lucide-svelte';
	import { Input } from '../input/index';
	import { Button } from '../button/index';
	import { Loader2 } from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	let {
		initialText = '',
		handleUpdateValueFn = async (value: string) => value,
		spanClass = '',
		inputClass = ''
	}: {
		initialText?: string;
		handleUpdateValueFn?: (value: string) => Promise<string | null> | string | null;
		spanClass?: string;
		inputClass?: string;
	} = $props();

	let isEditing = $state(false);
	let text = $state(initialText);
	let labelText = $state(initialText);
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let isHovered = $state(false);

	async function handleUpdate() {
		try {
			isLoading = true;
			error = null;
			const result = await handleUpdateValueFn(text);
			if (result !== null) {
				labelText = result;
			}
			isEditing = false;
			text = labelText;
			isHovered = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to update';
		} finally {
			isLoading = false;
		}
	}

	function handleInputKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleUpdate();
		} else if (e.key === 'Escape') {
			isEditing = false;
			text = labelText;
			isHovered = false;
		}
	}

	function startEditing() {
		error = null;
		isEditing = true;
	}

	function cancelEditing() {
		isEditing = false;
		text = labelText;
		isHovered = false;
	}
</script>

<div class="flex flex-col gap-2">
	<div
		class="group flex items-center"
		onmouseenter={() => (isHovered = true)}
		onmouseleave={() => (isHovered = false)}
	>
		{#if isEditing}
			<div class={cn('flex items-center gap-2', inputClass)}>
				<Input bind:value={text} class="w-48" onkeydown={handleInputKeyDown} disabled={isLoading} />
				<Button variant="ghost" size="sm" onclick={handleUpdate} disabled={isLoading}>
					{#if isLoading}
						<Loader2 class="size-4 animate-spin" />
					{:else}
						Save
					{/if}
				</Button>
				<Button variant="ghost" size="sm" onclick={cancelEditing} disabled={isLoading}>
					Cancel
				</Button>
			</div>
		{:else}
			<span class={cn('text-xl font-medium', spanClass)}>{labelText}</span>
			{#if isHovered}
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button variant="ghost" size="icon" class="ml-2" onclick={startEditing}>
							<Pencil class="size-4" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>Click to rename</Tooltip.Content>
				</Tooltip.Root>
			{/if}
		{/if}
	</div>

	{#if error}
		<div class="text-sm text-red-500">{error}</div>
	{/if}
</div>
