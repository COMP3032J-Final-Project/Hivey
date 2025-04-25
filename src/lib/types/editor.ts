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
    ADDED = 'added', // file_id: "f7wdadwa"; state_before: null; state_after: {"filename":"Test.md","filepath":""}
    RENAMED = 'renamed', // file_id: "f7wdadwa"; state_before: {"filename":"Test.md","filepath":""}; state_after: {"filename":"Test22.md","filepath":""}
    MOVED = 'moved', // file_id: "f7wdadwa"; state_before: {"filename":"Test.md","filepath":""}; state_after: {"filename":"Test.md","filepath":"folder/Test22.md"}
    DELETED = 'deleted', // file_id: "f7wdadwa"; state_before: {"filename":"Test.md","filepath":""}; state_after: null
    UPDATE_NAME = 'update_name' // file_id: null; state_before: null; state_after: {"name":"Test11"}
}

export const HistoryMessage = v.union([
    v.object({
        action: v.literal(HistoryAction.ADDED),
        project_id: v.string(),
        user: User,
        file_id: v.string(),
        state_before: v.null(),
        state_after: v.object({ filename: v.string(), filepath: v.string() }),
        timestamp: v.date(),
    }),
    v.object({
        action: v.literal(HistoryAction.RENAMED),
        project_id: v.string(),
        user: User,
        file_id: v.string(),
        state_before: v.object({ filename: v.string(), filepath: v.string() }),
        state_after: v.object({ filename: v.string(), filepath: v.string() }),
        timestamp: v.date(),
    }),
    v.object({
        action: v.literal(HistoryAction.MOVED),
        project_id: v.string(),
        user: User,
        file_id: v.string(),
        state_before: v.object({ filename: v.string(), filepath: v.string() }),
        state_after: v.object({ filename: v.string(), filepath: v.string() }),
        timestamp: v.date(),
    }),
    v.object({
        action: v.literal(HistoryAction.DELETED),
        project_id: v.string(),
        user: User,
        file_id: v.string(),
        state_before: v.object({ filename: v.string(), filepath: v.string() }),
        state_after: v.null(),
        timestamp: v.date(),
    }),
    v.object({
        action: v.literal(HistoryAction.UPDATE_NAME),
        project_id: v.string(),
        user: User,
        file_id: v.optional(v.nullable(v.string())),
        state_before: v.null(),
        state_after: v.object({ name: v.string() }),
        timestamp: v.date(),
    }),
]);
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
