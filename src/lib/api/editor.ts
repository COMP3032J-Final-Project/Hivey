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

// export async function fetchDocData(url: string): Promise<any> {
//     try {
//       const response = await axios.get(url); // 发送 GET 请求
//       return response.data;
//     } catch (error) {
//       console.error("Axios error:", error);
//     }
// }

export async function fetchDocData(url: string): Promise<any> {
      console.log("Fetching data from URL:", url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();console.log(data);
      return data;
}

// export const createFiles = async (file: createFileFrom): Promise<EditorFile[]> => {
//   data.push(
//     {
//       id: '070cdcb670844fc99ad698bb7cb6595e',
//       projectId: "",
//       filename: file.title+'.'+file.suffix,
//       filepath: file.path,
//       created_at: '2023-10-01T12:00:00Z',
//       updated_at: '2023-10-01T12:00:00Z'
//     }
//   );
//   return data;
// };