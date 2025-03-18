import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { getUserInfo, getUserAuth } from '$lib/api/auth';
import type { LayoutLoad } from './$types';
import type { DashboardLayoutData } from '$lib/types/dashboard';
import * as m from '$lib/paraglide/messages';
import { failure } from '$lib/components/ui/toast';
import type { User } from '$lib/types/auth';

export const ssr = false; // 禁用服务器端渲染，确保只在客户端执行
export const prerender = false; // 禁用预渲染

export const load: LayoutLoad = async ({ url }): Promise<DashboardLayoutData> => {
	// 检查用户是否已登录
	const userAuth = getUserAuth();
	
	// 如果未登录，立即重定向到登录页面
	if (!userAuth) {
		// 显示错误提示
		failure(m.error_user_not_login());
		
		// 将当前URL路径添加到重定向URL中，以便登录后可以返回
		const returnUrl = encodeURIComponent(url.pathname + url.search);
		redirect(302, `/auth/signin?returnUrl=${returnUrl}`);
	}

	try {
		// 获取用户详细信息
		const user: User = await getUserInfo();
		return { user };
	} catch (error) {
		// 如果获取用户信息失败，也应该重定向到登录页面
		failure(m.error_session_expired());
		redirect(302, '/auth/signin');
	}
};
