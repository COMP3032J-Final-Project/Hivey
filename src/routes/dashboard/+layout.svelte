<script lang="ts" module>
	import FlatGroup from '$lib/components/sidebar-flat-group.svelte';
	import { Files, File } from 'lucide-svelte';
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { writable } from 'svelte/store';

	// 导航和资源数据
	const navData = {
		resources: [
			{
				title: 'Template Universe',
				url: '#'
			},
			{
				title: 'Documentation',
				url: '#'
			}
		],
		navMain: [
			{
				title: 'Projects',
				url: '#',
				icon: Files,
				isActive: true,
				items: [
					{
						title: 'All Projects',
						url: '#'
					},
					{
						title: 'My Projects',
						url: '#'
					},
					{
						title: 'Shared with Me',
						url: '#'
					}
				]
			},
			{
				title: 'Templates',
				url: '#',
				icon: File,
				items: [
					{
						title: 'All',
						url: '#'
					},
					{
						title: 'Mine',
						url: '#'
					},
					{
						title: 'Shared with Me',
						url: '#'
					},
					{
						title: 'Favourite',
						url: '#'
					}
				]
			}
		]
	};

	// 创建导航状态store
	const currentNav = writable({
		group: '',
		item: ''
	});

	// 更新导航状态的函数
	function updateNav(group: string, item: string) {
		currentNav.set({ group, item });
	}
</script>

<script lang="ts">
	import NavMain from '$lib/components/sidebar-nav-main.svelte';
	import NavUser from './components/sidebar-nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { LayoutData } from './$types';
	import type { User } from '$lib/types/auth';

	let { data, children } = $props<{ data: LayoutData; children: any }>();
</script>

<Sidebar.Provider>
	<Sidebar.Root collapsible="icon" variant="inset">
		<Sidebar.Content>
			<NavMain groupName="Project" items={navData.navMain} on:navSelect={(e) => updateNav(e.detail.group, e.detail.item)} />
			<FlatGroup groupName="Resources" items={navData.resources} />
		</Sidebar.Content>

		<Sidebar.Footer>
			<NavUser user={data.user} />
		</Sidebar.Footer>
		<Sidebar.Rail />
	</Sidebar.Root>

	<Sidebar.Inset class="flex flex-col">
		<header
			class="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item class="hidden md:block">
							<Breadcrumb.Link href="#">{$currentNav.group || 'Project'}</Breadcrumb.Link>
						</Breadcrumb.Item>
						{#if $currentNav.item}
							<Breadcrumb.Separator class="hidden md:block" />
							<Breadcrumb.Item>
								<Breadcrumb.Page>{$currentNav.item}</Breadcrumb.Page>
							</Breadcrumb.Item>
						{/if}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		<div class="flex-1 overflow-auto">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
