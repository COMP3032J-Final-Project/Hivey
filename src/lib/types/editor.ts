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
	id?: string;
}

export const File = v.object({
	id: v.string(),
	projectId: v.string(), 
	filename: v.string(),
	filepath: v.string(),
})

export interface EditorFileInfo {
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

// 新建文件接口
export interface NewFile {
  	title: string;      // 文件标题
  	suffix: string;     // 文件后缀
  	path: string;       // 文件路径
}

// 新建文件夹接口
export interface NewFolder {
	  title: string;      // 文件夹名字
}

export type FileType = v.InferOutput<typeof File>;