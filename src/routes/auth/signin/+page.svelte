<script lang="ts">
	// 导入
    import * as m from '$lib/paraglide/messages';
    import { Button } from "$lib/components/ui/button/index";
    import { postUserLogin } from '$lib/api/auth';
    import type { LoginForm } from '$lib/types/auth';
    import { goto } from '$app/navigation';
    import { SvelteToast, toast } from '@zerodevx/svelte-toast';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

	// 表单数据
	let formData: LoginForm = {
		email: '',
		password: ''
	};

	// 记住我选项
	let rememberMe = false;

	// 成功提示样式
	const successToast = {
		theme: {
			'--toastBackground': 'rgba(76, 175, 80, 0.95)',
			'--toastColor': 'white',
			'--toastBarBackground': '#2E7D32',
			'--toastBorderRadius': '8px',
			'--toastBoxShadow': '0 4px 12px rgba(0, 0, 0, 0.15)',
			'--toastPadding': '12px 16px',
			'--toastWidth': 'auto',
			'--toastMinWidth': '280px',
			'--toastMaxWidth': '320px'
		},
		duration: 1000,
		position: 'top-center'
	};

	// 错误提示样式
	const errorToast = {
		theme: {
			'--toastBackground': 'rgba(244, 67, 54, 0.95)',
			'--toastColor': 'white',
			'--toastBarBackground': '#C62828',
			'--toastBorderRadius': '8px',
			'--toastBoxShadow': '0 4px 12px rgba(0, 0, 0, 0.15)',
			'--toastPadding': '12px 16px',
			'--toastWidth': 'auto',
			'--toastMinWidth': '280px',
			'--toastMaxWidth': '320px'
		},
		duration: 1000,
		position: 'top-center'
	};

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
            if (!/^\S+@\S+\.\S+$/.test(formData.email)) throw new Error('INVALID_EMAIL');
            if (!formData.password) throw new Error('EMPTY_PASSWORD');

            // 调用登录接口
            const user = await postUserLogin(formData);

            // 记住我功能
            if (rememberMe) {
                localStorage.setItem('rememberedUser', JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }));
            } else {
                localStorage.removeItem('rememberedUser');
            }

            // 登录成功处理
            toast.push('🎉 Login successful! Jumping...', successToast);
            
            // 存储用户信息（可以使用更安全的方式如sessionStorage或状态管理）
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // 延迟跳转到首页
            setTimeout(() => {
                goto('/');
            }, 1500);
        } catch (error) {
            // 错误处理逻辑
            const messageMap: { [key: string]: string } = {
                INVALID_EMAIL: m.error_invalid_email(),
                EMPTY_PASSWORD: m.error_empty_password(),
                NETWORK_ERROR: m.error_network(),
                USER_NOT_FOUND: m.error_invalid_user(),
                UNKNOWN_ERROR: m.error_unknown()
            };
            const errorMessage = (error as { message: string }).message;
            
            toast.push(messageMap[errorMessage] || m.error_unknown(), errorToast);
        }
    };
</script>

<div class="container mx-auto p-6 w-full text-primary-foreground">
    <h2 class="text-4xl font-bold text-center">{ m.sign_in() }</h2>
    <form class="mt-6" on:submit={handleSubmit}>
        <!-- email -->
        <div>
            <label for="email" class="block mb-2">{ m.email() }</label>
            <input 
                type="email" 
                name="email" 
                id="email" 
                autocomplete="email"
                class="w-full rounded-md bg-secondary px-3 py-1.5"
                bind:value={formData.email}
                required
            >
        </div>

        <!-- password -->
        <div class="mt-4">
            <label for="password" class="block mb-2">{ m.password() }</label>
            <input 
                type="password" 
                name="password" 
                id="password" 
                autocomplete="current-password" 
                class="w-full rounded-md bg-secondary px-3 py-1.5"
                bind:value={formData.password}
                required
            >
        </div>

        <!-- Remeber Me -->
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
            { m.sign_in() }
        </Button>

        <div class="mt-4 flex justify-center">
            <a href="/auth/signup" class="text-primary-foreground/60 hover:text-primary-foreground underline">{ m.to_sign_up() }</a>
        </div>
    </form>
</div>
