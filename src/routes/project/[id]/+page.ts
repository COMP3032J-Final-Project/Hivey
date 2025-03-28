import type { PageLoad } from './$types';
import { getProjectById } from '$lib/api/dashboard';
import { getProjectMembers } from '$lib/api/project';
import type { Project } from '$lib/types/dashboard';
import type { User } from '$lib/types/auth';
import { setMembers } from './store.svelte';

export const load: PageLoad = async ({ params, parent }) => {
    // 获取layout中的数据
    const layoutData = await parent();
    const { currentUser } = layoutData;

    const project: Project = await getProjectById(params.id);

    const membersData: User[] = await getProjectMembers(params.id);
    membersData.forEach(member => { // 检查每个members的头像, 如果头像为空, 则使用用户名简写作为头像
        if (!member.avatar) {
            const avatar = member.username.slice(0, 2).toUpperCase();
            member.avatar = `https://ui-avatars.com/api/?name=${avatar}`;
        }
    });
    setMembers(membersData); // 设置全局状态
    
    return {
        project,
        currentUser
    };
} 
