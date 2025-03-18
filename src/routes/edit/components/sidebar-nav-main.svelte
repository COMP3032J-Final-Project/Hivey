<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { ChevronRight } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import type { SidebarFolder } from '$lib/types/editor';

	let { items }: { items: SidebarFolder[] } = $props();

	const folders = writable(items);

	function saveFolderName(index: number, event: Event) {
		const input = event.target as HTMLInputElement;
		const newTitle = input.value.trim();

		//TODO 连接后端
		folders.update((currentItems) => {
			currentItems[index].title = newTitle || 'New Folder';
			currentItems[index].isEditing = false; // 结束编辑
			return [...currentItems];
		});
	}
</script>

<Sidebar.Menu>
	{#each $folders as mainItem, i (mainItem.title)}
		<Collapsible.Root open={mainItem.isActive} class="group/collapsible">
			<Sidebar.MenuItem>
				{#if mainItem.isEditing}
					<div class="flex space-x-2">
						<mainItem.icon />
						<input
							type="text"
							bind:value={mainItem.title}
							onkeydown={(e) => {
								if (e.key === 'Enter') {
									saveFolderName(i, e);
								}
							}}
							onclick={(e) => e.stopPropagation()}
							autofocus
							class="w-full border p-1"
						/>
					</div>
				{:else}
					<Collapsible.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton {...props}>
								{#snippet tooltipContent()}
									{mainItem.title}
								{/snippet}
								{#if mainItem.icon}
									<mainItem.icon />
								{/if}
								<span>{mainItem.title}</span>
								<ChevronRight
									class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
								/>
							</Sidebar.MenuButton>
						{/snippet}
					</Collapsible.Trigger>
					<Collapsible.Content>
						{#if mainItem.items}
							<Sidebar.MenuSub>
								{#each mainItem.items as subItem (subItem.title)}
									<Sidebar.MenuSubItem>
										<Sidebar.MenuSubButton>
											{#snippet child({ props })}
												<a href={subItem.url} {...props}>
													<span>{subItem.title}</span>
												</a>
											{/snippet}
										</Sidebar.MenuSubButton>
									</Sidebar.MenuSubItem>
								{/each}
							</Sidebar.MenuSub>
						{/if}
					</Collapsible.Content>
				{/if}
			</Sidebar.MenuItem>
		</Collapsible.Root>
	{/each}
</Sidebar.Menu>
