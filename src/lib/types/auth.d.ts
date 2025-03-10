// 基础用户信息
export interface UserInfo {
  username: string;
  email: string;
  password: string;
}

// 用户认证信息
export interface UserAuth {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// 完整用户模型
export interface User extends UserInfo, Partial<UserAuth> {
  // username: string;
  // email: string;
  // password: string;
  // access_token?: string;
  // refresh_token?: string;
  // token_type?: string;
  // expires_in?: number;
}

// 用户注册表单
export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

// 用户登录表单
export interface LoginForm {
  email: string;
  password: string;
}



