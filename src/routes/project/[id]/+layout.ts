import { failure, failureError } from '$lib/components/ui/toast';
import { getUserSession, isSessionExpired } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { me } from '$lib/trans';
import type { User, UserAuth } from '$lib/types/auth';
import { getUserInfo } from '$lib/api/auth';
import { getProjectMemberInfo } from '$lib/api/project';
import { getProjectById } from '$lib/api/dashboard';
import { UserPermissionEnum } from '$lib/types/auth';
import type { File, TreeNode } from '$lib/types/editor';
import { setFilesStruct, setFiles, updateCurrentFile, setProject, addOnlineMember } from './store.svelte';

export const ssr = false; // 禁用服务器端渲染，确保只在客户端执行
export const prerender = false; // 禁用预渲染

export const load: LayoutLoad = async ({ url, params }) => {
    const session: UserAuth | null = getUserSession();
    // console.debug("Session:", session);
    // 如果未登录，立即重定向到登录页面
    if (!session || isSessionExpired()) {
        // 显示错误提示
        failure(me.user_not_login());
        const returnUrl = encodeURIComponent(url.pathname + url.search);
        redirect(302, `/auth/signin?returnUrl=${returnUrl}`);
    }

    let currentUser: User;
    try {
        currentUser = await getUserInfo();
    } catch (error) {
        failureError(error);
        const returnUrl = encodeURIComponent(url.pathname + url.search);
        redirect(302, `/auth/signin?returnUrl=${returnUrl}`)
    }
    
    let project;
    const project_id = params.id;
    try {
        project = await getProjectById(project_id);

        // 如果是模板项目，检查是否是创建者
        if (project.type === 'template') {
            currentUser = {
                ...currentUser,
                permission: UserPermissionEnum.NonMember
            };
        } else {
            currentUser = await getProjectMemberInfo(project_id, currentUser.username);
        }
    } catch (error) {
        failure(me.session_expired());
        redirect(302, '/auth/signin');
    }
    
    // console.debug("project:", project);
    setProject(project);
    addOnlineMember(currentUser);
    updateCurrentFile({project_id: project_id}); // 设置currentFile的project_id
    
    return {
        project_id: params.id,
        currentUser: currentUser,
        authInfo: session
    };
};
