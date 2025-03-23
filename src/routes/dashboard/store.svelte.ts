import { writable } from 'svelte/store';

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
