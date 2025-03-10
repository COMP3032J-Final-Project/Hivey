<script lang="ts">
	// 导入
	import * as m from '$lib/paraglide/messages';
	import { Button } from '$lib/components/ui/button/index';
	import { postUserRegister } from '$lib/api/auth';
	import { type RegisterForm, type UserInfo } from '$lib/types/auth';
	import { goto } from '$app/navigation';
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
			if (!formData.username.trim()) throw new Error(m.error_empty_username());
			if (!/^\S+@\S+\.\S+$/.test(formData.email)) throw new Error(m.error_invalid_email());
			if (formData.password.length < 6) throw new Error(m.error_weak_password());
			if (formData.password !== formData.confirm_password)
				throw new Error(m.error_password_mismatch());

			// 调用注册接口
			const userInfo: UserInfo = await postUserRegister(formData);

			// 注册成功处理
			success(m.success_sign_up());
			setTimeout(() => {
				// 带着用户信息跳转到登录页并自动填充用户邮箱和密码
				goto(`/auth/signin`, {
					state: {
						email: formData.email,
						password: formData.password
					}
				});
			}, 2000);
		} catch (error) {
			// 直接使用错误消息
			const errorMessage = (error as Error).message;
			failure(errorMessage || m.error_unknown());
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
