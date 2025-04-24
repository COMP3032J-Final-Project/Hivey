import axios from 'axios';
import axiosClient from './axios';
import type { APIResponse } from '$lib/types/public';
import { isSessionExpired } from '$lib/auth';

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
export const putUserInfo = async (username: string, email: string): Promise<User> => {
    const response = await axiosClient.put<APIResponse<User>>(`/user/me`, {
        username,
        email
    });
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

// 获取用户头像文件的下载URL
export const getMyAvatar = async (): Promise<string> => { 
    if (isSessionExpired()) {
        clearUserSession()
        return '';
    }
    try {
        const response = await axiosClient.get<APIResponse<string>>(`/user/avatar/`);
        if (response.data.code !== 200 || response.data.data == null) {
            return '';
        }
        return response.data.data;
    } catch (error) {
        return '';
    }
};


export const uploadUserAvatar = async (file: File, is_default: boolean = false): Promise<string> => {
    // 获取用户头像文件的上传URL    
    const response = await axiosClient.put<APIResponse<string>>(`/user/avatar/`, {
        is_default
    });
    if (response.data.code !== 200 || !response.data.data) {
        throw new Error(response.data.msg);
    }
    const uploadURL = response.data.data;
    await fetch(uploadURL, {method: 'PUT', body: file});
    const downloadURL = await getMyAvatar();
    if (!downloadURL || downloadURL === '') {
        throw new Error("Failed to upload avatar!");
    }
    console.log("downloadURL", downloadURL);
    return downloadURL;
};
