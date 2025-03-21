import type { User } from '$lib/types/auth';

export interface SidebarFolder {
	title: string;
	url: string;
	icon?: any;
	isActive?: boolean;
	isEditing?: boolean;
	items?: {
		title: string;
		url: string;
	}[];
}

// 聊天消息接口
export interface ChatMessage {
	user: User;
	message: string; // 消息内容
	timestamp: Date; // 消息发送时间
}

// 新建文件接口
export interface NewFile {
  title: string;      // 文件标题
  suffix: string;     // 文件后缀
  path: string;       // 文件路径
}