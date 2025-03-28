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