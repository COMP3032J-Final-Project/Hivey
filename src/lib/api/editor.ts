import axiosClient from './axios';
import type { APIResponse } from '$lib/types/public';
import type { File as EditorFile, createFileFrom, updateFileFrom } from '$lib/types/editor';
import { uint8ArrayToBase64 } from '$lib/utils';

export const getFiles = async (projectId: string): Promise<EditorFile[]> => {
    const response = await axiosClient.get<APIResponse<EditorFile[]>>(`/project/${projectId}/files/`);
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
};

export const getFileURL = async (projectId: string, fileId: string): Promise<string> => {
    const response = await axiosClient.get<APIResponse<{url: string}>>(`/project/${projectId}/files/${fileId}`);
    if (response.data.code != 200 || !response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data.url;
}

export async function fetchDocData(fileType: string, url: string): Promise<any> {
    console.log("Fetching data from URL:", url);
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
    console.log(result);
    return result;
}

const createEmptyFile = async (fileName: string): Promise<File> => {
    const fileType = fileName.split(".")[-1];
    switch (fileType) {
        case 'pdf':
            return new File([new Blob()], fileName, { type: 'application/pdf' });
        case 'md':
            return new File([new Blob()], fileName, { type: 'text/markdown' });
        case 'tex':
            return new File([new Blob()], fileName, { type: 'text/x-tex' });
        case 'bib':
            return new File([new Blob()], fileName, { type: 'application/x-bibtex' });
        case 'typ':
            return new File([new Blob()], fileName, { type: 'application/x-typ' });
        default:
            return new File([new Blob()], fileName, { type: 'text/plain' });
    }
}


export const createFile = async (projectId: string, fileForm: createFileFrom) => {
  const { title, path } = fileForm;
  let tempForm;
  tempForm = {
      filename: title,
      filepath: path,
  };
  const response = await axiosClient.post<APIResponse<{file_id: string, url: string}>>(`/project/${projectId}/files/create_update`, tempForm);
  if (!response.data.data) {
      throw new Error(response.data.msg);
  }
  // 创建一个空的文本文件
  const emptyFile = await createEmptyFile(tempForm.filename);
  console.log("Uploading file:", emptyFile);
  console.log("File size:", emptyFile.size);
  const uploadResponse = await fetch(response.data.data.url, {
      method: 'PUT',
      body: emptyFile,
  });
  if (uploadResponse.ok) {
      console.log('文件上传成功');
  } else {
      console.error('上传失败', await uploadResponse.text());
  }
    
};

export const deleteFile = async (projectId: string, fileId: string) => {
    console.log("Deleting file with ID:", fileId);
    const response = await axiosClient.delete<APIResponse<EditorFile[]>>(`/project/${projectId}/files/${fileId}`);
    if (response.status >= 200 && response.status < 300) {
        return;
      }
    throw new Error(response.data.msg);
}

export const updateFile = async (projectId: string, fileId: string, fileForm: updateFileFrom) => {
    const response = await axiosClient.put<APIResponse<EditorFile[]>>(`/project/${projectId}/files/${fileId}/mv`, fileForm);
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
}