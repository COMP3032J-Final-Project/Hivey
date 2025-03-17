<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { ChevronRight } from 'lucide-svelte';
	import CreateFileDialog from '$lib/components/new-file-modal.svelte';
	import { writable } from 'svelte/store';
	import { FolderPlus, Folder } from 'lucide-svelte';

	let {
		groupName,
		items
	}: {
		groupName: string;
		items: {
			title: string;
			url: string;
			icon?: any;
			isActive?: boolean;
			isEditing?: boolean;
			items?: {
				title: string;
				url: string;
			}[];
		}[];
	} = $props();

	const folders = writable(items);

	function addNewFolder() {
		// 检查是否有正在编辑的文件夹
		const currentFolders = $folders;
		const isEditing = currentFolders.some(item => item.isEditing);
		if (isEditing) return; // 如果有正在编辑的文件夹，则不新建

		folders.update(currentItems => [
			...currentItems,
			{ title: "", url: "#", isEditing: true, icon: Folder } // 初始文件夹名为空
		]);
	}

	function saveFolderName(index: number, event: Event) {
		const input = event.target as HTMLInputElement;
		const newTitle = input.value.trim();

		// 接后端
		folders.update(currentItems => {
			currentItems[index].title = newTitle || "New Folder";
			currentItems[index].isEditing = false; // 退出编辑状态
			return [...currentItems];
		});
	}
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel class="flex items-center justify-between">
		{groupName}
		<div class="flex space-x-2">
			<CreateFileDialog />
			<button onclick={() => addNewFolder()}>
				<FolderPlus />
			</button>
		</div>
	</Sidebar.GroupLabel>
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
								onblur={(e) => saveFolderName(i, e)}
								onkeydown={(e) => {
								if (e.key === 'Enter') {
									saveFolderName(i, e);
								}
								}}
								onclick={(e) => e.stopPropagation()}
								autofocus
								class="border p-1 w-full"
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
</Sidebar.Group>
