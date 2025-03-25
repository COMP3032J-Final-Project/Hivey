<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Ellipsis } from 'lucide-svelte';
	import { ChevronRight } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import type { SidebarFolder, SidebarFile } from '$lib/types/editor';

	let { folders_tmp, files_tmp }: { folders_tmp: SidebarFolder[] , files_tmp: SidebarFile[]} = $props();

	const folders = writable(folders_tmp);
	const files = writable(files_tmp);
</script>

<Sidebar.Menu>
	{#each $folders as mainItem, i (mainItem.title)}
		<Collapsible.Root open={mainItem.isActive} class="group/collapsible">
			<Sidebar.MenuItem>
				<Collapsible.Trigger>
					{#snippet child({ props })}
						<Sidebar.MenuButton {...props}>
							{#snippet tooltipContent()}
								{mainItem.title}
							{/snippet}
							<ChevronRight
								class="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
							/>
							{#if mainItem.icon}
								<mainItem.icon />
							{/if}
							<span>{mainItem.title}</span>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuAction {...props}>
									<Ellipsis />
									</Sidebar.MenuAction>
								{/snippet}
								</DropdownMenu.Trigger>
								<DropdownMenu.Content side="right" align="start">
								<DropdownMenu.Item>
									<span>Rename</span>
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<span>Delete</span>
								</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Sidebar.MenuButton>
					{/snippet}
				</Collapsible.Trigger>
				<Collapsible.Content>
					{#if mainItem.items}
						<Sidebar.MenuSub>
							{#each mainItem.items as subItem (subItem.title)}
								{console.log('Rendering subItem:', subItem)}
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
			</Sidebar.MenuItem>
		</Collapsible.Root>
	{/each}
	{#each $files as file (file.title)}
		<Sidebar.MenuItem>
			<Sidebar.MenuButton>
				{#snippet child({ props })}
					<a href={file.url} {...props}>
						<file.icon />
						<span>{file.title}</span>
                  	</a>
				{/snippet}
			</Sidebar.MenuButton>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuAction {...props}>
					<Ellipsis />
					</Sidebar.MenuAction>
				{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content side="right" align="start">
				<DropdownMenu.Item>
					<span>Rename</span>
				</DropdownMenu.Item>
				<DropdownMenu.Item>
					<span>Delete</span>
				</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Sidebar.MenuItem>
	{/each}
</Sidebar.Menu>