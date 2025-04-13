<script lang="ts">
	import { MessageSquare, Home, History } from 'lucide-svelte';
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
	import { Button } from '$lib/components/ui/button/index.js';
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

			// 设置项目名称更新事件的处理
			wsClient.projectUpdateHandler = (data) => {
				if (data.name) {
					project.name = data.name;
					notification(`Project name updated to: ${data.name}`);
				}
			}

			wsClient.connect(); // 连接到服务器
			console.log('WebSocket connection state:', wsClient.getState());
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
				if (fileType === 'tex' || fileType === 'md') {
					try {
						const content = await getFileContent(projectId, fileId);
						const fileData = await fetchDocData(content.url);
						docContent.set(fileData);
					} catch (error) {
						console.error('Failed to fetch file content:', error);
						docContent.set('Error loading file content');
					}
				} else if (fileType === 'png') {
					docContent.set('Loading JSON content...');
				} else {
					docContent.set('Unsupported file type');
				}
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
			<div class="flex pb-1">
				<Button
					variant="ghost"
					size="icon"
					onclick={() => goto('/dashboard/repository/projects/all')}
				>
					<Home size={20} />
				</Button>

        <ShareProjectDialog {projectId} currentUser={data.currentUser} project={data.project} />

				<CreateFileDialog {projectId} currentUser={data.currentUser} />

				<CreateFolderDialog {projectId} currentUser={data.currentUser} />
				
				<Button variant="ghost" size="icon" onclick={() => (showChat = !showChat)}>
					<MessageSquare size={20} />
				</Button>

				<Button variant="ghost" size="icon" onclick={() => (showHistory = !showHistory)}>
					<History size={20} />
				</Button>
			</div>
		</Sidebar.Header>

		<Sidebar.Separator />

		{#if showChat}
			<ChatRoom projectId={data.projectId} currentUser={data.currentUser} wsClient={wsClient} />
		{:else if showHistory}
			<HistoryPanel projectId={data.projectId} />
		{:else}
			<NavMain />
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
        {@render children({ wsClient })}
      </div>
    </div>

	</Sidebar.Inset>
</Sidebar.Provider>
