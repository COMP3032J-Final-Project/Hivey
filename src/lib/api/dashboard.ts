import axiosClient from './axios';
import type { APIResponse } from '$lib/types/public';
import type { Project, CreateProjectForm } from '$lib/types/dashboard';
import { ProjectType } from '$lib/types/dashboard';


export const getUserProjects = async (): Promise<Project[]> => {
    const response = await axiosClient.get<APIResponse<Project[]>>('/project/');
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
};

export const getOwnProjects = async (): Promise<Project[]> => {
    const response = await axiosClient.get<APIResponse<Project[]>>('/project/own/');
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
};

export const getSharedProjects = async (): Promise<Project[]> => {
    const response = await axiosClient.get<APIResponse<Project[]>>('/project/shared/');
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
};

export const getPublicTemplates = async (): Promise<Project[]> => {
    const response = await axiosClient.get<APIResponse<Project[]>>('/project/templates/');
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
};

export const getFavoriteTemplates = async (): Promise<Project[]> => {
    const response = await axiosClient.get<APIResponse<Project[]>>('/project/favorite_templates/');
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
};

export const getTemplatesWithFavoriteStatus = async (): Promise<Project[]> => {
    const allTemplates = await getPublicTemplates();
    const favoriteTemplates = await getFavoriteTemplates();
    const favoriteIds = new Set(favoriteTemplates.map(template => template.id));
    
    return allTemplates.map(template => ({
        ...template,
        isFavorite: favoriteIds.has(template.id)
    }));
};

export const getProjectById = async (id: string): Promise<Project> => {
    const response = await axiosClient.get<APIResponse<Project>>(`/project/${id}`);
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
};

export const createProject = async (form: CreateProjectForm): Promise<Project> => {
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

export const updateProject = async (project: { id: string; name: string }): Promise<Project> => {
    const response = await axiosClient.put<APIResponse<Project>>(`/project/${project.id}`, {
        name: project.name
    });
    
    // 根据后端API，当成功更新时返回code=200，但可能不包含data
    if (response.data.code === 200) {
        // 如果有返回data则使用后端返回的数据
        if (response.data.data) {
            return response.data.data;
        }
        // 否则构建一个项目对象返回
        return {
            id: project.id,
            name: project.name,
            createdAt: new Date(),
            updatedAt: new Date(),
            type: ProjectType.Project
        };
    }
    throw new Error(response.data.msg || 'Failed to update project');
};

export const deleteProject = async (id: string): Promise<void> => {
    const response = await axiosClient.delete<APIResponse<void>>(`/project/${id}`);
    if (response.data.code !== 200) {
        throw new Error(response.data.msg || 'Failed to delete project');
    }
    return;
};

export const deleteProjects = async (projectIds: string[]): Promise<void> => {
    const response = await axiosClient.delete<APIResponse<void>>('/project/', {
        data: { project_ids: projectIds }
    });
    if (response.data.code !== 200) {
        throw new Error(response.data.msg || 'Failed to delete projects');
    }
    return;
};

export const createProjectFromTemplate = async (templateId: string, projectName: string): Promise<Project> => {
    const response = await axiosClient.post<APIResponse<{ project_id: string }>>(`/project/${templateId}/create_project`, {
        name: projectName,
        type: 'project'
    });
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    const projectId = response.data.data.project_id;
    const project = await getProjectById(projectId);
    return project;
};

export const copyProject = async (projectId: string): Promise<Project> => {
    const response = await axiosClient.post<APIResponse<{ project_id: string }>>(`/project/${projectId}/copy_project`, {});
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    const newProjectId = response.data.data.project_id;
    const project = await getProjectById(newProjectId);
    return project;
};

export const favoriteTemplate = async (templateId: string): Promise<boolean> => {
    const response = await axiosClient.put<APIResponse<boolean>>(`/project/${templateId}/members/favorite_template/`, {});
    if (response.data.code !== 200) {
        throw new Error(response.data.msg || 'Failed to favorite template');
    }
    return response.data.data || false;
};
