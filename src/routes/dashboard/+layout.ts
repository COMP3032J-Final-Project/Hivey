import { redirect } from '@sveltejs/kit';
import { getUserInfo, getMyAvatar } from '$lib/api/auth';
import { getUserSession } from '$lib/auth';
import type { LayoutLoad } from './$types';
import type { DashboardLayoutData } from '$lib/types/dashboard';
import { failure } from '$lib/components/ui/toast';
import type { User } from '$lib/types/auth';
import { me } from '$lib/trans';
import { setUser } from './store.svelte';

export const ssr = false; // 禁用服务器端渲染，确保只在客户端执行
export const prerender = false; // 禁用预渲染

export const load: LayoutLoad = async ({ url }): Promise<DashboardLayoutData> => {
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

	try {
		// 获取用户详细信息
		let user: User = await getUserInfo();
		if (!user.avatar) {
            const avatar = await getMyAvatar();
            user.avatar = avatar;
		}
        if (!user.avatar) {
            user.avatar = `https://ui-avatars.com/api/?name=${user.username.slice(0, 2)}`;
        }
		setUser(user); // 设置全局用户信息状态
		return { user };
	} catch (error) {
		// 如果获取用户信息失败，也应该重定向到登录页面
		failure(me.session_expired());
		redirect(302, '/auth/signin');
	}
};
