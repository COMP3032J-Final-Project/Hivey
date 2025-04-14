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

export const registerUser = async (formData: RegisterForm): Promise<User> => {
    const form = v.parse(RegisterForm, formData);
    const response = await axiosClient.post<APIResponse<User>>(`/user/register`, form);
    const data = response.data.data;
    return v.parse(User, data);
};

export const login = async (formData: LoginForm): Promise<UserAuth> => {
    const form: LoginForm = v.parse(LoginForm, formData);
    // x-www-form-urlencoded format
    const reqFormData = new URLSearchParams();
    reqFormData.append('username', form.email);
    reqFormData.append('password', form.password);

    const response = await axiosClient.post<APIResponse<UserAuth>>(`/auth/login`, reqFormData);
    const data = response.data.data;
    return v.parse(UserAuth, data);
};

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


export const refreshUserAuth = async (form: RefreshUserAuthForm): Promise<UserAuth> => {
    const response = await axiosClient.post<APIResponse<UserAuth>>(`/auth/refresh`, form);
    return v.parse(UserAuth, response.data.data);
};

export const logoutUser = async (): Promise<void> => {
    const userAuth = getUserSession();
    if (!userAuth) throw new Error(me.user_not_login());
    await axiosClient.post<APIResponse<void>>(`/auth/logout`, {
        refresh_token: userAuth.refresh_token
    });
    clearUserSession();
};
