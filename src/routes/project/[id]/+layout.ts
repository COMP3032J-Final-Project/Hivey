import { Folder, File } from 'lucide-svelte';
import type { SidebarFolder, SidebarFile, ChatMessage } from '$lib/types/editor';
import { failure } from '$lib/components/ui/toast';
import { getUserSession } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { me } from '$lib/trans';
import type { User, UserAuth } from '$lib/types/auth';
import { getUserInfo } from '$lib/api/auth';
import {  getProjectMember } from '$lib/api/project';

// 侧边栏导航数据, 包括项目名称和文件夹数据
const data = {
	  groupName: 'Hivey Project',
	  folders: [
		    {
			      title: "Images",
			      url: "#",
			      icon: Folder,
			      items: [
			          {
				            title: "Gantt Chart.png",
				            url: "#",
			          },
			          {
				            title: "Apple.jpg",
				            url: "#",
			          },],
		    },
	  ] as SidebarFolder[],
	  files: [
		    {
		        title: "test.md",
		        url: "#",
		        icon: File
		    }
	  ] as SidebarFile[],
};

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
            currentUser = await getProjectMember(params.id, currentUser.username);
	  } catch (error) {
		    failure(me.session_expired());
		    redirect(302, '/auth/signin');
	  }

	  return {
		    groupName: data.groupName,
		    folders: data.folders,
		    files: data.files,
		    currentUser: currentUser,
            projectId: params.id,
            authInfo: session
	  };
};
