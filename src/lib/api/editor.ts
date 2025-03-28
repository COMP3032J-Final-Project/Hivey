import axios from 'axios';
import axiosClient from './axios';
import type { APIResponse } from '$lib/types/public';
import type { ChatMessage, GetHistoryChatMessagesForm, UpdateProjectMemberPermissionForm, RemoveProjectMemberForm, AddProjectMemberForm } from '$lib/types/editor';
import { type User, UserPermissionEnum } from '$lib/types/auth';
import { mpp } from '$lib/trans';
import type { FileType as EditorFile, createFileFrom } from '$lib/types/editor';

export const getFiles = async (id: string): Promise<EditorFile[]> => {
    const response = await axiosClient.get<APIResponse<EditorFile[]>>(`/project/${id}/files/`);
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
};

export const getFileContent = async (projectId: string, fileId: string): Promise<string> => {
    const response = await axiosClient.get<APIResponse<string>>(`/project/${projectId}/files/${fileId}`);
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
}

export async function fetchDocData(url: string): Promise<any> {
      console.log("Fetching data from URL:", url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text(); 
      console.log(text);
      return text;
}

export const createFile = async (projectId: string, fileForm: createFileFrom): Promise<EditorFile[]> => {
    const tempForm = {
        filename: fileForm.title + "." + fileForm.suffix,
        filepath: fileForm.path,
        filetype: fileForm.filetype,
    }
    const response = await axiosClient.post<APIResponse<EditorFile[]>>(`/project/${projectId}/files/create`, tempForm);
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
};