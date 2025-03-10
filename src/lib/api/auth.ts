import axios from 'axios';
import type { APIResponse } from '$lib/types/public';
import type { User, RegisterForm, LoginForm } from '$lib/types/auth';

const ip_address = '127.0.0.1'; // 开发环境下的 IP 地址, 部署时请修改
const port = '8080';
const mock_ip_adreess = 'http://127.0.0.1:4523/m1/5914609-5601613-default/auth/register/';

// 注册新用户
export const postUserRegister = async (form: RegisterForm): Promise<User> => {
	try {
		const response = await axios.post<APIResponse<User>>(ip_address, form);
		// 此处抛出的异常类型太多了, 不利于维护, 建议根据code是否等于200进行判断, 如果不是200则抛出异常消息
		switch (response.data.code) {
			case 200:
				if (response.data.data) {
					return response.data.data;
				}
				throw new Error('UNKNOWN_ERROR');
			case 409:
				throw new Error('USER_EXISTS');
			default:
				throw new Error(response.data.msg || 'UNKNOWN_ERROR');
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.msg || 'NETWORK_ERROR');
		}
		throw error;
	}
};

// 用户登录
export const postUserLogin = async (form: LoginForm): Promise<User> => {
	try {
		const response = await axios.post<APIResponse<User>>(
			`http://${ip_address}:${port}/auth/login`,
			form
		);

		switch (response.data.code) {
			case 200:
				if (response.data.data) {
					return response.data.data;
				}
				throw new Error('UNKNOWN_ERROR');
			case 400:
				throw new Error('USER_NOT_FOUND');
			default:
				throw new Error(response.data.msg || 'UNKNOWN_ERROR');
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.msg || 'NETWORK_ERROR');
		}
		throw error;
	}
};
