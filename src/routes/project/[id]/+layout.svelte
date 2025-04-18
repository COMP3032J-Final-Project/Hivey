<script lang="ts">
	import { MessageCircleMore, History, FolderTree } from 'lucide-svelte';
	import CreateFileDialog from './components/new-file-modal.svelte';
	import CreateFolderDialog from './components/new-folder-modal.svelte';
	import type { File, TreeNode } from '$lib/types/editor';
	import NavMain from './components/sidebar-nav-main.svelte';
	import ChatRoom from './components/chatroom/sidebar-chatroom.svelte';
	import HistoryPanel from './components/sidebar-history.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { setContext } from 'svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { goto } from '$app/navigation';
	import { buildFileTree } from '$lib/utils';
	import type { User, UserAuth } from '$lib/types/auth';
	import { WebSocketClient } from '$lib/api/websocket';
	import { getUserSession } from '$lib/auth';
	import { onMount, onDestroy } from 'svelte';
	import { notification } from '$lib/components/ui/toast';
	import type { Project } from '$lib/types/dashboard';
  import  DragOffsetCalculator from '$lib/components/drag-offset-calculator.svelte';
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { files, setFilesStruct, tempFolders, project, updateProject } from './store.svelte';
  import { localizeHref } from '$lib/paraglide/runtime';
  
  let { data, children } = $props<{
	data: {
	  files: File[];
	  filesStruct: TreeNode[];
	  currentUser: User;
	  authInfo: UserAuth;
	};
	children: any;
  }>();

  const SidebarMode = {
      FileTree: "FileTree",
      ChatRoom: "ChatRoom",
      EditHistory: "pEditHistory"
  };
  let wsClient = $state<WebSocketClient | null>(null);
  setContext('websocket-client', () => wsClient); // 传入一个获取wsClient的函数而不是wsClient本身这样可以保证访问到最新的wsClient值

  let sidebarMode = $state(SidebarMode.FileTree);
  let sidebarResizeOffset = $state({x: 0, y: 0});
  let sidebarWidth = $derived.by(() => {
      const minWidth = 250;
      const maxWidth = 600;
      let initialWidth = 300;
      let curWidth = initialWidth + sidebarResizeOffset.x;
      return curWidth > minWidth ?  (curWidth < maxWidth ? curWidth : maxWidth) : minWidth;
  });
  
	async function initWebSocketClient(userSession: UserAuth, currentUser: User) {
		try {
			wsClient = new WebSocketClient( // 创建WebSocket客户端
					$project.id,
					currentUser,
					userSession
			);
		  // 设置成员进入事件的处理
			wsClient.memberJoinedHandler = (username: string) => {
					if (username !== currentUser.username && username !== 'Unknown') {
						notification(`${username} entered the project.`);
					}
			}

      // 设置项目删除事件的处理
      wsClient.projectDeletedHandler = () => {
        if (wsClient) {
            wsClient.disconnect();
            wsClient = null;
        }
        notification(`Project has been deleted by owner.`);
        goto(localizeHref('/dashboard/repository/projects/all')); // 重定向到项目列表页面
      }

			wsClient.projectUpdateHandler = (data) => {
					if (data.name) {
						updateProject({name: data.name});
					}
			}

			wsClient.fileAddedHandler = (file) => {
				files.update((files) => [ ...files, file ]); // 更新当前文件列表
				setFilesStruct(buildFileTree($files, $tempFolders));
			}

			wsClient.fileDeletedHandler = (fileId) => {
				files.update((files) => files.filter((file) => file.id !== fileId)); // 更新当前文件列表
				setFilesStruct(buildFileTree($files, $tempFolders));
			}

			wsClient.fileRenamedHandler = (data) => {
				files.update((files) => {
					const file = files.find((file) => file.id === data.id);
					if (file) {
						file.filename = data.name; // 更新文件名称
					}
					return files;
				});
				setFilesStruct(buildFileTree($files, $tempFolders));
			}

			wsClient.fileMoveHandler = (data) => {
				files.update((files) => {
					const file = files.find((file) => file.id === data.id);
					if (file) {
						file.filepath = data.path; // 更新文件父级ID
					}
					return files;
				});
				setFilesStruct(buildFileTree($files, $tempFolders));
			}

			    wsClient.connect(); // 连接到服务器
		  } catch (error) {
			    console.error('Project WebSocket Client init failed:', error);
		  }
	}

	onMount(async () => {
		  const userSession = getUserSession() as UserAuth;
		  await initWebSocketClient(userSession, data.currentUser);
	});

	onDestroy(() => {
		  if (wsClient) {
			    wsClient.disconnect();
			    wsClient = null;
		  }
	});
</script>

<Sidebar.Provider style="--sidebar-width: {String(sidebarWidth) + 'px'};">
	<Sidebar.Root collapsible="offcanvas" variant="inset">
		<Sidebar.Header>
			<div class="w-full flex justify-between pb-1">
        <div class="flex">
          <!-- MOVE TO page.svelte menu `project`  -->
          
          <!-- <ShareProjectDialog -->
          <!--   {projectId} -->
          <!--   currentUser={data.currentUser} -->
          <!--   project={data.project} -->
          <!--   iconSize={20} -->
          <!-- /> -->

          {#if sidebarMode === SidebarMode.FileTree}
				    <CreateFileDialog
              projectId={$project.id}
              currentUser={data.currentUser}
              iconSize={20}
            />

				    <CreateFolderDialog
              projectId={$project.id}
              currentUser={data.currentUser}
              iconSize={20}
            />
          {/if}
        </div>
        
        <DropdownMenu.Root>
          <DropdownMenu.Trigger class={buttonVariants({ size: 'icon' })}>
		        {#if sidebarMode === SidebarMode.FileTree }
              <FolderTree />
		        {:else if sidebarMode === SidebarMode.ChatRoom}
					    <MessageCircleMore />
		        {:else}
					    <History />
		        {/if}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Group>
              <DropdownMenu.Item onclick={() => sidebarMode = SidebarMode.FileTree}>File Tree</DropdownMenu.Item>
              <DropdownMenu.Item onclick={() => sidebarMode = SidebarMode.ChatRoom}>Chat Room</DropdownMenu.Item>
              <DropdownMenu.Item onclick={() => sidebarMode = SidebarMode.EditHistory}>Edit History</DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
			</div>
		</Sidebar.Header>

		<Sidebar.Separator />

		{#if sidebarMode === SidebarMode.FileTree }
			<NavMain />
		{:else if sidebarMode === SidebarMode.ChatRoom}
			<ChatRoom projectId={data.projectId} currentUser={data.currentUser} wsClient={wsClient} />
		{:else}
			<HistoryPanel projectId={data.projectId} />
		{/if}
	</Sidebar.Root>

  <!-- Settings an fixed height allow inner element to overflow with scrollbar -->
  <!-- Please see inset's source code to figure out why I use this height -->
	<Sidebar.Inset class="h-[calc(100svh-theme(spacing.4))]">
    <div class="size-full flex relative">
      <DragOffsetCalculator
        class="absolute top-0 left-0 bottom-0 w-2 cursor-ew-resize z-10"
        bind:offset={sidebarResizeOffset}
      />
      <div class="flex-grow size-full overflow-auto">
        {@render children()}
      </div>
    </div>

	</Sidebar.Inset>
</Sidebar.Provider>
