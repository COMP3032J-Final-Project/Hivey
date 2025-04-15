<!-- TODO remember functionality -->
<script lang="ts">
	import { login } from '$lib/api/auth';
  import { saveUserSession } from '$lib/auth';
	import type { LoginForm, UserAuth } from '$lib/types/auth';
	import { goto } from '$app/navigation'
	import { success, failure, failureError } from '$lib/components/ui/toast';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
  import { localizeHref } from '$lib/paraglide/runtime';

  import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { m, me, mpa, mpae } from '$lib/trans';
  import { isAxiosError } from 'axios';

	// 表单数据
	let formData: LoginForm = {
		  email: '',
		  password: ''
	};

	
	let rememberMe = true; // 记住我选项
	let isLoading = false; // 加载状态
	
	onMount(() => { 
      // 从注册页面跳转过来时自动填充表单
		  const state = page.state as { email?: string; password?: string };
		  if (state && state.email && state.password) {
			    formData = {
				      email: state.email,
				      password: state.password
			    };
		  }
	});

	const handleSubmit = async (e: Event) => {
		  e.preventDefault();
		    
		  // 设置加载状态
		  isLoading = true;
		    
		  try {
			    // 前端验证
			    if (!/^\S+@\S+\.\S+$/.test(formData.email)) throw new Error(mpae.invalid_email());
			    if (!formData.password) throw new Error(mpae.empty_password());

			    // 调用登录接口
			    const userAuth: UserAuth = await login(formData);
			      
			    // 使用 Token 管理功能保存 Token
			    saveUserSession(userAuth);

			    success(mpa.success_sign_in());

			    // 延迟跳转到首页
			    setTimeout(() => {
				      goto('/dashboard/repository/projects/all');
			    }, 500);
		  } catch (error) {
          failureError(error);
		  } finally {
			    isLoading = false;
		  }
	};
</script>

<Card.Root class="mx-auto w-full max-w-md">
	<Card.Header>
		<Card.Title>{ m.sign_in() }</Card.Title>
	</Card.Header>
	<Card.Content>
		<form on:submit={handleSubmit} enctype="application/x-www-form-urlencoded">
		  <!-- username (email) -->
		  <div>
        <Label for="email">{m.email()}</Label>
				<Input 
				  id="email"
				  type="email"
				  name="username"
				  autocomplete="email"
          bind:value={formData.email}
				  disabled={isLoading}
				  required
        />
		  </div>

		  <!-- password -->
		  <div class="mt-4">
			  <Label for="password">{m.password()}</Label>
			  <Input
				  id="password"
				  type="password"
				  name="password"
				  autocomplete="current-password"
				  bind:value={formData.password}
				  disabled={isLoading}
				  required
			  />
		  </div>

      <!-- Remember Me -->
      <div class="form-group form-check mt-4">
        <Label
          class="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 peer-data-[disabled=true]:cursor-not-allowed peer-data-[disabled=true]:opacity-70"
        >
          <Checkbox
            name="remember" 
            class="checkbox bg-secondary"
            bind:checked={rememberMe}
            disabled={isLoading}
          />
          <span class="label-text">{ mpa.remember_me() }</span>
        </Label>
      </div>

		  <Button type="submit" class="mt-4 w-full font-semibold" size="lg" disabled={isLoading}>
			  {isLoading ? m.loading() : m.sign_in()}
		  </Button>

		  <div class="mt-4 flex justify-center">
			  <a
				  href={localizeHref("/auth/signup")}
				  class="text-foreground/50 underline hover:text-foreground"
				>{mpa.to_sign_up()}</a>
		  </div>
	  </form>
	</Card.Content>
</Card.Root>
