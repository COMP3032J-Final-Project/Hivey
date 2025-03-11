import axios from 'axios';
import type {
	AxiosError,
	AxiosRequestConfig,
	AxiosResponse,
	InternalAxiosRequestConfig
} from 'axios';
import { goto } from '$app/navigation';
import {
	getUserAuth,
	isUserAuthExpired,
	postRefreshUserAuth,
	saveUserAuth,
	removeUserAuth
} from './auth';
import type { RefreshUserAuthForm } from '$lib/types/auth';
import * as m from '$lib/paraglide/messages';
import { browser } from '$app/environment';
import { notification } from '$lib/components/ui/toast';



// 获取 API 基础 URL
const ip_address = '127.0.0.1'; // 开发环境下的 IP 地址, 部署时需要修改
const port = '8000';
const base_url = `http://${ip_address}:${port}`;

// 扩展 AxiosRequestConfig 类型，添加 _retry 属性
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	_retry?: boolean;
}

// 创建 Axios 实例
const axiosClient = axios.create({
	baseURL: base_url,
	timeout: 10000
});

// 是否正在刷新 Token
let isRefreshing = false;
// 等待 Token 刷新的请求队列
let refreshQueue: Array<(token: string) => void> = []; // refreshQueue存储的是需要等待token刷新的请求

// 执行请求队列中的请求
const processQueue = (token: string) => {
	refreshQueue.forEach((callback) => callback(token));
	refreshQueue = [];
};

// 请求拦截器
axiosClient.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		// 如果不在浏览器环境中，直接返回配置
		if (!browser) {
			return config;
		}

		// 跳过对刷新 Token 请求的拦截，避免循环调用
		if (config.url?.includes('/auth/refresh')) {
			return config;
		}

		// 跳过对登录和注册请求的拦截
		if (config.url?.includes('/auth/login') || config.url?.includes('/user/register')) {
			return config;
		}

		// 获取用户 Token
		const userAuth = getUserAuth();

		// 如果没有 Token，直接返回配置
		if (!userAuth) {
			return config;
		}

		// 检查 Token 是否过期
		if (isUserAuthExpired()) {
			// 如果已经在刷新 Token，将请求加入队列
			if (isRefreshing) {
				return new Promise<InternalAxiosRequestConfig>((resolve) => {
					refreshQueue.push((token: string) => {
						config.headers.Authorization = `Bearer ${token}`;
						resolve(config);
					});
				});
			}

			// 开始刷新 Token
			isRefreshing = true;

			try {
				// 获取刷新 Token
				const refreshToken = userAuth.refresh_token;

				// 刷新 Token
				const refreshForm: RefreshUserAuthForm = {
					refresh_token: refreshToken
				};

				const newUserAuth = await postRefreshUserAuth(refreshForm);

				// 保存新的 Token
				saveUserAuth(newUserAuth);

				// 更新请求头
				config.headers.Authorization = `Bearer ${newUserAuth.access_token}`;

				// 处理队列中的请求
				isRefreshing = false;
				processQueue(newUserAuth.access_token);
			} catch (error) {
				// 刷新失败，清除 Token 并跳转到登录页
				isRefreshing = false;
				removeUserAuth();
				
				// 显示通知，告知用户会话已过期
				notification(m.error_session_expired());

				// 如果不是登录页，跳转到登录页
				if (browser && !window.location.pathname.includes('/auth/signin')) {
					goto('/auth/signin');
				}

				return Promise.reject(error);
			}
		} else {
			// Token 未过期，添加 Authorization 头
			config.headers.Authorization = `Bearer ${userAuth.access_token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// 响应拦截器
axiosClient.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	async (error: AxiosError) => {
		// 如果不在浏览器环境中，直接返回错误
		if (!browser) {
			return Promise.reject(error);
		}

		// 如果是 401 错误，尝试刷新 Token
		if (error.response?.status === 401) {
			const originalRequest = error.config as CustomAxiosRequestConfig;

			// 如果已经尝试过刷新 Token，直接返回错误
			if (originalRequest._retry) {
				return Promise.reject(error);
			}

			// 如果已经在刷新 Token，将请求加入队列
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					refreshQueue.push((token: string) => {
						if (originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${token}`;
						}
						originalRequest._retry = true;
						resolve(axiosClient(originalRequest));
					});
				});
			}

			// 开始刷新 Token
			isRefreshing = true;
			originalRequest._retry = true;

			try {
				// 获取用户 Token
				const userAuth = getUserAuth();

				// 如果没有 Token，直接返回错误
				if (!userAuth) {
					return Promise.reject(error);
				}

				// 获取刷新 Token
				const refreshToken = userAuth.refresh_token;

				// 刷新 Token
				const refreshForm: RefreshUserAuthForm = {
					refresh_token: refreshToken
				};

				const newUserAuth = await postRefreshUserAuth(refreshForm);

				// 保存新的 Token
				saveUserAuth(newUserAuth);

				// 更新请求头
				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${newUserAuth.access_token}`;
				}

				// 处理队列中的请求
				isRefreshing = false;
				processQueue(newUserAuth.access_token);

				// 重试原始请求
				return axiosClient(originalRequest);
			} catch (refreshError) {
				// 刷新失败，清除 Token 并跳转到登录页
				isRefreshing = false;
				removeUserAuth();
				
				// 显示通知，告知用户会话已过期
				notification(m.error_session_expired());

				// 如果不是登录页，跳转到登录页
				if (browser && !window.location.pathname.includes('/auth/signin')) {
					goto('/auth/signin');
				}

				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);

export default axiosClient;
