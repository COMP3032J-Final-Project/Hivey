import { User, UserPermissionEnum } from '$lib/types/auth';
import type { Writable } from 'svelte/store';
import * as v from 'valibot';


export interface TreeNode {
  id: string;
  project_id: string;
  filename: string;
  filepath: string;
  filetype: 'file' | 'folder';
  children: TreeNode[] | null; 
}

export enum FileType {
	  MARKDOWN = 'markdown',
	  TYPST = 'typst',
	  LATEX = 'latex',
	  BIB = 'bib',
	  PLAIN_TEXT = 'plain_text',
    
	  PNG = 'png',
	  JPG = 'jpg',
	  WEBP = 'webp',
    
	  PDF = 'pdf',
	  GENERIC_BINARY = 'binary'
}

export type FileCategory = 'PlainText' | 'Image' | 'Binary';

export const File = v.object({
    id: v.string(),
    project_id: v.string(), 
    filename: v.string(),
    filepath: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    filetype: v.optional(v.enum(FileType)), // .md .tex .typst etc.
    rawData: v.any()  // FIXME uint8array (bytes)
});

export type File = v.InferOutput<typeof File>;


export enum HistoryAction {
    ADDED = 'added',
    RENAMED = 'renamed',
    MOVED = 'moved',
    DELETED = 'deleted',
    UPDATE_NAME = 'update_name'
}

export const HistoryMessage = v.object({
    user: User,
    action: v.enum(HistoryAction),
    timestamp: v.date(),
    payload: v.any()
})
export type HistoryMessage = v.InferOutput<typeof HistoryMessage>;


// 聊天消息接口
export interface ChatMessage {
    message_type: string; // 默认为text
    user: User;
    content: string; // 消息内容
    timestamp: Date; // 消息发送时间
}

export interface GetHistoryChatMessagesForm {
    max_num: number;
      last_timestamp: Date;
      projectId: string;
}

export interface UpdateProjectMemberPermissionForm {
      currentUser: User;
    newPermission: UserPermissionEnum;
      projectId: string;
      memberName: string;
}

export interface AddProjectMemberForm {
      currentUser: User;
      projectId: string;
      inviteeName: string;
      inviteePermission: UserPermissionEnum;
}

export interface RemoveProjectMemberForm {
      currentUser: User;
      projectId: string;
      memberName: string;
}

export const ShareProject2TemplateForm = v.object({
    projectId: v.string(),
    currentUser: User,
    templateName: v.string(),
    isPublic: v.boolean(),
})
export type ShareProject2TemplateForm = v.InferOutput<typeof ShareProject2TemplateForm>;

export const createFileFrom = v.object({
  title: v.string(),
  path: v.string(),
});
export type createFileFrom = v.InferOutput<typeof createFileFrom>;

export const updateFileFrom = v.object({
  filename: v.string(),
  filepath: v.string(),
});
export type updateFileFrom = v.InferOutput<typeof updateFileFrom>;
