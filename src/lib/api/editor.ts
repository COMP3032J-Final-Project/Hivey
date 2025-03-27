import axiosClient from './axios';
import type { APIResponse } from '$lib/types/public';
import type { ChatMessage, GetHistoryChatMessagesForm, UpdateProjectMemberPermissionForm, RemoveProjectMemberForm, AddProjectMemberForm } from '$lib/types/editor';
import { type User, UserPermissionEnum } from '$lib/types/auth';
import { mpp } from '$lib/trans';
import type { FileType as EditorFile  } from '$lib/types/editor';

export const getFiles = async (id: string): Promise<EditorFile[]> => {
    const data : EditorFile[] = [
      {
        id: '070cdcb670844fc99ad698bb7cb6595e',
        projectId: "2386daca68444908b938f4b6c6ea94d4",
        filename: 'test.md',
        filepath: 'sample'
      },
      {
        id: '608f902a2780477580b538bf8689b81f',
        projectId: "2386daca68444908b938f4b6c6ea94d4",
        filename: 'Gantt Chart.png',
        filepath: 'sample'
      },
      {
        id: 'e75dba16b5db4b0fa878c52400b016ed',
        projectId: "2386daca68444908b938f4b6c6ea94d4",
        filename: 'Apple.jpg',
        filepath: 'sample'
      }
    ];
    return data;
    // const response = await axiosClient.get<APIResponse<File>>(`/project/${id}/files`);
    // if (!response.data.data) {
    //     throw new Error(response.data.msg);
    // }
    // return response.data.data;
};