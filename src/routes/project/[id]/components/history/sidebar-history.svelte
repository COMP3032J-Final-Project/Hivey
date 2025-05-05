<script lang="ts">
	import { onMount } from 'svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import HistoryMessage from './history-message.svelte';
	import { project, historyMessages, setHistoryMessages } from '../../store.svelte';
  import { getProjectHistory } from '$lib/api/project';
  import  { type HistoryMessage as HistoryMessageType, HistoryAction } from '$lib/types/editor';

	let loading = $state(false);
	let error = $state<string | null>(null);

	// 在组件挂载时加载项目历史记录
	onMount(() => {
		loadProjectHistory();
	});

	async function loadProjectHistory() {
		loading = true;
		error = null;
		try {
			const messages: HistoryMessageType[] = await getProjectHistory($project.id);
      // 将messages中Action为MOVED或RENAMED类型的message进行过滤，如果修改前后的filepath或filename相同，则不显示
      // const filteredMessages = messages.filter(message => {
      //   // 对于MOVED操作，如果filepath相同则过滤掉
      //   if (message.action === HistoryAction.MOVED) {
      //     return message.state_before.filepath !== message.state_after.filepath;
      //   }
      //   // 对于RENAMED操作，如果filename相同则过滤掉
      //   if (message.action === HistoryAction.RENAMED) {
      //     return message.state_before.filename !== message.state_after.filename;
      //   }
      //   // 其他类型的消息都保留
      //   return true;
      // });
      console.log("History messages:", messages);
      setHistoryMessages(messages);
		} catch (err) {
			error = err instanceof Error ? err.message : String(err);
		} finally {
			loading = false;
		}
	}
</script>

<Sidebar.Content>
	<div class="flex h-full flex-col p-2">
		{#if loading}
			<div class="flex flex-1 items-center justify-center text-muted-foreground">
				Loading history...
			</div>
		{:else if error}
			<div class="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
				<p class="text-red-500">{error}</p>
				<button 
					class="rounded-md bg-amber-100 px-3 py-1 text-sm text-amber-700 hover:bg-amber-200" 
					onclick={loadProjectHistory}
				>
					Retry
				</button>
			</div>
		{:else if $historyMessages.length === 0}
			<div class="flex flex-1 items-center justify-center text-muted-foreground">
				No history records
			</div>
		{:else}
			<div class="flex-1 overflow-y-auto">
				{#each $historyMessages as message}
					<HistoryMessage historyMessage={message} />
				{/each}
			</div>
		{/if}
	</div>
</Sidebar.Content>
