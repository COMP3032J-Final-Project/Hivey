import * as v from 'valibot';

export type FileTreeFolderNode = {
    type: 'folder';
    children: (FileTreeFolderNode | File)[];
}

type SupportedFileType =
   'typst' | 'latex' | 'markdown' | 'pdf' | 'png' | 'jpg' | 'webp' | 'bib';

export type FileType = SupportedFileType | 'unknown';

export type File = {
    id: string;
    name: string,
    type: FileType,
    path: string,
    created_at: string,
    updated_at: string,
    data?: string | Blob
}

// TODO more specific type
// type of the returned file object from API
export const RawFile = v.object({
    project_id: v.string(),
    id: v.string(),
    filename: v.string(),
    filepath: v.string(),
    created_at: v.string(),
    updated_at: v.string(),
});

export type RawFile = v.InferOutput<typeof RawFile>
