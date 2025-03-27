import { writable, type Writable } from 'svelte/store';
import type { ChatMessage } from '$lib/types/editor';
import { failure, success } from '$lib/components/ui/toast';
import type { UserAuth } from '$lib/types/auth';

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
  private accessToken: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  
  // 存储消息的writable store
  public messages: Writable<ChatMessage[]>;
  
  constructor(projectId: string, accessToken: string, initialMessages: ChatMessage[] = []) {
    this.projectId = projectId;
    this.accessToken = accessToken;
    this.messages = writable<ChatMessage[]>(initialMessages);
  }
  
  // 连接到WebSocket服务器
  public connect(): void {
    // 构建WebSocket URL
    const wsUrl = `ws://127.0.0.1:8000/project/${this.projectId}/ws/chat?access_token=${encodeURIComponent(this.accessToken)}`;
    
    try {
      this.socket = new WebSocket(wsUrl);
      
      // 设置事件处理程序
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('WebSocket连接失败:', error);
      failure('聊天服务器连接失败');
    }
  }
  
  // 发送消息
  public sendMessage(content: string): void {
    if (!this.socket || this.socket.readyState !== WebSocketState.OPEN) {
      failure('聊天服务器未连接');
      return;
    }
    
    try {
      const messageObject = {
        type: 'message',
        content: content
      };
      
      this.socket.send(JSON.stringify(messageObject));
    } catch (error) {
      console.error('消息发送失败:', error);
      failure('消息发送失败');
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
    console.log('WebSocket连接已建立');
    this.reconnectAttempts = 0;
    success('已连接到聊天服务器');
  }
  
  // 处理接收消息事件
  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      
      // 处理接收到的消息
      if (data.type === 'message') {
        // 创建新的聊天消息
        const chatMessage: ChatMessage = {
          user: data.user,
          content: data.content,
          timestamp: new Date(data.timestamp)
        };
        
        // 更新消息存储
        this.messages.update(msgs => [...msgs, chatMessage]);
      }
    } catch (error) {
      console.error('消息解析失败:', error);
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
      failure('聊天服务器连接已断开');
    }
  }
  
  // 处理错误事件
  private handleError(event: Event): void {
    console.error('WebSocket错误:', event);
    failure('聊天服务器发生错误');
  }
  
  // 获取当前连接状态
  public getState(): WebSocketState {
    return this.socket ? this.socket.readyState : WebSocketState.CLOSED;
  }
}

// 创建WebSocket客户端实例
export function createChatWebSocketClient(
  projectId: string, 
  authInfo: UserAuth,
  initialMessages: ChatMessage[] = []
): ChatWebSocketClient {
  return new ChatWebSocketClient(projectId, authInfo.access_token, initialMessages);
}
