import axiosClient from './axios';
import type { APIResponse } from '$lib/types/public';
import type { FileType as EditorFile, createFileFrom, FileURLResponse } from '$lib/types/editor';

export const getFiles = async (projectId: string): Promise<EditorFile[]> => {
    const response = await axiosClient.get<APIResponse<EditorFile[]>>(`/project/${projectId}/files/`);
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
};

export const getFileContent = async (projectId: string, fileId: string): Promise<FileURLResponse> => {
    const response = await axiosClient.get<APIResponse<FileURLResponse>>(`/project/${projectId}/files/${fileId}`);
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
    let tempForm;
    if(fileForm.filetype=="folder") {
        tempForm = {
            filename: fileForm.title,
            filepath: fileForm.path,
            filetype: fileForm.filetype,
        };
    }
    else{
        tempForm = {
            filename: fileForm.title + "." + fileForm.suffix,
            filepath: fileForm.path,
            filetype: fileForm.filetype,
        };
    }
    const response = await axiosClient.post<APIResponse<EditorFile[]>>(`/project/${projectId}/files/create`, tempForm);
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
};

export const deleteFile = async (projectId: string, fileId: string): Promise<EditorFile[]> => {
    const response = await axiosClient.delete<APIResponse<EditorFile[]>>(`/project/${projectId}/files/${fileId}`);
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
}