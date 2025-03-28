import { writable } from 'svelte/store';
import type { User } from '$lib/types/auth';

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