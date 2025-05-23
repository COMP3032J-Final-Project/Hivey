<script lang="ts">
	import { putUserInfo, uploadUserAvatar } from '$lib/api/auth';
	import { success, failure } from '$lib/components/ui/toast';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Input from '$lib/components/ui/input/index.js';
	import * as Button from '$lib/components/ui/button/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Textarea from '$lib/components/ui/textarea/index.js';
  import { m, me, mpd } from '$lib/trans';
	import { onMount } from 'svelte';
	import { updateNav, dialogOpen, dialogCategory } from '../store.svelte';
	import NewProjectDialog from '../repository/[type]/[category]/components/alert-dialog.svelte';
	import type { CreateProjectForm } from '$lib/types/dashboard';
	import { user, updateUser } from '../store.svelte';

	// 页面加载时更新导航状态
	onMount(() => {
		updateNav('Profile', '');
	});

	// 表单数据
	let formData = $state({
		  username: $user.username || '',
		  email: $user.email || '',
      bio: 'Hivey makes my document collaboration so easy!'
	});

	let isSubmitting = $state(false); // 表单提交状态
	let fileInput: HTMLInputElement; // 文件输入引用

	// 表单提交处理
	async function handleSubmit(event: SubmitEvent) {
      event.preventDefault();
      
		  isSubmitting = true;
		  try {
			    if (!formData.username.trim()) throw new Error('Username cannot be empty'); // 验证表单
			    if (!formData.email.trim()) throw new Error('Email cannot be empty');
			    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			    if (!emailRegex.test(formData.email)) throw new Error('Invalid email'); // 验证邮箱格式

			    // 调用API更新用户信息
			    const updatedUser = await putUserInfo(formData.username, formData.email);

			    // 更新表单数据
			    formData.username = updatedUser.username;
			    formData.email = updatedUser.email;

          // 更新全局用户状态
          updateUser({
              username: formData.username,
              email: formData.email,
          });

			    // 显示成功消息
			    success(mpd.success_profile_update());
		  } catch (error) {
			    // 显示错误消息
			    failure(error instanceof Error ? error.message : me.unknown());
		  } finally {
			    isSubmitting = false;
		  }
	}

	// 处理头像文件上传
	async function handleAvatarUpload(event: Event) {
		  const target = event.target as HTMLInputElement;
		  if (!target.files || target.files.length === 0) return;

		  const file = target.files[0];
		  if (!file.type.startsWith('image/')) {
			    failure('File Type Error!');
			    return;
		  }

		  try {
			    isSubmitting = true;
			    const avatarUrl = await uploadUserAvatar(file);
			    updateUser({
              avatar_url: avatarUrl
          });
		  } catch (error) {
			    failure(error instanceof Error ? error.message : me.unknown());
			    
			    // 上传失败时回退到本地预览
			    const reader = new FileReader();
			    reader.onload = (e) => {
				      if (e.target?.result) {
                updateUser({
                  avatar_url: e.target.result as string
                });
				      }
			    };
			    reader.readAsDataURL(file);
		  } finally {
			    isSubmitting = false;
			    target.value = ''; // 清空文件输入以便再次选择同一文件
		  }
	}

	// 随机生成新头像
	async function generateNewAvatar() {
		  try {
			    isSubmitting = true;
			    const seed = Math.random().toString(36).substring(2, 8);
			    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
			    
			    // 从URL获取图像数据
			    const response = await fetch(avatarUrl);
			    const blob = await response.blob();
			    const file = new File([blob], `avatar-${seed}.svg`, { type: 'image/svg+xml' });
			    
			    // 上传到服务器
			    const updatedAvatarUrl = await uploadUserAvatar(file);
			    updateUser({
              avatar_url: updatedAvatarUrl
            });
		  } catch (error) {
			    failure(error instanceof Error ? error.message : me.unknown());
			    const seed = Math.random().toString(36).substring(2, 8);
			    updateUser({
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
            });
		  } finally {
			    isSubmitting = false;
		  }
	}

</script>

