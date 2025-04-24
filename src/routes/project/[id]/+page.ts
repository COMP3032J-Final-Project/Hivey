import type { PageLoad } from './$types';
import { getProjectById } from '$lib/api/dashboard';
import { getProjectMembers, getProjectMemberInfo } from '$lib/api/project';
import type { Project } from '$lib/types/dashboard';
import { type User, UserPermissionEnum } from '$lib/types/auth';
import { setMembers } from './store.svelte';

export const load: PageLoad = async ({ params, parent }) => {
    // 获取layout中的数据
    const layoutData = await parent();
    const { currentUser } = layoutData;

    const membersData: User[] = await getProjectMembers(params.id);
    membersData.forEach(member => { 
        if (!member.avatar_url || member.avatar_url === '') {
            const avatar = member.username.slice(0, 2).toUpperCase();
            member.avatar_url = `https://ui-avatars.com/api/?name=${avatar}`;
        }
    });
    setMembers(membersData);

    return {
        currentUser: currentUser,
    };
} 
