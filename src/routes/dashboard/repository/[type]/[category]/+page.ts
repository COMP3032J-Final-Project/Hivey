import type { PageLoad } from './$types';
import type { Project } from '$lib/types/dashboard';
import {
    getUserProjects,
    getOwnProjects,
    getSharedProjects,
    getPublicTemplates,
    getFavoriteTemplates
} from '$lib/api/dashboard';
import { setProjects } from '../../../store.svelte';

export const load: PageLoad = async ({ parent, params }) => {
    const { user } = await parent(); // 从父级layout中获取数据
    const { type, category } = params; // 从路由参数中获取type和category

    let navGroup = type.charAt(0).toUpperCase() + type.slice(1);
    let navItem = "";
    let projects: Project[] = [];

    // 根据type和category调用不同的API
    if (type === 'projects') {
        if (category === 'mine') {
            projects = await getOwnProjects();
            navItem = 'My Projects';
        } else if (category === 'shared') {
            projects = await getSharedProjects();
            navItem = 'Shared with Me';
        } else {
            projects = await getUserProjects();
            projects = projects.filter(project => project.type === "project");
            navItem = 'All Projects';
        }
    } else { // type === 'templates'
        if (category === 'mine') {
            projects = await getUserProjects();
            projects = projects.filter(project => 
                project.type === "template" && 
                project.owner?.email === user?.email
            );
            navItem = 'My Templates';
        } else if (category === 'favourite') {
            projects = await getFavoriteTemplates();
            navItem = 'Favourite Templates';
        } else {
            projects = await getPublicTemplates();
            navItem = 'All Templates';
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
