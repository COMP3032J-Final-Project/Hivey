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
	import UserProvider from './components/user-provider.svelte';
	import type { User } from '$lib/types/auth';

	let { data } = $props();
	let currentType = $state(data.type);
	let currentUser: User | null = null;
	let columns = $state(getColumns(currentType, currentUser));

	afterNavigate(() => {
		currentType = data.type;
		columns = getColumns(currentType, currentUser);
	});

	$effect(() => {
		currentType = data.type;
		columns = getColumns(currentType, currentUser);
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

	<UserProvider let:currentUser let:loading>
		{#if !loading}
			<DataTable data={$projects} columns={getColumns(currentType, currentUser)} type={currentType} />
		{:else}
			<div class="flex items-center justify-center h-32">
				<p>Loading...</p>
			</div>
		{/if}
	</UserProvider>
</main>
