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

export const postCreateProject = async (form: CreateProjectForm): Promise<Project> => {
    console.log(form);
    // API[/project/create] 返回的data是{ project_id: string }, 因此还需要调用getProjectById()获取项目信息
    const tempForm = { //TODO 由于后端的适配还没有做好, 因此需要临时删除掉file和category字段
        name: form.name,
        type: 'project'
    }
    const response = await axiosClient.post<APIResponse<{ project_id: string }>>('/project/create', tempForm);
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    const projectId = response.data.data.project_id;
    const project = await getProjectById(projectId);
    return project;
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
    if (response.data.code !== 200) {
        throw new Error(response.data.msg);
    }
};
