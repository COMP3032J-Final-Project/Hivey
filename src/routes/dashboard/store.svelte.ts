import { writable } from 'svelte/store';
import type { NewProjectCategory } from './repository/[type]/[category]/components/alert-dialog.svelte';

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