<div class="container mx-auto px-4 py-4">
  <!-- 项目创建对话框 -->
	<NewProjectDialog
    bind:open={$dialogOpen}
    category={$dialogCategory}
    onSubmit={
      async (form: CreateProjectForm) => {
        const project = await (form);
        return project;
      }
    }
  />

	<h1 class="mb-4 text-xl font-bold">{mpd.profile()}</h1>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		<!-- 头像和个性签名 -->
		<div class="flex flex-col md:col-span-1">
			<div class="flex h-full flex-col space-y-4">
				<!-- 头像卡片 -->
				<Card.Root
					class="flex-1 overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg"
				>
					<Card.Header class="p-3">
						<Card.Title class="text-center text-base">{m.avatar()}</Card.Title>
					</Card.Header>
					<Card.Content class="flex flex-col items-center p-3">
						<div
							class="relative mb-3 rounded-full border-2 border-primary/10 p-1 shadow-md"
						>
							<Avatar.Root class="h-24 w-24 rounded-full">
								{#if $user.avatar_url}
									<Avatar.Image
										src={$user.avatar_url}
										alt={$user.username}
										class="rounded-full"
									/>
								{/if}
								<Avatar.Fallback class="rounded-full text-xl">
									{$user.username
										? $user.username.substring(0, 2).toUpperCase()
										: 'CN'}
								</Avatar.Fallback>
							</Avatar.Root>
						</div>

						<div class="grid w-full grid-cols-2 gap-2">
							<Button.Root
								variant="outline"
								class="w-full py-1 text-xs"
								onclick={generateNewAvatar}
								disabled={isSubmitting}
							>
								{mpd.generate_new_avatar()}
							</Button.Root>

							<Button.Root
								variant="outline"
								class="w-full py-1 text-xs"
								onclick={() => {
				          fileInput.click()
								}}
								disabled={isSubmitting}
							>
								{isSubmitting ? m.loading() : mpd.upload_local_image()}
							</Button.Root>

							<input
								type="file"
								accept="image/*"
								class="hidden"
								bind:this={fileInput}
								onchange={handleAvatarUpload}
							/>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- 个性签名卡片 -->
				<Card.Root
					class="flex-1 overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg"
				>
					<Card.Header class="p-3">
						<Card.Title class="text-center text-base">{mpd.bio()}</Card.Title>
						<Card.Description class="text-center text-xs"
						>{mpd.bio_description()}</Card.Description
						>
					</Card.Header>
					<Card.Content class="p-3">
						<Textarea.Root
							placeholder="Write something about yourself..."
							class="min-h-[80px] resize-none text-sm"
							bind:value={formData.bio}
							disabled={isSubmitting}
						/>
					</Card.Content>
				</Card.Root>
			</div>
		</div>

		<!-- 右侧：个人信息表单 -->
		<div class="md:col-span-2">
			<Card.Root
				class="flex h-full flex-col shadow-md transition-shadow duration-300 hover:shadow-lg"
			>
				<Card.Header class="p-3">
					<Card.Title class="text-center text-base">{mpd.personal_information()}</Card.Title
					>
					<Card.Description class="text-center text-xs"
					>{mpd.personal_information_description()}</Card.Description
					>
				</Card.Header>
				<Card.Content class="flex flex-1 flex-col p-3">
					<form onsubmit={handleSubmit} class="flex flex-1 flex-col">
						<div class="space-y-4">
							<div class="space-y-1">
								<label for="username" class="text-xs font-medium"
								>{m.username()}</label
								>
								<Input.Root
									id="username"
									bind:value={formData.username}
									disabled={isSubmitting}
									class="h-8 text-sm transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50"
								/>
							</div>

							<div class="space-y-1">
								<label for="email" class="text-xs font-medium">{m.email()}</label>
								<Input.Root
									id="email"
									type="email"
									bind:value={formData.email}
									disabled={isSubmitting}
									class="h-8 text-sm transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50"
								/>
							</div>
						</div>

						<div class="mt-auto flex justify-center pt-4">
							<Button.Root
								type="submit"
								disabled={isSubmitting}
								class="bg-primary px-6 py-1.5 text-sm transition-colors hover:bg-primary/90"
							>
								{isSubmitting ? m.loading() : mpd.save_changes()}
							</Button.Root>
						</div>
					</form>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
