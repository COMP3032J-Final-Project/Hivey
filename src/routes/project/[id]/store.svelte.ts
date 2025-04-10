import { writable } from 'svelte/store';
import type { User } from '$lib/types/auth';
import type { ChatMessage } from '$lib/types/editor';

// 项目成员状态
export const members = writable<User[]>([]);
export function setMembers(newMembers: User[]) { // 设置项目成员
  members.set(newMembers);
}
export function addMember(member: User) { // 添加新成员
  members.update(currentMembers => {
    // 检查成员是否已存在
    const exists = currentMembers.some(m => m.username === member.username);
    if (!exists) {
      return [...currentMembers, member];
    }
    return currentMembers;
  });
}
export function removeMember(username: string) { // 移除成员
  members.update(currentMembers => 
    currentMembers.filter(member => member.username !== username)
  );
}
export function updateMember(username: string, updatedMember: Partial<User>) { // 更新成员
  members.update(currentMembers => 
    currentMembers.map(member => 
      member.username === username ? { ...member, ...updatedMember } : member
    )
  );
}

// 聊天消息状态
export const chatMessages = writable<ChatMessage[]>([]);

// 设置聊天消息列表
export function setChatMessages(messages: ChatMessage[]) {
  chatMessages.set(messages);
}

// 添加新的聊天消息
export function addChatMessage(message: ChatMessage) {
  chatMessages.update(messages => {
    const updatedMsgs = [...messages, message].sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    return updatedMsgs;
  });
}

// 添加多条聊天消息（用于加载历史消息）
export function addChatMessages(newMessages: ChatMessage[]) {
  chatMessages.update(currentMessages => {
    const combinedMessages = [...newMessages, ...currentMessages];
    return combinedMessages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  });
}