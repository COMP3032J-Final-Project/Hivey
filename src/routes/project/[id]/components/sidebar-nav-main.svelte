<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { ChevronRight } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import type { SidebarFolder } from '$lib/types/editor';

	let { items }: { items: SidebarFolder[] } = $props();

	const folders = writable(items);
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
			</Sidebar.MenuItem>
		</Collapsible.Root>
	{/each}
</Sidebar.Menu>
