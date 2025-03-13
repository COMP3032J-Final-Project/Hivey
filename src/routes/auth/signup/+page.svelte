<script lang="ts">
	  import * as m from '$lib/paraglide/messages';
	  import { postUserRegister } from '$lib/api/auth';
	  import { type RegisterForm, type UserInfo } from '$lib/types/auth';
	  import { goto } from '$app/navigation';
	  import { success, failure } from '$lib/components/ui/toast';

      import { Button } from "$lib/components/ui/button/index.js";
	  import * as Card from "$lib/components/ui/card/index.js";
	  import { Input } from "$lib/components/ui/input/index.js";
	  import { Label } from "$lib/components/ui/label/index.js";

	  let formData = {
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

			      const registerForm: RegisterForm = {
				        username: formData.username,
				        email: formData.email,
				        password: formData.password
			      };

			      // 调用注册接口
			      const userInfo: UserInfo = await postUserRegister(registerForm);

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

<Card.Root class="mx-auto w-full max-w-md">
	  <Card.Header>
		    <Card.Title>{ m.sign_up() }</Card.Title>
	  </Card.Header>
	  <Card.Content>
        <form on:submit={handleSubmit}>
		        <!-- username -->
		        <div>
			          <Label for="name">{m.name()}</Label>
			          <Input
				            id="name"
				            type="text"
				            name="name"
				            autocomplete="name"
				            bind:value={formData.username}
			          />
		        </div>

		        <!-- email -->
		        <div class="mt-4">
			          <Label for="email" class="mb-2 block">{m.email()}</Label>
			          <Input
				            id="email"
				            type="email"
				            name="email"
				            autocomplete="email"
				            bind:value={formData.email}
			          />
		        </div>

		        <!-- password -->
		        <div class="mt-4">
			          <Label for="password" class="mb-2 block">{m.password()}</Label>
			          <Input
				            id="password"
				            type="password"
				            name="password"
				            autocomplete="new-password"
				            bind:value={formData.password}
			          />
		        </div>

		        <!-- confirm password -->
		        <div class="mt-4">
			          <Label for="confirm-password">{m.confirm_password()}</Label>
			          <Input
				            type="password"
				            name="confirm-password"
				            id="confirm-password"
				            autocomplete="new-password"
				            bind:value={formData.confirm_password}
			          />
					  {#if formData.confirm_password && formData.password !== formData.confirm_password}
				            <div class="mt-1 text-red-500">
					              {m.error_password_mismatch()}
				            </div>
			          {/if}
		        </div>

		        <Button type="submit" class="mt-4 w-full font-semibold" size="lg">
			          {m.sign_up()}
		        </Button>
            
		        <div class="mt-4 flex justify-center">
			          <a
				            href="/auth/signin"
				    				class="text-foreground/50 underline hover:text-foreground"
			          >
				            {m.to_sign_in()}
			          </a>
		        </div>
	      </form>
    </Card.Content>
</Card.Root>
