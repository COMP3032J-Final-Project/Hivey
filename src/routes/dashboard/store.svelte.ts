import { writable } from 'svelte/store';
import type { NewProjectCategory } from './repository/[type]/[category]/components/alert-dialog.svelte';
import type { Project } from '$lib/types/dashboard';

// 导航状态
interface NavState {
    group: string;
    item: string;
}
const currentNav = writable<NavState>({
    group: '',
    item: ''
});
export function updateNav(group: string, item: string) { // 更新导航状态
    currentNav.set({ group, item });
}
export { currentNav }; 


// 项目对话框状态
const dialogOpen = writable<boolean>(false);
const dialogCategory = writable<NewProjectCategory>('blank');
export function openProjectDialog(category: NewProjectCategory) { // 打开项目对话框
    dialogCategory.set(category);
    dialogOpen.set(true);
}
export function closeProjectDialog() { // 关闭项目对话框
    dialogOpen.set(false);
}
export { dialogOpen, dialogCategory }; 


// 项目列表状态
const projects = writable<Project[]>([]);
export function setProjects(projectList: Project[]) { // 设置项目列表
    projects.set(projectList);
}
export function addProject(project: Project) { // 添加项目
    projects.update(list => [...list, project]);
}
export function removeProject(id: string) { // 移除单个项目
    projects.update(list => list.filter(project => project.id !== id));
}
export function removeProjects(ids: string[]) { // 批量移除项目
    projects.update(list => list.filter(project => !ids.includes(project.id)));
}
export { projects }; 
