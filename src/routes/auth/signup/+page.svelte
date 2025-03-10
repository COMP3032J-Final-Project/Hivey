<script lang="ts">
	// 导入
	import * as m from '$lib/paraglide/messages';
	import { Button } from '$lib/components/ui/button/index';
	import { postUserRegister } from '$lib/api/auth';
	import { type RegisterForm } from '$lib/types/auth';
	import { goto } from '$app/navigation';
	// 导入自定义toast函数
	import { success, failure } from '$lib/components/ui/toast';

	let formData: RegisterForm = {
		username: '',
		email: '',
		password: '',
		confirm_password: ''
	};

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		try {
			// 前端验证
			if (!formData.username.trim()) throw new Error('EMPTY_USERNAME');
			if (!/^\S+@\S+\.\S+$/.test(formData.email)) throw new Error('INVALID_EMAIL');
			if (formData.password.length < 6) throw new Error('WEAK_PASSWORD');
			if (formData.password !== formData.confirm_password)
				throw new Error('PASSWORD_MISMATCH');

			// 调用注册接口
			const user = await postUserRegister(formData);

			// 注册成功处理
			success('🎉 注册成功！正在跳转...');
			setTimeout(() => {
				// 带着用户信息跳转到登录页并自动填充用户邮箱和密码
				goto(`/auth/signin`,{
					state: {
						email: formData.email,
						password: formData.password
					}
				});

			}, 2000);
		} catch (error) {
			// 错误处理逻辑
			const messageMap: { [key: string]: string } = {
				USER_EXISTS: m.error_user_exists(),
				PASSWORD_MISMATCH: m.error_password_mismatch(),
				EMPTY_USERNAME: m.error_empty_username(),
				INVALID_EMAIL: m.error_invalid_email(),
				WEAK_PASSWORD: m.error_weak_password(),
				NETWORK_ERROR: m.error_network(),
				UNKNOWN_ERROR: m.error_unknown()
			};
			const errorMessage = (error as { message: string }).message;

			failure(messageMap[errorMessage] || m.error_unknown());
		}
	};
</script>

<div class="container mx-auto w-full p-6 text-primary-foreground">
	<h2 class="text-center text-4xl font-bold">{m.sign_up()}</h2>
	<form class="mt-6" on:submit={handleSubmit}>
		<!-- 用户名 -->
		<div>
			<label for="name" class="mb-2 block">{m.name()}</label>
			<input
				type="text"
				name="name"
				id="name"
				autocomplete="name"
				class="w-full rounded-md bg-secondary px-3 py-1.5"
				bind:value={formData.username}
			/>
		</div>

		<!-- 邮箱 -->
		<div class="mt-4">
			<label for="email" class="mb-2 block">{m.email()}</label>
			<input
				type="email"
				name="email"
				id="email"
				autocomplete="email"
				class="w-full rounded-md bg-secondary px-3 py-1.5"
				bind:value={formData.email}
			/>
		</div>

		<!-- 密码 -->
		<div class="mt-4">
			<label for="password" class="mb-2 block">{m.password()}</label>
			<input
				type="password"
				name="password"
				id="password"
				autocomplete="new-password"
				class="w-full rounded-md bg-secondary px-3 py-1.5"
				bind:value={formData.password}
			/>
		</div>

		<!-- 确认密码 -->
		<div class="mt-4">
			<label for="confirm-password" class="mb-2 block">{m.confirm_password()}</label>
			{#if formData.confirm_password && formData.password !== formData.confirm_password}
				<div class="mt-1 text-sm text-red-500">
					{m.error_password_mismatch()}
				</div>
			{/if}

			<input
				type="password"
				name="confirm-password"
				id="confirm-password"
				autocomplete="new-password"
				class="w-full rounded-md bg-secondary px-3 py-1.5"
				bind:value={formData.confirm_password}
			/>
		</div>

		<Button type="submit" size="lg" class="mt-4 w-full font-semibold">
			{m.sign_up()}
		</Button>
		<div class="mt-4 flex justify-center">
			<a
				href="/auth/signin"
				class="text-primary-foreground/60 underline hover:text-primary-foreground"
			>
				{m.to_sign_in()}
			</a>
		</div>
	</form>
</div>
