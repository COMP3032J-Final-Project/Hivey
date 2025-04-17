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

export const File = v.object({
	id: v.string(),
	project_id: v.string(), 
	filename: v.string(),
	filepath: v.string(),
	created_at: v.optional(v.string()),
	updated_at: v.optional(v.string()),
    filetype: v.optional(v.string()), // .md .tex .typst etc.
    fileContent: v.optional(v.string()),
});
export type File = v.InferOutput<typeof File>;

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