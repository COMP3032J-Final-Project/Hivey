<script lang="ts">
	import { writable } from 'svelte/store';
	import { Send } from 'lucide-svelte';
	import ChatMessage from './chat-message.svelte';
	import type { ChatMessage as ChatMessageType } from '$lib/types/editor';
	import type { User } from '$lib/types/auth';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { mpp } from '$lib/trans';

  // 接收从Layout传入的props
	let { chatMessages, currentUser }: { chatMessages: ChatMessageType[]; currentUser: User } =$props();
	const messages = writable<ChatMessageType[]>(chatMessages); // 创建一个可写的store来存储聊天消息
	let input = $state(''); // 新消息内容
	
	function sendMessage() { // 发送消息
		if (!input.trim()) return;

		const message: ChatMessageType = {
			user: currentUser,
			message: input,
			timestamp: new Date()
		};

		messages.update((msgs) => [...msgs, message]);
		input = '';

		// 自动滚动到底部
		setTimeout(() => {
			const chatContainer = document.querySelector('.chat-messages');
			if (chatContainer) {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}
		}, 10);
	}

	// 处理Enter键发送消息
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}
</script>

<div class="flex h-full w-full flex-col">
	<!-- 聊天消息列表 -->
	<div class="chat-messages flex-1 overflow-y-auto px-2 py-3">
		{#each $messages as msg}
			<ChatMessage message={msg} />
		{/each}
	</div>

	<!-- 输入框区域 -->
	<div
		class="sticky bottom-0 w-full border-t border-amber-200 bg-amber-100/90 p-2 backdrop-blur-sm"
	>
		<div class="flex w-full items-center gap-2">
			<input
				type="text"
				bind:value={input}
				onkeydown={handleKeydown}
				placeholder={mpp.send_chat_message()}
				class="h-9 min-w-0 flex-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm shadow-sm placeholder:text-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-400"
			/>
			<button
				class="flex-shrink-0 rounded-full bg-amber-400 p-2 text-white shadow-sm transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={!input.trim()}
				onclick={sendMessage}
			>
				<Send size={14} />
			</button>
		</div>
	</div>
</div>
