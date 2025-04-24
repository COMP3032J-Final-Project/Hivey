import axiosClient from './axios';
import type { APIResponse } from '$lib/types/public';
import type { File as EditorFile, createFileFrom, updateFileFrom } from '$lib/types/editor';
import { LoroDoc, VersionVector } from 'loro-crdt';
import { Base64 } from 'js-base64';
import { getFileType, getFileCategory } from '$lib/utils';
import { LORO_CRDT_CODEMIRROR_CONTAINER_ID } from '$lib/constants';

export const getFiles = async (projectId: string): Promise<EditorFile[]> => {
    const response = await axiosClient.get<APIResponse<EditorFile[]>>(`/project/${projectId}/files/`);
    if (!response.data.data) {
        throw new Error(response.data.msg);
    }
    return response.data.data;
};

export async function getFileURL(
    projectId: string,
    fileId: string,
    crdt_protected: boolean = false,
): Promise<string> {
    let url = `/project/${projectId}/files/${fileId}`;
    if (crdt_protected) url += "?crdt_protected=true";
    
    const response = await axiosClient.get<APIResponse<{url: string}>>(url);
    return response.data.data!.url;
}

const createEmptyFile = async (fileName: string): Promise<File> => {
    const fileType = await getFileType(fileName);
    switch (fileType) {
        case 'pdf':
            return new File([new Blob()], fileName, { type: 'application/pdf' });
        case 'markdown':
            return new File([new Blob()], fileName, { type: 'text/markdown' });
        case 'latex':
            return new File([new Blob()], fileName, { type: 'text/x-tex' });
        case 'bib':
            return new File([new Blob()], fileName, { type: 'application/x-bibtex' });
        case 'typst':
            return new File([new Blob()], fileName, { type: 'application/x-typ' });
        default:
            return new File([new Blob()], fileName, { type: 'text/plain' });
    }
}

export const checkFileExistence = async (projectId: string, fileId: string): Promise<File> => {
    const response = await axiosClient.get<APIResponse<File>>(`/project/${projectId}/files/${fileId}/exist`);
    if (response.data.code != 200 || !response.data.data) {
        throw new Error(response.data.msg);
    }
    const file: File = response.data.data;
    return file;
}

export const createFile = async (projectId: string, fileForm: createFileFrom) => {
    const { title } = fileForm;
    return uploadFile(projectId, fileForm, await createEmptyFile(title));
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

export async function uploadFile(projectId: string, fileForm: createFileFrom, file: File) {
    const { title, path } = fileForm;
    const filename = title;
    const response = await axiosClient.post<APIResponse<{file_id: string, url: string}>>(
        `/project/${projectId}/files/create_update`,
        {
            filename,
            filepath: path,
        }
    );
    if (!response.data.data || response.data.code != 200) 
        throw new Error(response.data.msg);
    
    const data = response.data.data;
    const fileId = data.file_id;
    const fileUrl = data.url;


    // --- Step 2: Determine if file should be treated as editable (CRDT) or binary ---
    const filetype = await getFileType(filename, file);
    const file_category = getFileCategory(filetype);

    let uploadBody;
    if (file_category == "PlainText") {
        const fileContent = await file.text();
        
        const doc = new LoroDoc();
        const text = doc.getText(LORO_CRDT_CODEMIRROR_CONTAINER_ID);
        text.insert(0, fileContent);
        doc.commit();
        const snapshot = doc.export({ mode: "snapshot" });
        
        uploadBody = snapshot;
    } else {
        uploadBody = file;
    }

    // console.debug("uploadBody: ", uploadBody);
    
    await fetch(fileUrl, {method: 'PUT', body: uploadBody});

    const result = await checkFileExistence(projectId, fileId);
    if (!result ) {
        throw new Error("Failed to create file!");
    }
    return result;
}


export async function getFileMissingOps(projectId: string, fileId: string, doc: LoroDoc) {
    const rawOpLogVersion = doc.oplogVersion();
    const opLogVersion = Base64.fromUint8Array(rawOpLogVersion.encode(), true);
    const response = await axiosClient.get(
        `/project/${projectId}/files/${fileId}/crdt?opLogVersion=${opLogVersion}`
    );
    return Base64.toUint8Array(response.data.data);
}
