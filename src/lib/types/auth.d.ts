// 用户模型
export interface User {
    username: string;
    password: string;
    email: string;
    user_id: string;
  }

// 用户注册信息
export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

// 用户登录信息
export interface LoginForm {
  email: string;
  password: string;
}



