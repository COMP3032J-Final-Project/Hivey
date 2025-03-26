import type { User } from '$lib/types/auth';

export interface SidebarFolder {
	  title: string;
	  url: string;
	  icon?: any;
	  isActive?: boolean;
	  items?: {
		    title: string;
		    url: string;
	  }[];
}

export interface SidebarFile {
	title: string;
	url: string;
	icon?: any;
}


export interface EditorFileType {
    currentFileType: Writable<string>;
    updateFileType: (type: string) => void;
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
