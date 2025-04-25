<script lang="ts">
	import { format } from 'date-fns';
	import { zhCN } from 'date-fns/locale';
	import { FilePlus, FileEdit, FileX, ArrowRight } from 'lucide-svelte';
	import { HistoryAction, type HistoryMessage } from '$lib/types/editor';

	let { historyMessage }: { historyMessage: HistoryMessage } = $props();
	let Icon = $derived(getOperationIcon(historyMessage.action));
	let iconColor = $derived(getIconColor(historyMessage.action));
	let iconBgColor = $derived(getIconBgColor(historyMessage.action));

	function getOperationIcon(action: HistoryAction) {
		switch (action) {
			case HistoryAction.ADDED:
				return FilePlus;
			case HistoryAction.RENAMED:
				return FileEdit;
			case HistoryAction.MOVED:
				return FileEdit;
			case HistoryAction.UPDATE_NAME:
				return FileEdit;
			case HistoryAction.DELETED:
				return FileX;
			default:
				return FileEdit;
		}
	}

	function getIconColor(action: HistoryAction) {
		switch (action) {
			case HistoryAction.ADDED:
				return 'text-green-600';
			case HistoryAction.RENAMED:
				return 'text-blue-600';
			case HistoryAction.MOVED:
				return 'text-blue-600';
			case HistoryAction.UPDATE_NAME:
				return 'text-blue-600';
			case HistoryAction.DELETED:
				return 'text-red-600';
			default:
				return 'text-blue-600';
		}
	}
	
	function getIconBgColor(action: HistoryAction) {
		switch (action) {
			case HistoryAction.ADDED:
				return 'bg-green-50';
			case HistoryAction.RENAMED:
				return 'bg-blue-50';
			case HistoryAction.MOVED:
				return 'bg-blue-50';
			case HistoryAction.UPDATE_NAME:
				return 'bg-blue-50';
			case HistoryAction.DELETED:
				return 'bg-red-50';
			default:
				return 'bg-blue-50';
		}
	}

	function formatTimestamp(timestamp: Date) {
		return format(new Date(timestamp), 'yyyy-MM-dd HH:mm', { locale: zhCN });
	}
</script>

<div class="flex items-start gap-3 mb-3 p-3 rounded-lg hover:bg-amber-50/30 transition-colors">
	<!-- 图标 -->
	<div class="flex-shrink-0">
		<div class={`flex h-8 w-8 items-center justify-center rounded-full ${iconBgColor}`}>
			<Icon size={16} class={iconColor} />
		</div>
	</div>
	
	<!-- 内容区域 -->
	<div class="min-w-0 flex-1">
		<!-- 用户名 -->
		<div>
			<span class="text-sm font-bold font-serif text-amber-800">{historyMessage.user.username}</span>
		</div>
		
		<!-- 操作内容 -->
		<div class="mt-1 break-words text-sm font-sans">
			{#if historyMessage.action === HistoryAction.ADDED}
				Added <span class="rounded bg-green-50 px-1.5 py-0.5 text-sm font-mono text-green-700">root{historyMessage.state_after.filepath}/{historyMessage.state_after.filename}</span>
				
			{:else if historyMessage.action === HistoryAction.RENAMED}
				Renamed 
				<span class="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-700">root{historyMessage.state_before.filepath}/{historyMessage.state_before.filename}</span>
				<ArrowRight size={12} class="inline mx-1 text-gray-400" />
				<span class="rounded bg-blue-50 px-1.5 py-0.5 text-sm font-mono text-blue-700">root{historyMessage.state_after.filepath}/{historyMessage.state_after.filename}</span>
				
			{:else if historyMessage.action === HistoryAction.MOVED}
				Moved
				<div class="mt-1 flex flex-col gap-1">
					<span class="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-700">
						root{historyMessage.state_before.filepath}/{historyMessage.state_before.filename}
					</span>
					<span class="flex items-center">
						<ArrowRight size={12} class="mr-1 text-gray-400" />
						<span class="rounded bg-blue-50 px-1.5 py-0.5 text-sm font-mono text-blue-700">
							root{historyMessage.state_after.filepath}/{historyMessage.state_after.filename}
						</span>
					</span>
				</div>
				
			{:else if historyMessage.action === HistoryAction.DELETED}
				Deleted 
				<span class="rounded bg-red-50 px-1.5 py-0.5 text-sm font-mono text-red-700">
					root{historyMessage.state_before.filepath}/{historyMessage.state_before.filename}
				</span>
				
			{:else if historyMessage.action === HistoryAction.UPDATE_NAME}
				Updated project name to 
				<span class="rounded bg-amber-50 px-1.5 py-0.5 text-sm font-mono font-medium text-amber-700">
					{historyMessage.state_after.name}
				</span>
				
			{:else}
				Performed an operation
			{/if}
		</div>
		
		<!-- 时间戳 -->
		<div class="mt-1 text-center">
			<span class="text-xs text-muted-foreground italic">
				{formatTimestamp(historyMessage.timestamp)}
			</span>
		</div>
	</div>
</div>
