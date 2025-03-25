import { Folder } from 'lucide-svelte';
import type { SidebarFolder, ChatMessage } from '$lib/types/editor';
import { failure } from '$lib/components/ui/toast';
import { getUserSession } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { me } from '$lib/trans';

// 创建模拟聊天数据
const mockMessages: ChatMessage[] = [
	{
		user: {
			username: 'Liyan Tao',
			email: 'liyantao@ucdconnect.ie',
			avatar: ''
		},
		message: 'Hello, everyone. We will discuss the project progress today.',
		timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
	},
	{
		user: {
			username: 'Hanshu Rao',
			email: 'hanshu.rao@ucdconnect.ie',
			avatar: ''
		},
		message: 'I am processing the back-end API, and it is expected to be completed tomorrow.',
		timestamp: new Date(Date.now() - 1000 * 60 * 25) // 25 minutes ago
	},
	{
		user: {
			username: 'Ziqi Yang',
			email: 'ziqi.yang@ucdconnect.ie',
			avatar: ''
		},
		message: 'I have completed the multi-cursor part.',
		timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
	},
	{
		user: {
			username: 'Yiran Zhao',
			email: 'yiran.zhao@ucdconnect.ie',
			avatar: ''
		},
		message:
			'I am processing the front-end part, finished the login and register part.',
		timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
	},
	{
		user: {
			username: 'Jiawen Chen',
			email: 'jiawen.chen@ucdconnect.ie',
			avatar: ''
		},
		message:
			'Ok, I will start the design of the CRDT part.',
		timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
	},
	{
		user: {
			username: 'Jinpeng Zhai',
			email: 'jinpeng.zhai@ucdconnect.ie',
			avatar: ''
		},
		message:
			'That\'s great! I will start the design of the cloud storage part.',
		timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
	}
];

// 侧边栏导航数据, 包括项目名称和文件夹数据
const data = {
	groupName: 'Hivey Project',
	folders: [
		{
			title: 'Projects',
			url: '#',
			icon: Folder,
			isActive: true,
			items: [
				{
					title: 'All',
					url: '#'
				},
				{
					title: 'Mine',
					url: '#'
				},
				{
					title: 'Shared with Me',
					url: '#'
				}
			]
		},
		{
			title: 'Templates',
			url: '#',
			icon: Folder,
			items: [
				{
					title: 'All',
					url: '#'
				},
				{
					title: 'Mine',
					url: '#'
				},
				{
					title: 'Shared with Me',
					url: '#'
				},
				{
					title: 'Favourite',
					url: '#'
				}
			]
		}
	] as SidebarFolder[]
};

export const ssr = false; // 禁用服务器端渲染，确保只在客户端执行
export const prerender = false; // 禁用预渲染

export const load: LayoutLoad = async ({ url }) => {
	// 检查用户是否已登录
	const userAuth = getUserSession();

	// 如果未登录，立即重定向到登录页面
	if (!userAuth) {
		// 显示错误提示
		failure(me.user_not_login());

		// 将当前URL路径添加到重定向URL中，以便登录后可以返回
		const returnUrl = encodeURIComponent(url.pathname + url.search);
		redirect(302, `/auth/signin?returnUrl=${returnUrl}`);
	}

	return {
		groupName: data.groupName,
		folders: data.folders,
		chatMessages: mockMessages,
		currentUser: {
			username: 'Zhang San',
			email: 'zhangsan@example.com',
			avatar: ''
		}
	};
};
