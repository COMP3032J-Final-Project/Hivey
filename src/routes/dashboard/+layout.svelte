<script lang="ts" module>
	import FlatGroup from '$lib/components/sidebar-flat-group.svelte';
	import { Files, File } from 'lucide-svelte';

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
			<NavMain groupName="Project" items={navData.navMain} />
			<FlatGroup groupName="Resources" items={navData.resources} />
		</Sidebar.Content>

		<Sidebar.Footer>
			<NavUser user={data.user} />
		</Sidebar.Footer>
		<Sidebar.Rail />
	</Sidebar.Root>

	<Sidebar.Inset>
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
