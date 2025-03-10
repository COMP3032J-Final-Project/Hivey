import axios from 'axios';
import type { APIResponse } from '$lib/types/public';
import type { UserInfo, UserAuth, User, RegisterForm, LoginForm } from '$lib/types/auth';
import * as m from '$lib/paraglide/messages';

const ip_address = '127.0.0.1'; // 开发环境下的 IP 地址, 部署时需要修改
const port = '8080';
const base_url = `http://${ip_address}:${port}`;
const is_mock = true;

// 注册新用户
export const postUserRegister = async (form: RegisterForm): Promise<UserInfo> => {
	// Mock Response
	if (is_mock) {
		const mock_response: APIResponse<UserInfo> = {
			code: 200,
			msg: m.success_sign_up(),
			data: {
				email: form.email,
				username: form.username,
				password: form.password
			}
		};
		return mock_response.data as User;
	}

	try {
		// 使用完整的URL，包括http://前缀和端口号
		const response = await axios.post<APIResponse<UserInfo>>(`${base_url}/user/register`, form);
		// 根据响应状态码返回用户友好的错误消息
		switch (response.data.code) {
			case 200:
				if (response.data.data) {			
					return response.data.data;
				}
				throw new Error(m.error_unknown());
			case 409:
				throw new Error(m.error_user_exists());
			default:
				throw new Error(response.data.msg || m.error_unknown());
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.msg || m.error_network());
		}
		throw error;
	}
};

// 用户登录
export const postUserLogin = async (form: LoginForm): Promise<UserAuth> => {
	// Mock Response
	if (is_mock) {
		const mock_response: APIResponse<UserAuth> = {
			code: 200,
			msg: m.success_sign_in(),
			data: {
				access_token: '1234567890',
				refresh_token: '1234567890',
				token_type: 'Bearer',
				expires_in: 360000
			}
		};
		return mock_response.data as UserAuth;
	}

	try {
		const response = await axios.post<APIResponse<UserAuth>>(`${base_url}/auth/login`, form);

		switch (response.data.code) {
			case 200:
				if (response.data.data) {
					return response.data.data;
				}
				throw new Error(m.error_unknown());
			case 400:
				throw new Error(m.error_invalid_user());
			default:
				throw new Error(response.data.msg || m.error_unknown());
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.msg || m.error_network());
		}
		throw error;
	}
};
