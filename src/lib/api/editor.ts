import axiosClient from './axios';
import type { APIResponse } from '$lib/types/public';
import { RawFile, type File as EditorFile } from '$lib/types/file';
import type { createFileFrom, updateFileFrom } from '$lib/types/editor';
import { uint8ArrayToBase64, getFileType } from '$lib/utils';
import axios from 'axios';
import * as v from 'valibot';

export async function getFiles(projectId: string): Promise<RawFile[]> {
    const response = await axiosClient.get(`/project/${projectId}/files/`);
    const data = response.data.data;
    return v.parse(v.array(RawFile), data);
};

export async function getFileURL(projectId: string, fileId: string): Promise<string> {
    const response = await axiosClient.get<APIResponse<{url: string}>>(`/project/${projectId}/files/${fileId}`);
    return response.data.data!.url;
}

export async function fetchDocData(fileType: string, url: string): Promise<any> {
    // TODO change it to axios so we don't need to handle error here
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let result;
    if (fileType === 'pdf') {
        const temp = await response.arrayBuffer(); // 或者 response.arrayBuffer()，视需求而定
        result = uint8ArrayToBase64(new Uint8Array(temp));
    } else {
        result = await response.text();
    }
    return result;
}

export async function createFile(projectId: string, fileForm: createFileFrom) {
    const { title : fileName, path, filetype } = fileForm;
    if (filetype === "folder") return [];
    
    const response = await axiosClient.post<APIResponse<{file_id: string, url: string}>>(
        `/project/${projectId}/files/create_update`,
        {
            filename: fileName,
            filepath: path,
        }
    );
    const data = response.data.data;
    if (!data) {
        throw new Error(response.data.msg);
    }
    // 创建一个空的文本文件
    const emptyFile = new File([new Blob()], fileName, { type: 'text/plain' });
    // console.debug("Uploading file:", emptyFile);
    await axios({
        url: data.url,
        method: 'put',
        data: emptyFile,
    });
};

export async function deleteFile(projectId: string, fileId: string) {
    // console.debug("Deleting file with ID:", fileId);
    await axiosClient.delete<APIResponse<EditorFile[]>>(`/project/${projectId}/files/${fileId}`);
}

export async function updateFile(projectId: string, fileId: string, fileForm: updateFileFrom) {
    await axiosClient.put<APIResponse<EditorFile[]>>(`/project/${projectId}/files/${fileId}/mv`, fileForm);
}
