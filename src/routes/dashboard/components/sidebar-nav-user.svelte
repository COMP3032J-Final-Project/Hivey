<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { useSidebar } from '$lib/components/ui/sidebar/index.js';
  import { Settings, ChevronsUpDown, LogOut } from 'lucide-svelte';
  import type { User } from '$lib/types/auth';
  import { goto } from '$app/navigation';
  import { postLogoutUserAuth } from '$lib/api/auth';
  import { failure, success } from '$lib/components/ui/toast';
  import { m, me, mpd } from '$lib/trans';

  let { user }: {
      user: (User & {avatar: string}) | null
  } = $props();
	const sidebar = useSidebar();

    
  // 处理登出
  async function handleLogout() {
      try {
          await postLogoutUserAuth();
          success(m.logout());
          goto('/auth/signin');
      } catch (error) {
          failure(me.error_logout_failed());
      }
  }
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}
					>
						<Avatar.Root class="h-8 w-8 rounded-lg">
							{#if user?.avatar}
								<Avatar.Image src={user.avatar} alt={user.username || ''} />
							{/if}
							<Avatar.Fallback class="rounded-lg">
								{user?.username
									? user.username.substring(0, 2).toUpperCase()
									: 'CN'}
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold"
							>{user?.username || me.user_not_login()}</span
							>
							<span class="truncate text-xs"
							>{user?.email || me.user_not_login()}</span
							>
						</div>
						<ChevronsUpDown class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar.Root class="h-8 w-8 rounded-lg">
							{#if user?.avatar}
								<Avatar.Image src={user.avatar} alt={user.username || ''} />
							{/if}
							<Avatar.Fallback class="rounded-lg">
								{user?.username
									? user.username.substring(0, 2).toUpperCase()
									: 'CN'}
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold"
							>{user?.username || me.user_not_login()}</span
							>
							<span class="truncate text-xs"
							>{user?.email || me.user_not_login()}</span
							>
						</div>
					</div>
				</DropdownMenu.Label>

				<DropdownMenu.Group>
					<DropdownMenu.Item onclick={() => goto('/dashboard/profile')}>
						<Settings />
						{mpd.profile()}
					</DropdownMenu.Item>
					<DropdownMenu.Item onclick={handleLogout}>
						<LogOut />
						{m.logout()}
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
