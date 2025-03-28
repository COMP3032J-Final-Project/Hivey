import { Folder, File } from 'lucide-svelte';
import type { SidebarFolder, SidebarFile, ChatMessage } from '$lib/types/editor';
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

export const _loadSidebarFiles = (files: FileType[]): SidebarFile[] => {
	const processedFiles = files.map(file => {
		const pathParts = file.filepath.split('/');
		const newPath = pathParts.slice(1).join('/'); // 忽略第一级目录
		return {
		  ...file,
		  filepath: newPath,
		};
	});
	return processedFiles
	.filter(file => !file.filepath)
	.map((file) => ({
	  title: file.filename,
	  url: "#",
	  icon: File,
	  id: file.id
	}));
  };

export const _loadSidebarFolder = (files: FileType[]): SidebarFolder[] => {
	const processedFiles = files.map(file => {
		const pathParts = file.filepath.split('/');
		const newPath = pathParts.slice(1).join('/'); // 忽略第一级目录
		return {
		  ...file,
		  filepath: newPath,
		};
	});
	const filesWithPath = processedFiles.filter(file => file.filepath);
	const groupedFiles: Record<string, FileType[]> = {};
		filesWithPath.forEach(file => {
		if (!groupedFiles[file.filepath]) {
		groupedFiles[file.filepath] = [];
		}
		groupedFiles[file.filepath].push(file);
	});
	return Object.entries(groupedFiles).map(([folderPath, folderFiles]) => ({
		title: folderPath.charAt(0).toUpperCase() + folderPath.slice(1), // 首字母大写
		url: "#",
		icon: Folder,
		items: folderFiles.map(file => ({
		  title: file.filename,
		  url: "#",
		  icon: File,
		  id: file.id
		}))
	  }));
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

	const filesdata= await getFiles(params.id);
	console.log("files:", filesdata);
	const files: SidebarFile[] = _loadSidebarFiles(filesdata);
	const folders: SidebarFolder[] = _loadSidebarFolder(filesdata);

	  return {
		    folders: folders,
		    files: files,
		    currentUser: currentUser,
            projectId: params.id,
            authInfo: session
	  };
};
