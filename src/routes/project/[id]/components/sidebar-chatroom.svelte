<script lang="ts" module>
  	import type { ChatMessage as ChatMessageType } from '$lib/types/editor';

// 模拟聊天数据
const mockMessages: ChatMessageType[] = [
	  {
		    user: {
			      username: 'Liyan Tao',
			      email: 'liyantao@ucdconnect.ie',
			      avatar: ''
		    },
		    content: 'Hello, everyone. We will discuss the project progress today.',
		    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
	  },
	  {
		    user: {
			      username: 'Hanshu Rao',
			      email: 'hanshu.rao@ucdconnect.ie',
			      avatar: ''
		    },
		    content: 'I am processing the back-end API, and it is expected to be completed tomorrow.',
		    timestamp: new Date(Date.now() - 1000 * 60 * 25) // 25 minutes ago
	  },
	  {
		    user: {
			      username: 'Ziqi Yang',
			      email: 'ziqi.yang@ucdconnect.ie',
			      avatar: ''
		    },
		    content: 'I have completed the multi-cursor part.',
		    timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
	  },
	  {
		    user: {
			      username: 'Yiran Zhao',
			      email: 'yiran.zhao@ucdconnect.ie',
			      avatar: ''
		    },
		    content:
			'I am processing the front-end part, finished the login and register part.',
		    timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
	  },
	  {
		    user: {
			      username: 'Jiawen Chen',
			      email: 'jiawen.chen@ucdconnect.ie',
			      avatar: ''
		    },
		    content:
			'Ok, I will start the design of the CRDT part.',
		    timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
	  },
	  {
		    user: {
			      username: 'Jinpeng Zhai',
			      email: 'jinpeng.zhai@ucdconnect.ie',
			      avatar: ''
		    },
		    content:
			'That\'s great! I will start the design of the cloud storage part.',
		    timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
	  }
];
</script>


<script lang="ts">
	import { writable } from 'svelte/store';
	import { Send } from 'lucide-svelte';
	import ChatMessage from './chat-message.svelte';
  import { mpp } from '$lib/trans';
	import { User } from '$lib/types/auth';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { getHistoryChatMessages } from '$lib/api/project';
  import { onMount } from 'svelte';
  import { failure } from '$lib/components/ui/toast';

  // 接收从Layout传入的props
	let  { currentUser, projectId}: {
      currentUser: User;
      projectId: string;
  } = $props();

  let input = $state(''); // 新消息内容
  let isLoading = $state(true);
	let messages = writable<ChatMessageType[]>(mockMessages);
  
  // 当组件挂载后加载历史消息
  onMount(async () => {
    await fetchHistoryMessages(10);
  });
  
 
  async function fetchHistoryMessages(max_num = 10) {  // 获取最近的历史消息的函数
    try {
      isLoading = true;
      const historyMessages = await getHistoryChatMessages({
        projectId: projectId,
        max_num: max_num,
        last_timestamp: new Date() // 获取当前时间前的10条消息
      });
      
      // 如果成功获取到消息，则更新messages store
      if (historyMessages && historyMessages.length > 0) {
        messages.set(historyMessages);
      }
    } catch (error) {
      console.error('Failed to fetch history messages:', error);
    } finally {
      isLoading = false;
      setTimeout(() => {
        scrollToBottom(); // 消息加载完成后滚动到底部
      }, 100);
    }
  }
  
  
  function scrollToBottom() { // 滚动到底部函数
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
	
	function sendMessage() { // 发送消息
		  if (!input.trim()) return;
		  const message: ChatMessageType = {
			    user: currentUser,
			    content: input,
			    timestamp: new Date()
		  };
		  messages.update((msgs) => [...msgs, message]);
		  input = '';
		  // 自动滚动到底部
		  // scrollToBottom();
	}

	function handleKeydown(event: KeyboardEvent) { // 处理Enter键发送消息
		  if (event.key === 'Enter' && !event.shiftKey) {
			    event.preventDefault();
			    sendMessage();
		  }
	}
</script>

<Sidebar.Content>
  <div class="chat-messages flex-auto flex flex-col overflow-y-auto mt-1">
    {#if isLoading}
      <div class="flex justify-center items-center h-20">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
      </div>
    {:else}
      {#each $messages as msg}
        <ChatMessage message={msg} />
      {/each}
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

