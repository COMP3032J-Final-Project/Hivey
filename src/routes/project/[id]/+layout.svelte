<script lang="ts">
	import { Folder, File, FolderPlus, MessageSquare } from 'lucide-svelte';
	import CreateFileDialog from '$lib/components/new-file-modal.svelte';
	import CreateFolderDialog from '$lib/components/new-folder-modal.svelte';
	import type { SidebarFolder } from '$lib/types/editor';
	import NavMain from './components/sidebar-nav-main.svelte';
	import ChatRoom from './components/sidebar-chatroom.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { writable } from 'svelte/store';

	let { data, children } = $props<{
		data: {
			groupName: string;
			folders: SidebarFolder[];
			chatMessages: any[];
			currentUser: any;
		};
		children: any;
	}>();
    
	let groupName = data.groupName;
	let folders = writable<SidebarFolder[]>(data.folders);
	let showChat = $state(false); // 聊天室的显示状态

	function addNewFolder() {
		console.log('Add new folder');
	}
</script>

<Sidebar.Provider>
	<Sidebar.Root collapsible="icon" variant="inset">
		<Sidebar.Content>
			<!-- 头部组件 -->
			<Sidebar.Group>
				<Sidebar.GroupLabel class="flex items-center justify-between">
					{groupName}
					<div class="flex space-x-2">
						<!-- 创建文件对话框 -->
						<CreateFileDialog />

						<!-- 消息按钮 -->
						<button
							class="hover:text-primary {showChat ? 'text-primary' : ''}"
							onclick={() => (showChat = !showChat)}
						>
							<MessageSquare size={20} />
						</button>

						<!-- 添加文件夹按钮 -->
						<CreateFolderDialog />
					</div>
				</Sidebar.GroupLabel>

				<!-- GroupLabel和Menu的分割线 -->
				<div class="my-2 border-t border-gray-200 dark:border-gray-700"></div>

				<!-- 根据showChat状态切换显示导航菜单或聊天室 -->
				{#if showChat}
					<ChatRoom chatMessages={data.chatMessages} currentUser={data.currentUser} />
				{:else}
					<NavMain items={$folders} />
				{/if}
			</Sidebar.Group>
		</Sidebar.Content>
		<Sidebar.Rail />
	</Sidebar.Root>

	<Sidebar.Inset>
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
