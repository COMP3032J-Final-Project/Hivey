import { User, UserPermissionEnum } from '$lib/types/auth';
import { Project } from '$lib/types/dashboard';
import type { Writable } from 'svelte/store';
import * as v from 'valibot';

export interface SidebarFolder {
	  title: string;
	  url: string;
	  icon?: any;
	  isActive?: boolean;
	  items?: SidebarFile[];
}

export interface SidebarFile {
	title: string;
	url: string;
	icon?: any;
	id: string;
}

export const File = v.object({
	id: v.string(),
	projectId: v.string(), 
	filename: v.string(),
	filepath: v.string(),
	created_at: v.string(),
	updated_at: v.string(),
});

export type FileType = v.InferOutput<typeof File>;

export interface EditorFileInfo {
	currentFileId: Writable<string>;
	updateFileId: (id: string) => void;
	currentFileName: Writable<string>;
	updateFileName: (name: string) => void;
    currentFileType: Writable<string>;
    updateFileType: (type: string) => void;
    docContent?: Writable<string>;
    updateContent?: (content: string) => void;
    currentFilePath?: Writable<string>;
    loadFile?: (fileId: string, fileName: string) => Promise<boolean>;
}

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

export const createFileFrom = v.object({
	title: v.string(),
	suffix: v.string(),
	path: v.string(),
});

export type createFileFrom = v.InferOutput<typeof createFileFrom>;

export const createFolderFrom = v.object({
	fodername: v.string(),
});

export type createFolderFrom = v.InferOutput<typeof createFolderFrom>;
