// 聊天消息接口
export interface ChatMessage {
  user: User;
  message: string;    // 消息内容
  timestamp: Date;    // 消息发送时间
}

// 聊天室状态接口
export interface ChatState {
  isOpen: boolean;    // 聊天室是否打开
  messages: ChatMessage[]; // 消息列表
}
