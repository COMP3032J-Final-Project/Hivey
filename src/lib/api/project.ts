import axiosClient from './axios';
import type { APIResponse } from '$lib/types/public';
import type { ChatMessage, GetHistoryChatMessagesForm, UpdateProjectMemberPermissionForm, RemoveProjectMemberForm, AddProjectMemberForm, ShareProject2TemplateForm } from '$lib/types/editor';
import { type User, UserPermissionEnum } from '$lib/types/auth';
import { mpp } from '$lib/trans';

export async function initializeProject(projectId: string) {
    axiosClient.get(`/project/${projectId}/initialize`);
}

// 获取项目聊天室的聊天记录
export const getHistoryChatMessages = async (form: GetHistoryChatMessagesForm): Promise<{ code: number, messages: ChatMessage[] }> => {
    const { projectId, max_num, last_timestamp } = form;

    // 将Date转换为本地ISO格式字符串
    const formattedTimestamp = last_timestamp instanceof Date ?
        new Date(last_timestamp.getTime() - last_timestamp.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 19) : last_timestamp;

    const response = await axiosClient.get<APIResponse<ChatMessage[]>>(`/project/${projectId}/chat/history`, {
        params: {
            max_num: max_num,
            last_timestamp: formattedTimestamp
        }
    });
    // 如果状态码不是200或201
    if (response.data.code !== 200 && response.data.code !== 201) {
        throw new Error(response.data.msg);
    }
    return {
        code: response.data.code,
        messages: response.data.data || []
    };
}

// 获取项目下的某个成员的所有信息(包括其权限)
export const getProjectMemberInfo = async (projectId: string, memberName: string): Promise<User> => {
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
    const response = await axiosClient.get<APIResponse<User[]>>(`/project/${projectId}/members/`);
    if (response.data.code !== 200) {
        throw new Error(response.data.msg);
    }
    return response.data.data || [];
}

// 添加项目成员
export const addProjectMember = async (form: AddProjectMemberForm): Promise<void> => {
    const { currentUser, projectId, inviteeName, inviteePermission } = form;
    // 验证当前用户是否有权限添加成员
    const currentUserPermission = await getProjectMemberPermission(projectId, currentUser.username);
    if (currentUserPermission !== UserPermissionEnum.Admin && currentUserPermission !== UserPermissionEnum.Owner) {
        throw new Error(mpp.error_add_member());
    }

    // 验证被邀请的用户权限是否在当前用户权限范围内(admin只能添加 writer, viewer, 而owner可以添加 admin, writer, viewer)
    if (inviteePermission !== UserPermissionEnum.Admin && inviteePermission !== UserPermissionEnum.Writer && inviteePermission !== UserPermissionEnum.Viewer) {
        throw new Error(mpp.error_add_member_admin_permission());
    }

    const response = await axiosClient.post<APIResponse<void>>(`/project/${projectId}/members/${inviteeName}`, { permission: inviteePermission });
    if (response.data.code !== 200) {
        throw new Error(response.data.msg);
    }
}

// 更新项目成员权限
export const updateProjectMemberPermission = async (form: UpdateProjectMemberPermissionForm): Promise<void> => {
    const { currentUser, memberName, projectId, newPermission } = form;

    // 验证当前用户是否有权限更新成员权限
    const currentUserPermission = await getProjectMemberPermission(projectId, currentUser.username);
    if (currentUserPermission !== UserPermissionEnum.Admin && currentUserPermission !== UserPermissionEnum.Owner) {
        throw new Error(mpp.error_edit_member_permission());
    }

    const response = await axiosClient.put<APIResponse<void>>(`/project/${projectId}/members/${memberName}`, { permission: newPermission });
    if (response.data.code !== 200) {
        throw new Error(response.data.msg);
    }
}

// 移除项目成员
export const removeProjectMember = async (form: RemoveProjectMemberForm): Promise<void> => {
    const { currentUser, memberName, projectId } = form;

    // 验证当前用户是否有权限移除成员
    const currentUserPermission = await getProjectMemberPermission(projectId, currentUser.username);
    // 只有admin和owner可以移除成员, 或者成员自己可以移除自己
    if (currentUserPermission !== UserPermissionEnum.Admin && currentUserPermission !== UserPermissionEnum.Owner && currentUser.username !== memberName) {
        throw new Error(mpp.error_remove_member());
    }
    // 避免被移除的成员是项目所有者
    const memberPermission = await getProjectMemberPermission(projectId, memberName);
    if (memberPermission === UserPermissionEnum.Owner) {
        throw new Error(mpp.error_remove_owner());
    }
    console.log('removeProjectMember', form);
    // 在字段中添加project_id 和 member_name
    const response = await axiosClient.delete<APIResponse<void>>(`/project/${projectId}/members/${memberName}`);
    if (response.data.code !== 200) {
        throw new Error(response.data.msg);
    }
}

// 将Project导出为Template
export const shareProject2Template = async (form: ShareProject2TemplateForm): Promise<void> => {
    const { projectId, currentUser, templateName, isPublic } = form;

    // 验证当前用户是否为项目的所有者
    const currentUserPermission = await getProjectMemberPermission(projectId, currentUser.username);
    if (currentUserPermission !== UserPermissionEnum.Owner) {
        throw new Error("You are not the owner of this project!");
    }

    const response = await axiosClient.post<APIResponse<void>>(`/project/${projectId}/create_template`, 
        { is_public: isPublic, name: templateName, type: 'template' });
    if (response.data.code !== 200) {
        throw new Error(response.data.msg);
    }
}

// 从Template开始一个Project
export const createProjectFromTemplate = async (templateId: string, projectName: string): Promise<string> => {
    const response = await axiosClient.post<APIResponse<{ project_id: string }>>(`/project/${templateId}/create_project`, 
        {name: projectName });
    if (response.data.code !== 200) {
        throw new Error(response.data.msg);
    }
    return response.data.data?.project_id || "";
}
