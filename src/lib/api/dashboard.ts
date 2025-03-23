import axios from 'axios';
import axiosClient from './axios';
import type { APIResponse } from '$lib/types/public';
import { me } from '$lib/trans';
import * as v from 'valibot';
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
import type { Project, CreateProjectForm } from '$lib/types/dashboard';


export const getUserProjects = async (): Promise<Project[]> => {
    const response = await axiosClient.get<APIResponse<Project[]>>('/project');
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
};

export const getProjectById = async (id: string): Promise<Project> => {
    const response = await axiosClient.get<APIResponse<Project>>(`/project/${id}`);
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
};

// TODO 需要和后端沟通
export const postCreateProject = async (form: CreateProjectForm): Promise<Project> => {
    const response = await axiosClient.post<APIResponse<Project>>('/project/create', form);
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
};

export const postUpdateProject = async (project: Project): Promise<Project> => {
    const response = await axiosClient.post<APIResponse<Project>>(`/project/${project.id}`, project);
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
};

export const postDeleteProject = async (id: string): Promise<void> => {
    const response = await axiosClient.post<APIResponse<void>>(`/project/${id}/delete`);
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
};
