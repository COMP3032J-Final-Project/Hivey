<script lang="ts">
	import DataTable from './components/data-table.svelte';
	import { getColumns } from './components/columns';
	import { onMount } from 'svelte';
	import {
		updateNav,
		dialogOpen,
		dialogCategory,
		projects,
		addProject,
	} from '../../../store.svelte';
	import NewProjectDialog from './components/alert-dialog.svelte';
	import { createProject } from '$lib/api/dashboard';
	import type { CreateProjectForm, Project } from '$lib/types/dashboard';
	import { afterNavigate } from '$app/navigation';

	let { data } = $props();
	let currentType = $state(data.type);
	let columns = $state(getColumns(currentType));

	afterNavigate(() => {
		currentType = data.type;
		columns = getColumns(currentType);
	});

	$effect(() => {
		currentType = data.type;
		columns = getColumns(currentType);
	});

	onMount(() => {
		updateNav(data.navGroup, data.navItem);
	});

	async function handleCreateProject(form: CreateProjectForm): Promise<Project> {
		const project = await createProject(form);
		// 如果当前页面为/dashboard/repository/projects/all或/dashboard/repository/projects/mine, 则更新projects数组
		if (data.type === 'projects' && (data.category === 'all' || data.category === 'mine')) {
			addProject(project);
		}
		return project;
	}
</script>

<main class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<NewProjectDialog
		bind:open={$dialogOpen}
		category={$dialogCategory}
		onSubmit={handleCreateProject}
	/>

	<DataTable data={$projects} {columns} type={currentType} />
</main>
