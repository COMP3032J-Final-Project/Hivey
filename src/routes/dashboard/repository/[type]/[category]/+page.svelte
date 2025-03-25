<script lang="ts">
	import DataTable from './components/data-table.svelte';
	import { columns } from './components/columns';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { updateNav, dialogOpen, dialogCategory } from '../../../store.svelte';
	import NewProjectDialog from './components/alert-dialog.svelte';
  import { postCreateProject } from '$lib/api/dashboard';
  import type { CreateProjectForm, Project } from '$lib/types/dashboard';

	let { data } = $props();
  let projects = $state<Project[]>(data.projects);

  async function handleCreateProject(form: CreateProjectForm): Promise<Project> {
      const project = await postCreateProject(form); //调用API创建项目
      // 如果当前页面为/dashboard/repository/project/all或/dashboard/repository/project/mine, 则更新projects数组
      if (data.type === 'project' && (data.category === 'all' || data.category === 'mine')) {
        projects.push(project);
      }
      return project;
  }

  onMount(() => {
		// 首字母大写
		updateNav(data.navGroup, data.navItem); // 更新导航栏上的面包屑
	});
</script>

<main class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<!-- 项目创建对话框 -->
	<NewProjectDialog
		bind:open={$dialogOpen}
		category={$dialogCategory}
		onSubmit={handleCreateProject}
	/>

	<DataTable data={projects} {columns} />
</main>
