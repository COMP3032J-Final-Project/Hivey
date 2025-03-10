<script lang="ts">
	// 导入
	import * as m from '$lib/paraglide/messages';
	import { Button } from '$lib/components/ui/button/index';
	import { postUserLogin } from '$lib/api/auth';
	import type { LoginForm, UserAuth } from '$lib/types/auth';
	import { goto } from '$app/navigation';
	import { success, failure } from '$lib/components/ui/toast';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	// 表单数据
	let formData: LoginForm = {
		email: '',
		password: ''
	};

	// 记住我选项
	let rememberMe = false;

	// 从注册页面跳转过来时自动填充表单
	onMount(() => {
		const state = $page.state as { email?: string; password?: string };
		if (state && state.email && state.password) {
			formData = {
				email: state.email,
				password: state.password
			};
		}

		// 检查本地存储的登录信息
		const savedUser = localStorage.getItem('rememberedUser');
		if (savedUser && !formData.email) {
			const userData = JSON.parse(savedUser);
			formData.email = userData.email;
			formData.password = userData.password;
			rememberMe = true;
		}
	});

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		try {
			// 前端验证
			if (!/^\S+@\S+\.\S+$/.test(formData.email)) throw new Error(m.error_invalid_email());
			if (!formData.password) throw new Error(m.error_empty_password());

			// 调用登录接口
			const userAuth: UserAuth = await postUserLogin(formData);

			// 记住我功能
			if (rememberMe) {
				localStorage.setItem(
					'rememberedUser',
					JSON.stringify({
						email: formData.email,
						password: formData.password
					})
				);
			} else {
				localStorage.removeItem('rememberedUser');
			}

			// 存储用户Token
			localStorage.setItem('userAuth', JSON.stringify(userAuth));

			success(m.success_sign_in());

			// 延迟跳转到首页
			setTimeout(() => {
				goto('/');
			}, 1500);
		} catch (error) {
			// 直接使用错误消息
			const errorMessage = (error as Error).message;
			failure(errorMessage || m.error_unknown());
		}
	};
</script>

<div class="container mx-auto w-full p-6 text-primary-foreground">
	<h2 class="text-center text-4xl font-bold">{m.sign_in()}</h2>
	<form class="mt-6" on:submit={handleSubmit}>
		<!-- email -->
		<div>
			<label for="email" class="mb-2 block">{m.email()}</label>
			<input
				type="email"
				name="email"
				id="email"
				autocomplete="email"
				class="w-full rounded-md bg-secondary px-3 py-1.5"
				bind:value={formData.email}
				required
			/>
		</div>

		<!-- password -->
		<div class="mt-4">
			<label for="password" class="mb-2 block">{m.password()}</label>
			<input
				type="password"
				name="password"
				id="password"
				autocomplete="current-password"
				class="w-full rounded-md bg-secondary px-3 py-1.5"
				bind:value={formData.password}
				required
			/>
		</div>

        <!-- Remember Me -->
        <div class="form-group form-check mt-4">
            <label class="cursor-pointer label flex items-center gap-2">
                <input 
                    type="checkbox" 
                    name="remember" 
                    class="checkbox bg-secondary"
                    bind:checked={rememberMe}
                >
                <span class="label-text">{ m.remember_me() }</span>
            </label>
        </div>

		<Button type="submit" variant="default" size="lg" class="mt-4 w-full font-semibold">
			{m.sign_in()}
		</Button>

		<div class="mt-4 flex justify-center">
			<a
				href="/auth/signup"
				class="text-primary-foreground/60 underline hover:text-primary-foreground"
				>{m.to_sign_up()}</a
			>
		</div>
	</form>
</div>
