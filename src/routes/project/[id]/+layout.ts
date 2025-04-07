import { Folder, File } from 'lucide-svelte';
import type { ChatMessage } from '$lib/types/editor';
import { failure } from '$lib/components/ui/toast';
import { getUserSession } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { me } from '$lib/trans';
import type { User, UserAuth } from '$lib/types/auth';
import { getUserInfo } from '$lib/api/auth';
import { getHistoryChatMessages, getProjectMember } from '$lib/api/project';
import { getFiles } from '$lib/api/editor';
import type { FileType } from '$lib/types/editor';
import { buildFileTree } from '$lib/utils';
import { file } from 'valibot';
import { getProjectById } from '$lib/api/dashboard';
import { UserPermissionEnum } from '$lib/types/auth';


export const ssr = false; // 禁用服务器端渲染，确保只在客户端执行
export const prerender = false; // 禁用预渲染

export const load: LayoutLoad = async ({ url, params }) => {
    const session: UserAuth | null = getUserSession();
    // 如果未登录，立即重定向到登录页面
    if (!session) {
        // 显示错误提示
        failure(me.user_not_login());

        // 将当前URL路径添加到重定向URL中，以便登录后可以返回
        const returnUrl = encodeURIComponent(url.pathname + url.search);
        redirect(302, `/auth/signin?returnUrl=${returnUrl}`);
    }

    let currentUser: User;
    try {
        currentUser = await getUserInfo();
        const project = await getProjectById(params.id);
        // 如果是模板项目，检查是否是创建者
        if (project.type === 'template') {
            currentUser = {
                ...currentUser,
                permission: UserPermissionEnum.Viewer
            };
        } else {
            currentUser = await getProjectMember(params.id, currentUser.username);
        }
    } catch (error) {
        failure(me.session_expired());
        redirect(302, '/auth/signin');
    }

    const filesdata = await getFiles(params.id);
    console.log("files:", filesdata);
    const filesStruct = buildFileTree(filesdata);
    console.log("filesStruct:", filesStruct);
    //const files: SidebarFile[] = _loadSidebarFiles(filesdata);
    //const folders: SidebarFolder[] = _loadSidebarFolder(filesdata);

    return {
        files: filesdata,
        filesStruct: filesStruct,
        currentUser: currentUser,
        projectId: params.id,
        authInfo: session
    };
};
