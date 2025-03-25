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
  import { postCreateProject, postDeleteProject } from '$lib/api/dashboard';
  import type { CreateProjectForm, Project } from '$lib/types/dashboard';
  import { success, failure } from '$lib/components/ui/toast';

	let { data } = $props();

  onMount(() => {
		updateNav(data.navGroup, data.navItem); // 更新导航栏上的面包屑
	});

  async function handleCreateProject(form: CreateProjectForm): Promise<Project> {
      const project = await postCreateProject(form); //调用API创建项目
      // 如果当前页面为/dashboard/repository/projects/all或/dashboard/repository/projects/mine, 则更新projects数组
      if (data.type === 'projects' && (data.category === 'all' || data.category === 'mine')) {
        addProject(project);
      }
      return project;
  }

  // 处理单个项目删除
  async function handleDeleteProject(event: CustomEvent<{ id: string }>) {
    const id = event.detail.id;
    try {
      await postDeleteProject(id);
      removeProject(id); // 从store中移除已删除的项目
      success('项目删除成功');
    } catch (error) {
      failure('项目删除失败');
    }
  }

  // 处理批量删除项目
  async function handleDeleteProjects(event: CustomEvent<{ ids: string[] }>) {
    const ids = event.detail.ids;
    try {
      await Promise.all(ids.map(id => postDeleteProject(id))); // 并行处理所有删除请求
      removeProjects(ids); // 从store中移除所有已删除的项目
      success(`成功删除 ${ids.length} 个项目`);
    } catch (error) {
      failure('批量删除项目失败');
    }
  }
</script>

<main class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<!-- 项目创建对话框 -->
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
