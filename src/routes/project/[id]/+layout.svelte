<script lang="ts">
  import { MessageCircleMore, History, FolderTree } from 'lucide-svelte';
  import CreateFileDialog from './components/new-file-modal.svelte';
  import CreateFolderDialog from './components/new-folder-modal.svelte';
  import type { File, TreeNode } from '$lib/types/editor';
  import NavMain from './components/sidebar-nav-main.svelte';
  import ChatRoom from './components/chatroom/sidebar-chatroom.svelte';
  import HistoryPanel from './components/history/sidebar-history.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { setContext } from 'svelte';
  import { buttonVariants } from '$lib/components/ui/button/index.js';
  import { goto } from '$app/navigation';
  import type { User, UserAuth } from '$lib/types/auth';
  import { getUserSession } from '$lib/auth';
  import { onMount, onDestroy } from 'svelte';
  import { notification } from '$lib/components/ui/toast';
  import  DragOffsetCalculator from '$lib/components/drag-offset-calculator.svelte';
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { localizeHref } from '$lib/paraglide/runtime';
  import { buildFileTree, sleep } from '$lib/utils';
  import { getUserInfoById } from '$lib/api/auth';
  import { getFiles } from '$lib/api/editor';
  import { WebSocketClient } from '$lib/api/websocket';
  import { WSResponse } from '$lib/types/websocket';
  import { HistoryAction, type HistoryMessage } from '$lib/types/editor';
  import { initializeProject, getProjectInitializationStatus } from '$lib/api/project';
  import {
      files, tempFolders, project, updateProject, setOnlineMembers, removeOnlineMember,
      setFilesStruct, setFiles, compiledPdfPreviewUrl, addHistoryMessage, members
  } from './store.svelte';
  
  
  let { data, children } = $props<{
      data: {
          project_id: string,
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

  let dataProcessed: boolean = $state(false);
  let websocketConnected = $state(false);
  let backendProjectInitializeStatus: string | undefined = $state(undefined);
  const finishLoading = $derived(
      dataProcessed && websocketConnected && backendProjectInitializeStatus == "success"
  );
  
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
          wsClient.memberJoinedHandler = (onlineMembers: User[]) => {
              console.log("onlineMembers:", onlineMembers);
              setOnlineMembers(onlineMembers);
          }
      
          // 设置成员离开事件的处理
          wsClient.memberLeftHandler = (username: string) => {
              removeOnlineMember(username);
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

          wsClient.projectUpdateHandler = async (response: WSResponse) => {
            const timestamp: Date = new Date();
            if (response.payload.name) {
              updateProject({name: response.payload.name});
            }
            const user_id = response.client_id
            let user = $members.find((member) => member.user_id === user_id);
            if (!user){
              user = await getUserInfoById(user_id);
            }
            const historyMessage: HistoryMessage = {
              action: HistoryAction.UPDATE_NAME,
              project_id: $project.id,
              user: user,
              file_id: null,
              state_before: null,
              state_after: { name: response.payload.name },
              timestamp: timestamp,
            }
            addHistoryMessage(historyMessage);
          }

          wsClient.fileAddedHandler = async (response: WSResponse) => {
            const timestamp: Date = new Date();
            // 更新当前文件列表
            files.update((files) => [ ...files, response.payload ]); 
            setFilesStruct(buildFileTree($files, $tempFolders));

            // 添加历史记录
            const user_id = response.client_id
            let user = $members.find((member) => member.user_id === user_id);
            if (!user){
              user = await getUserInfoById(user_id);
            }
            const historyMessage: HistoryMessage = {
              action: HistoryAction.ADDED,
              project_id: $project.id,
              user: user,
              file_id: response.payload.id,
              state_before: null,
              state_after: {
                filename: response.payload.filename,
                filepath: response.payload.filepath,
              },
              timestamp: timestamp,
            }
            addHistoryMessage(historyMessage);
          }

          wsClient.fileDeletedHandler = async (response: WSResponse) => {
            const user_id = response.client_id
            let user = $members.find((member) => member.user_id === user_id);
            if (!user){
              user = await getUserInfoById(user_id);
            }
            const fileIdList: string[] = response.payload;  
            files.update((files) => {
              files.forEach((file) => {
                const timestamp: Date = new Date();
                if (fileIdList.includes(file.id)) {
                  // 添加历史记录
                  const historyMessage: HistoryMessage = {
                    action: HistoryAction.DELETED,
                    project_id: $project.id,
                    user: user,
                    file_id: file.id,
                    state_before: {
                      filename: file.filename,
                      filepath: file.filepath,
                    },
                    state_after: null,
                    timestamp: timestamp,
                  }
                  addHistoryMessage(historyMessage);
                }
              });
              // 更新当前文件
              return files.filter((file) => !fileIdList.includes(file.id));
            });
            setFilesStruct(buildFileTree($files, $tempFolders));
          }

          wsClient.fileRenamedHandler = async (response: WSResponse) => {
            const timestamp: Date = new Date();
            const user_id = response.client_id
            let user = $members.find((member) => member.user_id === user_id);
            if (!user){
              user = await getUserInfoById(user_id);
            }
            files.update((files) => {
                const file = files.find((file) => file.id === response.payload.id);
                if (file) {
                    // 添加历史记录
                    const historyMessage: HistoryMessage = {
                      action: HistoryAction.RENAMED,
                      project_id: $project.id,
                      user: user,
                      file_id: response.payload.id,
                      state_before: { 
                        filename: file.filename,
                        filepath: file.filepath,
                      },
                      state_after: {
                        filename: response.payload.filename,
                        filepath: response.payload.filepath,
                      },
                      timestamp: timestamp,
                    }
                    addHistoryMessage(historyMessage);
                    file.filename = response.payload.filename; // 更新文件名称
                    file.filepath = response.payload.filepath; // 更新文件路径(应对移动+重命名的情况)
                }
                return files;
            });
            setFilesStruct(buildFileTree($files, $tempFolders));
          }

          wsClient.fileMoveHandler = async (response: WSResponse) => {
            const timestamp: Date = new Date();
            const user_id = response.client_id
            let user = $members.find((member) => member.user_id === user_id);
            if (!user){
              user = await getUserInfoById(user_id);
            }
            files.update((files) => {
                const file = files.find((file) => file.id === response.payload.id);
                if (file) {
                    // 添加历史记录
                    const historyMessage: HistoryMessage = {
                      action: HistoryAction.MOVED,
                      project_id: $project.id,
                      user: user,
                      file_id: response.payload.id,
                      state_before: { 
                        filename: file.filename,
                        filepath: file.filepath,
                      },
                      state_after: {
                        filename: response.payload.filename,
                        filepath: response.payload.filepath,
                      },
                      timestamp: timestamp,
                    }
                    addHistoryMessage(historyMessage);
                    file.filepath = response.payload.filepath; // 更新文件父级ID
                    file.filename = response.payload.filename; // 更新文件名称(应对移动+重命名的情况)
                }
                return files;
            });
            setFilesStruct(buildFileTree($files, $tempFolders));
          }

          wsClient.projectCompiledPdfHanlder = (url) => {
              compiledPdfPreviewUrl.set(url);
          }

          wsClient.connect(); // 连接到服务器
          
          websocketConnected = true;
      } catch (error) {
          console.error('Project WebSocket Client init failed:', error);
      }
  }

  async function processInitialData() {
      const filesdata: File[] = await getFiles(data.project_id);
      const filesStruct: TreeNode[] = buildFileTree(filesdata, []);

      setFiles(filesdata);
      setFilesStruct(filesStruct);
      dataProcessed = true;
  }

  onMount(async () => {
      const userSession = getUserSession() as UserAuth;
      processInitialData();
      initializeProject(data.project_id).then(async () => {
          let status = await getProjectInitializationStatus(data.project_id);
          while (status == null) {
              await sleep(100);
              status = await getProjectInitializationStatus(data.project_id);
          }

          backendProjectInitializeStatus = status;
      });
      initWebSocketClient(userSession, data.currentUser);
  });

  onDestroy(() => {
      if (wsClient) {
          wsClient.disconnect();
          wsClient = null;
      }
  });
</script>

{#if !finishLoading}
  <div class="w-screen h-screen flex items-center justify-center">
    <div class="flex items-center gap-4 text-3xl">
      {#if backendProjectInitializeStatus == "failed"}
        <span>Project Initialization Failed</span>
      {:else}
        <div class="inline-block size-10 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"> </div>
        <span>Initializing Project...</span>
      {/if}
    </div>
  </div>
{:else}
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
        <ChatRoom currentUser={data.currentUser} wsClient={wsClient} />
      {:else}
        <HistoryPanel/>
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
  
{/if}

