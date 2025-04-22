import { failure, failureError } from '$lib/components/ui/toast';
import { getUserSession, isSessionExpired } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { me } from '$lib/trans';
import type { User, UserAuth } from '$lib/types/auth';
import { getUserInfo } from '$lib/api/auth';
import { getProjectMemberInfo } from '$lib/api/project';
import { getFiles } from '$lib/api/editor';
import { buildFileTree } from '$lib/utils';
import { getProjectById } from '$lib/api/dashboard';
import { UserPermissionEnum } from '$lib/types/auth';
import type { Project } from '$lib/types/dashboard';
import type { File, TreeNode } from '$lib/types/editor';
import { setFilesStruct, setFiles, updateCurrentFile, setProject, addOnlineMember } from './store.svelte';

export const ssr = false; // 禁用服务器端渲染，确保只在客户端执行
export const prerender = false; // 禁用预渲染

export const load: LayoutLoad = async ({ url, params }) => {
    const session: UserAuth | null = getUserSession();
    console.log("Session:", session);
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
    
    try {
        const project = await getProjectById(params.id);
        // 如果是模板项目，检查是否是创建者
        if (project.type === 'template') {
            currentUser = {
                ...currentUser,
                permission: UserPermissionEnum.NonMember
            };
        } else {
            currentUser = await getProjectMemberInfo(params.id, currentUser.username);
        }
    } catch (error) {
        failure(me.session_expired());
        redirect(302, '/auth/signin');
    }
    const project: Project = await getProjectById(params.id);
    const filesdata: File[] = await getFiles(params.id);
    const filesStruct: TreeNode[] = buildFileTree(filesdata, []);
    console.log("project:", project);
    console.log("files:", filesdata);
    console.log("filesStruct:", filesStruct);
    
    setProject(project);
    setFiles(filesdata);
    setFilesStruct(filesStruct);
    updateCurrentFile({project_id: params.id}); // 设置currentFile的project_id
    addOnlineMember(currentUser);
    return {
        files: filesdata,
        filesStruct: filesStruct,
        currentUser: currentUser,
        authInfo: session
    };
};
