import type { File, RawFile } from '$lib/types/file';
import { getFiles, getFileURL, fetchDocData } from '$lib/api/editor';
import { projectFiles, projectState } from './state.svelte';
import { getFileType } from '$lib/utils';


export async function loadFiles(projectId: string) {
    const files_data = await getFiles(projectId);
    let files: File[] = [];
    files_data.forEach(raw_file => {
        files.push({
            id: raw_file.id,
            name: raw_file.filename,
            path: raw_file.filepath,
            type: getFileType(raw_file.filename),
            created_at: raw_file.created_at,
            updated_at: raw_file.updated_at,
        })
    });
}

export function getCurrentFile(): File | undefined {
    // We assign the id value to a variable to avoid id changes while we do operations
    const currentFileId = projectState.currentFileId;
    
    if (!currentFileId) return undefined;
    return projectFiles.get(currentFileId);
}

export async function reLoadCurrentFile(projectId: string): Promise<File | undefined> {
    const currentFile = getCurrentFile();
    if (currentFile == null) return currentFile;
    
    const url = await getFileURL(projectId, currentFile.id);
    currentFile.data = await fetchDocData(currentFile.type, url);
    return currentFile;
}

