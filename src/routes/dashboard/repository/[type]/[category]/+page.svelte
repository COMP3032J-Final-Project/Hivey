<script lang="ts">
	import DataTable from './components/data-table.svelte';
	import { columns } from './components/columns';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { updateNav } from '../../../store.svelte';
	import type { Project } from '$lib/types/dashboard';

  let { data } = $props();

	onMount(() => {
    // 首字母大写
		updateNav(data.navGroup, data.navItem); // 更新导航栏上的面包屑
	});


  // TODO 理论上讲DataTable组件应该能够直接接收一个projects数组, 但现在由于Project的类型与columns的类型不匹配, 所以需要进行转换
	const formatProjects = (projects: Project[]) => {
		return projects.map(project => ({
			id: project.id,
			name: project.name,
			owner_id: project.owner?.email || 'Unknown',
			created_at: new Date(project.createdAt),
			updated_at: new Date(project.updatedAt)
		}));
	};

	const tableData = formatProjects(data.projects);
</script>

<main class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<DataTable data={tableData} {columns} />
</main>
