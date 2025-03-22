import axios from 'axios';
import axiosClient from './axios';
import type { APIResponse } from '$lib/types/public';

import {
	  UserAuth,
	  User,
    RegisterForm,
    LoginForm,
	  RefreshUserAuthForm
} from '$lib/types/auth';

import {
    getUserSession,
    clearUserSession
} from '$lib/auth';

import { me } from '$lib/trans';

import * as v from 'valibot';

// 注册新用户
export const postUserRegister = async (formData: RegisterForm): Promise<User> => {
    const form = v.parse(RegisterForm, formData);
    const response = await axiosClient.post<APIResponse<User>>(`/user/register`, form);
    const data = response.data.data;
    return v.parse(User, data);
};

// 用户登录
export const postUserLogin = async (formData: LoginForm): Promise<UserAuth> => {
    const form: LoginForm = v.parse(LoginForm, formData);
		// 创建 URLSearchParams 对象，用于 x-www-form-urlencoded 格式
		const reqFormData = new URLSearchParams();
		reqFormData.append('username', form.email);
		reqFormData.append('password', form.password);
		
		const response = await axiosClient.post<APIResponse<UserAuth>>(`/auth/login`, reqFormData);
    const data = response.data.data;
    return v.parse(UserAuth, data);
};

// 获取用户信息
export const getUserInfo = async (): Promise<User> => {
		const response = await axiosClient.get<APIResponse<User>>(`/user/me`);
    const data = response.data.data;
    return v.parse(User, data);
};

// 更新用户信息
// TODO only username and email is allowed to be updated according to backend
export const putUserInfo = async (form: any): Promise<User> => {
		const response = await axiosClient.put<APIResponse<User>>(`/user/me`, form);
    const data = response.data.data;
    return v.parse(User, data);
};


// 刷新用户token
export const postRefreshUserAuth = async (form: RefreshUserAuthForm): Promise<UserAuth> => {
	try {
		// 注意：刷新 Token 时不使用拦截器，避免循环调用
		const response = await axiosClient.post<APIResponse<UserAuth>>(`/auth/refresh`, form);
		switch (response.data.code) {
			case 200:
				if (response.data.data) {
					return response.data.data;
				}
				throw new Error(me.unknown());
			default:
				throw new Error(response.data.msg || me.unknown());
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.msg || me.network());
		}
		throw error;
	}
};

// 在客户端和服务器端同时登出
export const postLogoutUserAuth = async (): Promise<void> => {
	try {
		// Body需要传入refresh_token, Header需要传入Authorization, 值为Bearer+空格+accees_token
		const userAuth = getUserSession();
		if (!userAuth) {
			throw new Error(me.user_not_login());
		}

		const response = await axiosClient.post<APIResponse<void>>(`/auth/logout`, {
			refresh_token: userAuth.refresh_token
		});

		switch (response.data.code) {
			case 200:
				clearUserSession();
				return;
			default:
				throw new Error(response.data.msg || me.unknown());
		}
	} catch (error) {
		throw error;
	}
};
