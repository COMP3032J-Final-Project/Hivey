import axios from 'axios';
import type {
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig
} from 'axios';
import { goto } from '$app/navigation';
import { refreshUserAuth } from './auth';
import {
    getUserSession,
    isSessionExpired,
    saveUserSession,
    clearUserSession
} from '$lib/auth';
import { localizeHref } from '$lib/paraglide/runtime';
import type { RefreshUserAuthForm } from '$lib/types/auth';
import { me } from '$lib/trans';
import { browser } from '$app/environment';
import { notification } from '$lib/components/ui/toast';
import { BACKEND_ADDR } from '$lib/constants';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

// 创建 Axios 实例
const axiosClient = axios.create({
    baseURL: BACKEND_ADDR,
    timeout: 10000
});

let isRefreshing = false;
// Basically we wait the current refreshing request done, get the new access token and apply access token to each request in this queue
let refreshQueue: Array<(token: string) => void> = [];

// 执行请求队列中的请求
const processQueue = (token: string) => {
    refreshQueue.forEach((callback) => callback(token));
    refreshQueue = [];
};

const exludePaths = ['/auth/refresh', '/auth/login', '/user/register'];

// 请求拦截器
axiosClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // localized path has prefix so we use `includes`
        if (!browser || (config.url && exludePaths.some(path => config.url?.includes(path)))) {
            return config;
        }

        const userAuth = getUserSession();

        if (!userAuth) {
            return config;
        }

        if (!isSessionExpired()) {
            config.headers.Authorization = `Bearer ${userAuth.access_token}`;
            return config;
        }


        if (isRefreshing) {
            return new Promise<InternalAxiosRequestConfig>((resolve) => {
                refreshQueue.push((token: string) => {
                    config.headers.Authorization = `Bearer ${token}`;
                    resolve(config);
                });
            });
        }

        isRefreshing = true;

        try {
            const refreshToken = userAuth.refresh_token;

            const refreshForm: RefreshUserAuthForm = {
                refresh_token: refreshToken
            };

            const newUserAuth = await refreshUserAuth(refreshForm);

            saveUserSession(newUserAuth);

            config.headers.Authorization = `Bearer ${newUserAuth.access_token}`;

            isRefreshing = false;
            processQueue(newUserAuth.access_token);
        } catch (error) {
            isRefreshing = false;
            clearUserSession();

            // 只在非登录页显示会话过期通知
            if (browser && !window.location.pathname.includes('/auth/signin')) {
                notification(me.session_expired());
                // 跳转到登录页
                goto(localizeHref('/auth/signin'));
            }

            return Promise.reject(error);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    async (error: AxiosError) => {
        if (!browser || error.response == null || error.response.status !== 401) {
            return Promise.reject(error);
        }

        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (originalRequest._retry) {
            return Promise.reject(error);
        }

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

        isRefreshing = true;
        originalRequest._retry = true;

        try {
            const userAuth = getUserSession();

            if (!userAuth) {
                return Promise.reject(error);
            }

            const refreshToken = userAuth.refresh_token;

            const refreshForm: RefreshUserAuthForm = {
                refresh_token: refreshToken
            };

            const newUserAuth = await refreshUserAuth(refreshForm);

            saveUserSession(newUserAuth);

            if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newUserAuth.access_token}`;
            }

            isRefreshing = false;
            processQueue(newUserAuth.access_token);

            // 重试原始请求
            return axiosClient(originalRequest);
        } catch (refreshError) {
            isRefreshing = false;
            clearUserSession();

            // 只在非登录页显示会话过期通知
            if (browser && !window.location.pathname.includes('/auth/signin')) {
                notification(me.session_expired());
                // 跳转到登录页
                goto(localizeHref('/auth/signin'));
            }

            return Promise.reject(refreshError);
        }
    }
);

export default axiosClient;
