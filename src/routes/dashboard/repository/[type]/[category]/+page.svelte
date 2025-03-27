<script lang="ts">
	import DataTable from './components/data-table.svelte';
	import { columns } from './components/columns';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { 
    updateNav, 
    dialogOpen, 
    dialogCategory, 
    projects, 
    setProjects, 
    addProject, 
    removeProject, 
    removeProjects 
  } from '../../../store.svelte';
	import NewProjectDialog from './components/alert-dialog.svelte';
  import { createProject } from '$lib/api/dashboard';
  import type { CreateProjectForm, Project } from '$lib/types/dashboard';
  import { success, failure } from '$lib/components/ui/toast';

	let { data } = $props();

  onMount(() => {
		updateNav(data.navGroup, data.navItem); // 更新导航栏上的面包屑
	});

  async function handleCreateProject(form: CreateProjectForm): Promise<Project> {
      const project = await createProject(form); //调用API创建项目
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

	<DataTable 
    data={$projects} 
    {columns} 
  />
</main>
