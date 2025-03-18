<script lang="ts">
	import { format } from 'date-fns';
	import { zhCN } from 'date-fns/locale';
	import type { ChatMessage } from '$lib/types/editor';

	let { message }: { message: ChatMessage } = $props();
</script>

<div class="flex items-start gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-secondary/20">
	<!-- 用户头像 -->
	<div class="flex-shrink-0">
		{#if message.user.avatar}
			<img
				src={message.user.avatar}
				alt={message.user.username}
				class="h-8 w-8 rounded-full object-cover"
			/>
		{:else}
			<div
				class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-medium text-primary"
			>
				{message.user.username.charAt(0).toUpperCase()}
			</div>
		{/if}
	</div>

	<!-- 消息内容 -->
	<div class="min-w-0 flex-1">
		<div>
			<span class="text-sm font-bold font-serif text-amber-800">{message.user.username}</span>
		</div>
		<p class="mt-1 break-words text-sm font-sans">{message.message}</p>
		<div class="mt-1 text-center">
			<span class="text-xs text-muted-foreground italic">
				{format(message.timestamp, 'yyyy-MM-dd HH:mm', { locale: zhCN })}
			</span>
		</div>
	</div>
</div>
