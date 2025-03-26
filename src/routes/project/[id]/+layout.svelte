<script lang="ts">
	import { MessageSquare } from 'lucide-svelte';
	import CreateFileDialog from '$lib/components/new-file-modal.svelte';
	import CreateFolderDialog from '$lib/components/new-folder-modal.svelte';
	import type { SidebarFolder, SidebarFile, EditorFileType } from '$lib/types/editor';
	import NavMain from './components/sidebar-nav-main.svelte';
	import ChatRoom from './components/sidebar-chatroom.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
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
	let groupName = data.groupName;
	let folders = writable<SidebarFolder[]>(data.folders);
	let files = writable<SidebarFile[]>(data.files);
	let showChat = $state(false); // 聊天室的显示状态

	function addNewFolder() {
		console.log('Add new folder');
	}

	const currentFileType = writable('md');

	setContext<EditorFileType>('editor-context', {
    	currentFileType, // 直接传递 Store 对象
		updateFileType: (type) => currentFileType.set(type)
	});

	currentFileType.subscribe((value) => {
		console.log('[Layout] currentFileType updated to:', value);
	});
</script>

<Sidebar.Provider>
	<Sidebar.Root collapsible="offcanvas" variant="inset">
    <Sidebar.Header>
      <div class="flex pb-1">
			  <CreateFileDialog />
			  <CreateFolderDialog />
			  <Button variant="ghost" size="icon" onclick={() => (showChat = !showChat)} >
				  <MessageSquare size={20} />
			  </Button>
      </div>
    </Sidebar.Header>

    <Sidebar.Separator />

    {#if showChat}
			<ChatRoom chatMessages={data.chatMessages} currentUser={data.currentUser} />
		{:else}
			<NavMain folders_tmp={$folders} files_tmp={$files} />
		{/if}
	</Sidebar.Root>

	<Sidebar.Inset>
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
