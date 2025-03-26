import axiosClient from './axios';
import type { APIResponse } from '$lib/types/public';
import type { Project, CreateProjectForm, ProjectsDeleteForm } from '$lib/types/dashboard';


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

export const putUpdateProject = async (project: { id: string; name: string }): Promise<Project> => {
    const response = await axiosClient.put<APIResponse<Project>>(`/project/${project.id}`, {
        name: project.name
    });
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
};

export const deleteProject = async (id: string): Promise<void> => {
    const response = await axiosClient.delete<APIResponse<void>>(`/project/${id}`);
    if (response.data.code !== 200) {
        throw new Error(response.data.msg);
    }
};

export const deleteProjects = async (projectIds: string[]): Promise<void> => {
    const response = await axiosClient.delete<APIResponse<void>>('/project', {
        data: { project_ids: projectIds }
    });
    if (response.data.code !== 200) {
        throw new Error(response.data.msg);
    }
};
