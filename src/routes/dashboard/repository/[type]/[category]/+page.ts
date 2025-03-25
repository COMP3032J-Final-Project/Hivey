import type { PageLoad } from './$types';
import type { User } from '$lib/types/auth';
import type { Project } from '$lib/types/dashboard';
import {
    getUserProjects,
} from '$lib/api/dashboard';
import { browser } from '$app/environment';
import { setProjects } from '../../../store.svelte';

export const load: PageLoad = async ({ parent, params }) => {
    const { user } = await parent(); // 从父级layout中获取数据
    const { type, category } = params; // 从路由参数中获取type和category

    let navGroup = type.charAt(0).toUpperCase() + type.slice(1);
    let navItem = "";
    let projects: Project[] = await getUserProjects();

    // 根据type和category过滤projects
    if (type === 'projects') {
        projects = projects.filter(project => project.type === "project");
        navItem = 'All Projects';
        if (category === 'mine') {
            projects = projects.filter(project => project.owner?.email === user?.email);
            navItem = 'My Projects';
        } else if (category === 'shared') {
            projects = projects.filter(project => project.owner?.email !== user?.email);
            navItem = 'Shared with Me';
        }
    } else { // type === 'templates'
        projects = projects.filter(project => project.type === "template");
        navItem = 'All Templates';
        if (category === 'mine') {
            projects = projects.filter(project => project.owner?.email === user?.email);
            navItem = 'My Templates';
        } else if (category === 'favourite') {
            projects = projects.filter(project => project.owner?.email !== user?.email);
            navItem = 'Favourite Templates';
        }
    }

    setProjects(projects);
    
    return {
        userInfo: user,
        projects,
        type,
        category,
        navGroup,
        navItem
    };
} 
