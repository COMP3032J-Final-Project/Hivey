import { getUserSession } from '$lib/auth';
import type { ChatMessage } from '$lib/types/editor';

/**
 * 创建与项目聊天室的WebSocket连接
 * @param projectId 项目ID
 * @param onMessage 收到消息时的回调函数
 * @returns WebSocket实例和关闭连接的函数
 */
export function createChatWebSocket(
  projectId: string,
  onMessage: (message: ChatMessage) => void
) {
  const userAuth = getUserSession();
  if (!userAuth || !userAuth.access_token) {
    throw new Error('用户未登录或认证已过期');
  }

  // 创建WebSocket URL并添加token参数
  const wsUrl = `ws://127.0.0.1:8000/project/${projectId}/ws/chat?access_token=${userAuth.access_token}`;
  const socket = new WebSocket(wsUrl);

  // 连接打开时的处理
  socket.onopen = () => {
    console.log('聊天室WebSocket连接已建立');
  };

  // 收到消息时的处理
  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data) as ChatMessage;
      // 确保timestamp是Date对象
      message.timestamp = new Date(message.timestamp);
      onMessage(message);
    } catch (error) {
      console.error('解析WebSocket消息失败:', error);
    }
  };

  // 连接关闭时的处理
  socket.onclose = () => {
    console.log('聊天室WebSocket连接已关闭');
  };

  // 连接错误时的处理
  socket.onerror = (error) => {
    console.error('聊天室WebSocket连接错误:', error);
  };

  // 返回WebSocket实例和关闭连接的函数
  return {
    socket,
    close: () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    }
  };
}

/**
 * 通过WebSocket发送聊天消息
 * @param socket WebSocket实例
 * @param message 要发送的消息
 */
export function sendChatMessage(socket: WebSocket, message: ChatMessage) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.error('WebSocket连接未打开，无法发送消息');
  }
}
