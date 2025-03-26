<script lang="ts">
	import { Folder, File, FolderPlus, MessageSquare } from 'lucide-svelte';
	import CreateFileDialog from '$lib/components/new-file-modal.svelte';
	import CreateFolderDialog from '$lib/components/new-folder-modal.svelte';
	import type { SidebarFolder, SidebarFile } from '$lib/types/editor';
	import NavMain from './components/sidebar-nav-main.svelte';
	import ChatRoom from './components/sidebar-chatroom.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { writable } from 'svelte/store';
	import { Button } from "$lib/components/ui/button/index.js";
	let { data, children } = $props<{
		data: {
			groupName: string;
			folders: SidebarFolder[];
			files: SidebarFile[];
			chatMessages: any[];
			currentUser: any;
		};
		children: any;
	}>();
    console.log("Raw data:", data);
	let groupName = data.groupName;
	let folders = writable<SidebarFolder[]>(data.folders);
	console.log("Raw data.files:", data.files);
	let files = writable<SidebarFile[]>(data.files);
	let showChat = $state(false); // 聊天室的显示状态

	function addNewFolder() {
		console.log('Add new folder');
	}
</script>

<Sidebar.Provider>
	<Sidebar.Root collapsible="offcanvas" variant="inset">
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupLabel class="flex items-center justify-end">
					<div class="flex">
						<CreateFileDialog />
						<CreateFolderDialog />
						<Button
							variant="ghost" size="icon"
							onclick={() => (showChat = !showChat)}
						>
							<MessageSquare size={20} />
						</Button>
					</div>
				</Sidebar.GroupLabel>

				<div class="my-2 border-t dark:border-primary"></div>

				{#if showChat}
					<ChatRoom chatMessages={data.chatMessages} currentUser={data.currentUser} />
				{:else}
					<NavMain folders_tmp={$folders} files_tmp={$files} />
				{/if}
			</Sidebar.Group>
		</Sidebar.Content>
	</Sidebar.Root>

	<Sidebar.Inset>
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
