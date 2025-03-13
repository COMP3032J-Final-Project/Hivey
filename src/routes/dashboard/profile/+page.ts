import type { PageLoad } from './$types';
import type { User } from '$lib/types/auth';

export const load: PageLoad = async ({ parent }) => {
  // 从父级layout中获取数据
  const { user } = await parent();
  
  return {
    userInfo: user
  };
} 