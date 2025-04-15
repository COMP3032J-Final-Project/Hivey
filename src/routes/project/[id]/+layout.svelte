<script lang="ts">
	import { MessageCircleMore, History, FolderTree } from 'lucide-svelte';
	import CreateFileDialog from '$lib/components/new-file-modal.svelte';
	import CreateFolderDialog from '$lib/components/new-folder-modal.svelte';
	import ShareProjectDialog from './components/share-project2template-modal.svelte';
	import type { EditorFileInfo, FileType, TreeNode } from '$lib/types/editor';
	import NavMain from './components/sidebar-nav-main.svelte';
	import ChatRoom from './components/chatroom/sidebar-chatroom.svelte';
	import HistoryPanel from './components/sidebar-history.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { getFiles, getFileContent, fetchDocData } from '$lib/api/editor';
	import { goto } from '$app/navigation';
	import { buildFileTree } from '$lib/utils';
	import type { User, UserAuth } from '$lib/types/auth';
	import { WebSocketClient } from '$lib/api/websocket';
	import { getUserSession } from '$lib/auth';
	import { onMount, onDestroy } from 'svelte';
	import { notification } from '$lib/components/ui/toast';
	import type { Project } from '$lib/types/dashboard';
  import  DragOffsetCalculator from '$lib/components/drag-offset-calculator.svelte';
	import { getProjectMember } from '$lib/api/project';
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

	let { data, children } = $props<{
		  data: {
			    files: FileType[];
			    filesStruct: TreeNode[];
			    currentUser: User;
			    projectId: string;
			    project: Project;
			    authInfo: UserAuth;
		  };
		  children: any;
	}>();
	let projectId = data.projectId;
	let showChat = $state(false);
	let showHistory = $state(false);
	let wsClient = $state<WebSocketClient | null>(null);
	let project = $state<Project>(data.project);
  const SidebarMode = {
      FileTree: "FileTree",
      ChatRoom: "ChatRoom",
      EditHistory: "pEditHistory"
  };

  let sidebarMode = $state(SidebarMode.FileTree)

	const currentFiles = writable<FileType[]>(data.files);
	const currentFilesStruct = writable<TreeNode[]>(data.filesStruct);
	const currentFileId = writable('');
	const currentFileName = writable('');
	const currentFileType = writable('Format');
	const docContent = writable('');
	const currentFilePath = writable('');

  let sidebarResizeOffset = $state({x: 0, y: 0});
  let sidebarWidth = $derived.by(() => {
      const minWidth = 250;
      const maxWidth = 600;
      let initialWidth = 300;
      let curWidth = initialWidth + sidebarResizeOffset.x;
      return curWidth > minWidth ?  (curWidth < maxWidth ? curWidth : maxWidth) : minWidth;
  });

  setContext('websocket-client', () => wsClient); // 传入一个获取wsClient的函数而不是wsClient本身这样可以保证访问到最新的wsClient值

	async function initWebSocketClient(userSession: UserAuth, currentUser: User) {
		try {
			wsClient = new WebSocketClient( // 创建WebSocket客户端
					projectId,
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
					goto('/dashboard/repository/projects/all'); // 重定向到项目列表页面
			}

			wsClient.projectUpdateHandler = (data) => {
					if (data.name) {
						project.name = data.name;
					}
			}

			wsClient.fileAddedHandler = (file) => {
				currentFiles.update((files) => [ ...files, file ]); // 更新当前文件列表
				currentFilesStruct.set(buildFileTree($currentFiles));
			}

			wsClient.fileDeletedHandler = (fileId) => {
				currentFiles.update((files) => files.filter((file) => file.id !== fileId)); // 更新当前文件列表
				currentFilesStruct.set(buildFileTree($currentFiles));
			}

			wsClient.fileRenamedHandler = (data) => {
				currentFiles.update((files) => {
					const file = files.find((file) => file.id === data.id);
					if (file) {
						file.filename = data.name; // 更新文件名称
					}
					return files;
				});
				currentFilesStruct.set(buildFileTree($currentFiles));
			}

			wsClient.fileMoveHandler = (data) => {
				currentFiles.update((files) => {
					const file = files.find((file) => file.id === data.id);
					if (file) {
						file.filepath = data.path; // 更新文件父级ID
					}
					return files;
				});
				currentFilesStruct.set(buildFileTree($currentFiles));
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

	setContext<EditorFileInfo>('editor-context', {
		  currentFileId,
		  updateFileId: (id) => currentFileId.set(id),
		  currentFileName,
		  updateFileName: (name) => currentFileName.set(name),
		  currentFileType,
		  updateFileType: (type) => currentFileType.set(type),
		  docContent,
		  updateContent: (content) => docContent.set(content),
		  currentFilePath,
		  loadFile: async (fileId, fileName) => {
			    try {
				      console.log('Loading file:', fileName);
				      docContent.set('Loading content...');
				      const fileType = fileName.split('.').pop() || 'md';
				      currentFileType.set(fileType);
				      currentFileName.set(fileName);
				      currentFilePath.set('1');
				      const content = await getFileContent(projectId, fileId);
				      const fileData = await fetchDocData(fileType, content.url);
				      docContent.set(fileData);
				      return true;
			    } catch (error) {
				      console.error('Failed to load file:', error);
				      return false;
			    }
		  },
		  currentFiles,
		  updateFiles: (newFiles: FileType[]) => currentFiles.set(newFiles),
		  currentFilesStruct,
		  updateFilesStruct: (newFilesStruct: TreeNode[]) => currentFilesStruct.set(newFilesStruct),
		  reloadFiles: async (project_Id: string) => {
			    try {
				      const files = await getFiles(project_Id);
				      console.log('[Layout] Files structure reloaded:', buildFileTree(files));
				      currentFiles.set(files);
				      currentFilesStruct.set(buildFileTree(files));
			    } catch (error) {
				      console.error('Failed to reload files:', error);
			    }
			    return false;
		  }
	});
	currentFiles.subscribe((value) => {
		  console.log('[Layout] currentFiles update to:', value);
	});
	currentFilesStruct.subscribe((value) => {
		  console.log('[Layout] currentFilesStruct update to:', value);
	});
	currentFileType.subscribe((value) => {
		  console.log('[Layout] currentFileType updated to:', value);
	});
	docContent.subscribe((value) => {
		  console.log('[Layout] File content set to:', value);
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
              {projectId}
              currentUser={data.currentUser}
              iconSize={20}
            />

				    <CreateFolderDialog
              {projectId}
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
