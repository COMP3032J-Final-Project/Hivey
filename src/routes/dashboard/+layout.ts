import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { getUserInfo, getUserAuth } from '$lib/api/auth';
import type { LayoutLoad } from './$types';
import type { DashboardLayoutData } from '$lib/types/dashboard';
import * as m from '$lib/paraglide/messages';
import { failure } from '$lib/components/ui/toast';
import type { User } from '$lib/types/auth';

export const load: LayoutLoad = async (): Promise<DashboardLayoutData> => {
	// 在服务器端渲染时返回null
	if (!browser) {
		return { user: null };
	}

	// 检查用户是否已登录
	const userAuth = getUserAuth();
	if (!userAuth) {
		// 如果未登录，重定向到登录页面
		failure(m.error_user_not_login());
		redirect(302, '/auth/signin');
	}

	try {
		// 获取用户信息
		const user: User = await getUserInfo();

		// TODO 获取用户的项目信息
		// const projects: Project[] = await getUserProjects();
		return { user };
	} catch (error) {
		return { user: null };
	}
};
