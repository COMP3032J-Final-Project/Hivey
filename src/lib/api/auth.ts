import axios from 'axios';
import axiosClient from './axios';
import type { APIResponse } from '$lib/types/public';
import type {
	UserInfo,
	UserAuth,
	User,
	RegisterForm,
	LoginForm,
	RefreshUserAuthForm
} from '$lib/types/auth';
import * as m from '$lib/paraglide/messages';
import { browser } from '$app/environment';

const ip_address = '127.0.0.1'; // 开发环境下的 IP 地址, 部署时需要修改
const port = '8000';
const base_url = `http://${ip_address}:${port}`;
const is_mock = false; // 在没有启动后端服务时, 设置为true可以提供mock假数据

// 注册新用户
export const postUserRegister = async (form: RegisterForm): Promise<UserInfo> => {
	// Mock Response
	if (is_mock) {
		const mock_response: APIResponse<UserInfo> = {
			code: 200,
			msg: m.success_sign_up(),
			data: {
				email: form.email,
				username: form.username,
				password: form.password
			}
		};
		return mock_response.data as User;
	}

	try {
		const response = await axiosClient.post<APIResponse<UserInfo>>(`/user/register`, form);
		switch (response.data.code) {
			case 200:
				if (response.data.data) {
					return response.data.data;
				}
				throw new Error(m.error_unknown());
			case 409:
				throw new Error(m.error_user_exists());
			default:
				throw new Error(response.data.msg || m.error_unknown());
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.msg || m.error_network());
		}
		throw error;
	}
};

// 用户登录
export const postUserLogin = async (form: LoginForm): Promise<UserAuth> => {
	// Mock Response
	if (is_mock) {
		const mock_response: APIResponse<UserAuth> = {
			code: 200,
			msg: m.success_sign_in(),
			data: {
				access_token: '1234567890',
				refresh_token: '1234567890',
				token_type: 'Bearer',
				expires_in: 60000
			}
		};
		return mock_response.data as UserAuth;
	}

	try {
		// 将form中的email字段的键名改为username
		const formWithUsername = {
			password: form.password,
			username: form.email
		};
		
		// 创建 URLSearchParams 对象，用于 x-www-form-urlencoded 格式
		const formData = new URLSearchParams();
		formData.append('username', form.email);
		formData.append('password', form.password);
		
		console.log(formWithUsername);
		const response = await axiosClient.post<APIResponse<UserAuth>>(
			`/auth/login`,
			formData,
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}
		);

		switch (response.data.code) {
			case 200:
				if (response.data.data) {
					return response.data.data;
				}
				throw new Error(m.error_unknown());
			case 400:
				throw new Error(m.error_invalid_user());
			default:
				throw new Error(response.data.msg || m.error_unknown());
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.msg || m.error_network());
		}
		throw error;
	}
};

// 刷新用户token
export const postRefreshUserAuth = async (form: RefreshUserAuthForm): Promise<UserAuth> => {
	// Mock Response
	if (is_mock) {
		const mock_response: APIResponse<UserAuth> = {
			code: 200,
			msg: 'success refresh token',
			data: {
				access_token: '1234567890',
				refresh_token: '1234567890',
				token_type: 'Bearer',
				expires_in: 360000
			}
		};
		return mock_response.data as UserAuth;
	}

	try {
		// 注意：刷新 Token 时不使用拦截器，避免循环调用
		const response = await axios.post<APIResponse<UserAuth>>(`${base_url}/auth/refresh`, form);
		switch (response.data.code) {
			case 200:
				if (response.data.data) {
					return response.data.data;
				}
				throw new Error(m.error_unknown());
			default:
				throw new Error(response.data.msg || m.error_unknown());
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.msg || m.error_network());
		}
		throw error;
	}
};

// 在客户端和服务器端同时登出
export const postLogoutUserAuth = async (): Promise<void> => {
	// Mock Response
	if (is_mock) {
		removeUserAuth(); // 清除本地存储的 Token
		return;
	}

	try {
		// Body需要传入refresh_token, Header需要传入Authorization, 值为Bearer+空格+accees_token
		const userAuth = getUserAuth();
		if (!userAuth) {
			throw new Error(m.error_user_not_login());
		}

		const response = await axiosClient.post<APIResponse<void>>(`/auth/logout`, {
			refresh_token: userAuth.refresh_token
		});

		switch (response.data.code) {
			case 200:
				removeUserAuth(); // 清除本地存储的 Token
				return;
			default:
				throw new Error(response.data.msg || m.error_unknown());
		}
	} catch (error) {
		throw error;
	}
};

// 保存用户token到客户端
export function saveUserAuth(userAuth: UserAuth): void {
	if (!browser) return; // 确保只在浏览器环境中运行

	// 计算过期时间戳 (提前5分钟过期，以确保有足够时间刷新)
	const expiresAt = Date.now() + userAuth.expires_in * 1000 - 5 * 60 * 1000;
	localStorage.setItem('userAuth', JSON.stringify(userAuth));
	localStorage.setItem('expiresAt', expiresAt.toString());
}

// 检查客户端存储的用户token是否过期
export function isUserAuthExpired(): boolean {
	if (!browser) return true;

	const expiresAtStr = localStorage.getItem('expiresAt');
	if (!expiresAtStr) return true;

	const expiresAt = parseInt(expiresAtStr);
	return Date.now() > expiresAt;
}

// 清除客户端存储的用户token
export function removeUserAuth(): void {
	if (!browser) return;
	localStorage.removeItem('userAuth');
	localStorage.removeItem('expiresAt');
}

// 获取客户端存储的用户token
export function getUserAuth(): UserAuth | null {
	if (!browser) return null; // 确保只在浏览器环境中运行
	// 检查是否过期
	if (isUserAuthExpired()) {
		return null;
	}
	const userAuthString = localStorage.getItem('userAuth');
	const userAuth: UserAuth = userAuthString ? JSON.parse(userAuthString) : null;
	return userAuth;
}
