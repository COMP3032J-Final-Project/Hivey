<script lang="ts">
  import type { ChatMessage as ChatMessageType } from '$lib/types/editor';
	import { writable, get } from 'svelte/store';
	import { Send } from 'lucide-svelte';
	import ChatMessage from './chat-message.svelte'
  import { mpp, mpa } from '$lib/trans';
	import { User, UserAuth } from '$lib/types/auth';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { getHistoryChatMessages } from '$lib/api/project';
  import { onMount, onDestroy } from 'svelte';
  import { failure } from '$lib/components/ui/toast';
  import { getUserSession, isSessionExpired } from '$lib/auth';
  import { ArrowUp } from 'lucide-svelte';
  import { ChatWebSocketClient } from '$lib/api/websocket';
  import { goto } from '$app/navigation';

  // 接收从Layout传入的props
	let  { currentUser, projectId}: {
      currentUser: User;
      projectId: string;
  } = $props();
  
  let wsClient: ChatWebSocketClient | null = null;
  let messagesList = $state<ChatMessageType[]>([]);
  let input = $state(''); // 新消息内容
  let isLoading = $state(false);
  let isLoadingMore = $state(false);
  let hasMoreMessages = $state(false); // 是否有更多历史消息
  let lastMessageTimestamp = $state<Date>(new Date()); // 最早消息的时间戳
 
  onMount(async () => {  // 当组件挂载后加载历史消息并连接WebSocket
    if (isSessionExpired()) { 
      failure(mpa.session_expired());
      goto('/auth/login');
      return;
    }
    const userSession = getUserSession() as UserAuth;
    await connectWebSocket(userSession, currentUser); // 创建WebSocket连接
    console.log('onMount', "projectId", projectId, "currentUser", currentUser, "userSession", userSession);
  });
  
  onDestroy(() => { 
    disconnectWebSocket(); // 组件销毁时断开WebSocket连接
  });
 
  async function connectWebSocket(userSession: UserAuth, currentUser: User) {  // 连接WebSocket
    isLoading = true;
    try {
      const result = await getHistoryChatMessages({ // result.code, result.messages
        projectId: projectId,
        max_num: 20,
        last_timestamp: lastMessageTimestamp  // 获取当前时间前的20条消息或指定时间前的消息
      });

      if (result.messages && result.messages.length > 0) { 
        // 按时间戳从旧到新排序消息
        const sortedMessages = [...result.messages].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        lastMessageTimestamp = new Date(sortedMessages[0].timestamp); // 更新最早消息的时间戳 
        messagesList = sortedMessages;
      } 
      hasMoreMessages = result.code === 200; // 根据状态码确定是否还有更多消息

      // 创建WebSocket客户端
      wsClient = new ChatWebSocketClient(projectId, currentUser, userSession, messagesList);
      
      // 订阅wsClient的消息更新
      wsClient.messages.subscribe(messages => {
        messagesList = messages;
      });
      
      wsClient.connect(); // 连接到服务器
    } catch (error) {
      console.error('WebSocket初始化失败:', error);
    } finally {
      isLoading = false;
    }
  }
  
  function disconnectWebSocket() { // 断开WebSocket连接
    if (wsClient) {
      wsClient.disconnect();
      wsClient = null;
      console.log('WebSocket连接已断开');
    }
  }
  
  async function loadMoreMessages() {
    if (isLoadingMore || !hasMoreMessages) return; // 如果正在加载更多消息, 或者已经没有更多消息可供加载, 则返回
    isLoadingMore = true;
    try {
      const result = await getHistoryChatMessages({ // result.code, result.messages
        projectId: projectId,
        max_num: 20,
        last_timestamp: lastMessageTimestamp || new Date() // 获取当前时间前的10条消息或指定时间前的消息
      });
      if (result.messages && result.messages.length > 0) {
        // 按时间从旧到新排序
        const sortedMessages = [...result.messages].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        lastMessageTimestamp = new Date(sortedMessages[0].timestamp); // 更新最早消息的时间戳     
        if (wsClient) {
          // 先将新消息添加到列表前端，然后整体排序
          wsClient.messages.update(messages => {
            const combinedMessages = [...sortedMessages, ...messages];
            // 确保整个列表按时间从旧到新排序
            return combinedMessages.sort((a, b) => 
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
          });
        }
      } 
      hasMoreMessages = result.code === 200; // 根据状态码确定是否还有更多消息
    } catch (error) {
      console.error('加载更多消息失败:', error);
    } finally {
      isLoadingMore = false;
    }
  }

  function sendMessage() { // 发送消息
		  if (!input.trim()) return;
		  if (!wsClient) { // 验证WebSocket是否连接
        console.log('Chatroom WebSocket未连接');
		    return;
		  }
		  wsClient.sendMessage(input); // 通过WebSocket发送消息
		  input = ''; // 清空输入框
		 
		  setTimeout(() => {
		    scrollToBottom();
		  }, 100);
	}
  
  function scrollToBottom() { // 滚动到底部函数
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  function handleScrollTop(event: Event) { // 监听滚动事件，检测是否滚动到顶部
    const chatContainer = event.target as HTMLElement;
    if (chatContainer.scrollTop <= 5 && hasMoreMessages && !isLoadingMore) { // 如果滚动到顶部，并且有更多消息，并且没有正在加载更多消息，则加载更多消息
      setTimeout(() => {
		    loadMoreMessages();
		  }, 2000);
    }
  }

	function handleKeydown(event: KeyboardEvent) { // 处理Enter键发送消息
		  if (event.key === 'Enter' && !event.shiftKey) {
			    event.preventDefault();
			    sendMessage();
		  }
	}
</script>

<Sidebar.Content>
  <div class="chat-messages flex-auto flex flex-col overflow-y-auto mt-1" onscroll={handleScrollTop}>
    {#if hasMoreMessages}
      <div class="sticky top-0 z-10 flex justify-center py-2 bg-white/80 backdrop-blur-sm">
        {#if isLoadingMore}
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-400"></div>
        {:else}
          <button 
            class="flex items-center gap-1 px-3 py-1 text-xs text-amber-700 hover:text-amber-800 rounded-full bg-amber-100 hover:bg-amber-200"
            onclick={loadMoreMessages}
          >
            <ArrowUp size={12} />
            {mpp.load_more_messages()}
          </button>
        {/if}
      </div>
    {/if}

    {#if isLoading}
      <div class="flex justify-center items-center h-20">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
      </div>
    {:else}
      {#if messagesList.length > 0}
        {#each messagesList as msg}
          <ChatMessage chatMessage={msg} />
        {/each}
      {:else}
        <div class="p-4 text-center text-sm text-gray-500">
          {mpp.no_messages()}
        </div>
      {/if}
    {/if}
  </div>
</Sidebar.Content>

<Sidebar.Footer>
  <div class="flex items-center gap-2">
    <input
      type="text"
      bind:value={input}
      onkeydown={handleKeydown}
      placeholder={mpp.send_chat_message()}
      class="h-9 min-w-0 flex-1 rounded-full border px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
    />
    <button
      class="flex-shrink-0 rounded-full bg-amber-400 p-2 text-white shadow-sm transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={!input.trim() || isLoading}
      onclick={sendMessage}
    >
      <Send size={14} />
    </button>
  </div>
</Sidebar.Footer>

