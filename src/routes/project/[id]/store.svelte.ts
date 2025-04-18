import { writable } from 'svelte/store';
import type { User } from '$lib/types/auth';
import  { type Project, ProjectType } from '$lib/types/dashboard';
import type { ChatMessage, File, TreeNode } from '$lib/types/editor';
import { getFiles, getFileURL, fetchDocData } from '$lib/api/editor';
import { buildFileTree } from '$lib/utils';

// Project
export const project = writable<Project>({
    id: '',
    name: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    type: ProjectType.Project,
    owner: undefined,
    members_num: 0,
    isFavorite: false
});
export function setProject(newProject: Project) {
    project.set(newProject);
}
export function updateProject(newProject: Partial<Project>) {
    project.update(currentProject => ({
        ...currentProject,
        ...newProject
    }));
}

// ==============================================================================

// 项目的文件列表
export const files = writable<File[]>([]);
export function setFiles(newFiles: File[]) {
    files.set(newFiles);
}
export async function loadFiles(projectId: string, temporaryFolders: TreeNode[]) {
    try {
        const updatedFiles = await getFiles(projectId);
        setFiles(updatedFiles);
        setFilesStruct(buildFileTree(updatedFiles, temporaryFolders));
        return true;
    } catch (error) {
        console.error('Failed to reload files:', error);
        return false;
    }
}

// ==============================================================================

// 项目的文件树
export const filesStruct = writable<TreeNode[]>([]);
export function setFilesStruct(newFilesStruct: TreeNode[]) {
    filesStruct.set(newFilesStruct);
}

// ==============================================================================

// 项目的空文件夹列表
export const tempFolders = writable<TreeNode[]>([]);
export function setTempFolders(newFolders: TreeNode[]) {
    tempFolders.set(newFolders);
}

// ==============================================================================

// 用户当前打开(选中)的文件
export const currentFile = writable<File>({
    id: '',
    project_id: '',
    filename: '',
    filepath: '',
    filetype: 'Format',
    fileContent: ''
});
export function setCurrentFile(file: File) {
    currentFile.set(file);
}
export function updateCurrentFile(file: Partial<File>) {
    currentFile.update(currentFile => ({
        ...currentFile,
        ...file
    }));
}
export async function switchCurrentFile(projectId: string, fileId: string, fileName: string) {
    try {
        const filetype = fileName.split('.').pop() || 'md';
        updateCurrentFile({
            id: fileId,
            filename: fileName,
            filetype: filetype,
            fileContent: 'Loading content...'
        });
        const url = await getFileURL(projectId, fileId);
        const fileData = await fetchDocData(filetype, url);
        updateCurrentFile({
            fileContent: fileData
        });
        return true;
    } catch (error) {
        console.error('Failed to load file:', error);
        return false;
    }
}

// ==============================================================================

// 项目成员状态
export const members = writable<User[]>([]);
export function setMembers(newMembers: User[]) { // 设置项目成员
    members.set(newMembers);
}
export function addMember(member: User) { // 添加新成员
    members.update(currentMembers => {
        // 检查成员是否已存在
        const exists = currentMembers.some(m => m.username === member.username);
        if (!exists) { // 如果成员不存在则添加成员
            // 如果成员没有头像，则将用户名的前两个字母作为头像
            if (!member.avatar) {
                member.avatar = "https://ui-avatars.com/api/?name=" + member.username.slice(0, 2);
            }
            return [...currentMembers, member];
        }
        return currentMembers;
    });
}
export function removeMember(username: string) { // 移除成员
    members.update(currentMembers =>
        currentMembers.filter(member => member.username !== username)
    );
}
export function updateMember(username: string, updatedMember: Partial<User>) { // 更新成员
    members.update(currentMembers =>
        currentMembers.map(member =>
            member.username === username ? { ...member, ...updatedMember } : member
        )
    );
}

// ==============================================================================

// 聊天消息状态
export const chatMessages = writable<ChatMessage[]>([]);
export function setChatMessages(messages: ChatMessage[]) { // 设置聊天消息列表
    chatMessages.set(messages);
}
export function addChatMessage(message: ChatMessage) { // 添加新的聊天消息
    chatMessages.update(messages => {
        const updatedMsgs = [...messages, message].sort((a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        return updatedMsgs;
    });
}
export function addChatMessages(newMessages: ChatMessage[]) { // 添加多条聊天消息（用于加载历史消息）
    chatMessages.update(currentMessages => {
        const combinedMessages = [...newMessages, ...currentMessages];
        return combinedMessages.sort((a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
    });
}
