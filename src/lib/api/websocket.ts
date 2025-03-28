import { writable, type Writable } from 'svelte/store';
import type { ChatMessage } from '$lib/types/editor';
import type { UserAuth, User } from '$lib/types/auth';

// WebSocket连接状态枚举
export enum WebSocketState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3
}

// WebSocket客户端类
export class ChatWebSocketClient {
  private socket: WebSocket | null = null;
  private projectId: string;
  private currentUser: User;
  private userAuth: UserAuth;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  
  public messages: Writable<ChatMessage[]>; 
  
  constructor(projectId: string, currentUser: User, userAuth: UserAuth, initialMessages: ChatMessage[] = []) {
    this.projectId = projectId;
    this.currentUser = currentUser;
    this.userAuth = userAuth;
    this.messages = writable<ChatMessage[]>(initialMessages);
  }
  
  // 连接到WebSocket服务器
  public connect(): void {
    // 构建WebSocket URL
    const wsUrl = `ws://127.0.0.1:8000/project/${this.projectId}/ws/chat?access_token=${this.userAuth.access_token}`;
    
    try {
      this.socket = new WebSocket(wsUrl);
      // 设置事件处理程序
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('Chatroom WebSocket连接失败:', error);
    }
  }
  
  // 发送消息
  public sendMessage(content: string): void {
    if (!this.socket || this.socket.readyState !== WebSocketState.OPEN) {
      return;
    }

    try {
      this.socket.send(content);
    } catch (error) {
      console.error('消息发送失败:', error);
    }
  }
  
  // 关闭连接
  public disconnect(): void {
    console.log('主动断开WebSocket连接');
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
  
  // 处理连接打开事件
  private handleOpen(event: Event): void {
    console.log('Chatroom WebSocket连接已建立');
    this.reconnectAttempts = 0;
  }
  
  // 处理接收消息事件
  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      const chatMessage: ChatMessage = { // 创建新的聊天消息
        message_type: data.message_type,
        user: data.user,
        content: data.content,
        timestamp: new Date(data.timestamp)
      }
      
      this.messages.update(msgs => { 
        // 更新消息存储，确保新消息添加在列表末尾
        const updatedMsgs = [...msgs, chatMessage].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        return updatedMsgs;
      });
    } catch (error) {
      console.error('消息解析失败:', error, '原始数据:', event.data);
    }
  }
  
  // 处理连接关闭事件
  private handleClose(event: CloseEvent): void {
    console.log('WebSocket连接已关闭:', event.code, event.reason);
    
    // 尝试重连
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const timeout = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      console.log(`${timeout}ms后尝试重新连接...`);
      
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, timeout);
    } else {
      console.log('Chatroom WebSocket连接已断开');
    }
  }
  
  // 处理错误事件
  private handleError(event: Event): void {
    console.error('Chatroom WebSocket错误:', event);
  }
  
  // 获取当前连接状态
  public getState(): WebSocketState {
    return this.socket ? this.socket.readyState : WebSocketState.CLOSED;
  }
}

// 创建WebSocket客户端实例
export function createChatWebSocketClient(
  projectId: string, 
  currentUser: User,
  userAuth: UserAuth,
  initialMessages: ChatMessage[] = []
): ChatWebSocketClient {
  return new ChatWebSocketClient(projectId, currentUser, userAuth, initialMessages);
}
