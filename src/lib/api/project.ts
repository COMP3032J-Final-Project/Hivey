import axiosClient from './axios';
import type { APIResponse } from '$lib/types/public';
import type { ChatMessage, GetHistoryChatMessagesForm, UpdateProjectMemberPermissionForm, RemoveProjectMemberForm } from '$lib/types/editor';
import { type User, UserPermissionEnum } from '$lib/types/auth';
import { mpp } from '$lib/trans';

// 获取项目聊天室的聊天记录
export const getHistoryChatMessages = async (form: GetHistoryChatMessagesForm): Promise<ChatMessage[]> => {
    const response = await axiosClient.get<APIResponse<ChatMessage[]>>(`/project/${form.projectId}/chat/history`, {
        params: {
            max_num: form.max_num,
            last_timestamp: form.last_timestamp
        }
    });
    if (response.data.code !== 200) {
        throw new Error(response.data.msg);
    }
    return response.data.data || [];
}

// 获取项目下的某个成员的所有信息(包括其权限)
export const getProjectMember = async (projectId: string, memberName: string): Promise<User> => {
    const response = await axiosClient.get<APIResponse<User>>(`/project/${projectId}/members/${memberName}`);
    if (response.data.code !== 200 || !response.data.data) {
        throw new Error(response.data.msg);
    }   
    return response.data.data;
}


// 获取项目下的某个成员的权限信息
export const getProjectMemberPermission = async (projectId: string, memberName: string): Promise<UserPermissionEnum> => {
    const response = await axiosClient.get<APIResponse<User>>(`/project/${projectId}/members/${memberName}`);
    if (response.data.code !== 200 || !response.data.data) {
        throw new Error(response.data.msg);
    }
    const user: User = response.data.data;
    return user.permission || UserPermissionEnum.Viewer;
}

// 获取项目的所有成员和成员的权限
export const getProjectMembers = async (projectId: string): Promise<User[]> => {
    const response = await axiosClient.get<APIResponse<User[]>>(`/project/${projectId}/members`);
    if (response.data.code !== 200) {
        throw new Error(response.data.msg);
    }
    return response.data.data || [];
}

// 添加项目成员
export const postAddProjectMember = async (projectId: string, username: string): Promise<void> => {
    const response = await axiosClient.post<APIResponse<void>>(`/project/${projectId}/members/${username}`);
    if (response.data.code !== 200) {
        throw new Error(response.data.msg);
    }
}

// 更新项目成员权限
export const putUpdateProjectMemberPermission = async (form: UpdateProjectMemberPermissionForm): Promise<void> => {
    const { currentUser, memberName, projectId, newPermission } = form;
    // 验证当前用户是否有权限更新成员权限
    const currentUserPermission = await getProjectMemberPermission(form.projectId, form.currentUser.username);
    if (currentUserPermission !== UserPermissionEnum.Admin && currentUserPermission !== UserPermissionEnum.Owner) {
        throw new Error(mpp.error_edit_member_permission());
    }

    const response = await axiosClient.put<APIResponse<void>>(`/project/${form.projectId}/members/${form.memberName}`, { permission: form.newPermission });
    if (response.data.code !== 200) {
        throw new Error(response.data.msg);
    }
}

// 移除项目成员
export const postRemoveProjectMember = async (form: RemoveProjectMemberForm): Promise<void> => {
    const { currentUser, memberName, projectId } = form;
    // 验证当前用户是否有权限移除成员
    const currentUserPermission = await getProjectMemberPermission(form.projectId, form.currentUser.username);
    if (currentUserPermission !== UserPermissionEnum.Admin && currentUserPermission !== UserPermissionEnum.Owner) {
        throw new Error(mpp.error_remove_member());
    }
    // 避免被移除的成员是项目所有者
    const memberPermission = await getProjectMemberPermission(form.projectId, form.memberName);
    if (memberPermission === UserPermissionEnum.Owner) {
        throw new Error(mpp.error_remove_owner());
    }

    const response = await axiosClient.post<APIResponse<void>>(`/project/${form.projectId}/members/${form.memberName}`);
    if (response.data.code !== 200) {
        throw new Error(response.data.msg);
    }
}