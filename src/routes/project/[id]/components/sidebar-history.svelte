<script lang="ts">
	import { onMount } from 'svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { FilePlus, FileEdit, FileX, Eye } from 'lucide-svelte';
	import { currentFile, switchCurrentFile } from '../store.svelte';

	let { projectId } = $props<{ projectId: string }>();

	// 历史操作类型
	type OperationType = 'add' | 'edit' | 'delete';

	// 历史记录条目
	type HistoryEntry = {
		id: string;
		fileId: string;
		fileName: string;
		operation: OperationType;
		timestamp: string;
		user: string;
	};

	let historyEntries = $state<HistoryEntry[]>([]);
	let loading = $state(false);

	// 在组件挂载时加载项目历史记录
	onMount(() => {
		loadProjectHistory();
	});

	async function loadProjectHistory() {
		loading = true;
		try {
			// 这里应该调用API获取项目历史记录
			// 模拟数据，实际应该从后端获取
			const now = new Date();
			historyEntries = [
				{
					id: '1',
					fileId: 'file1',
					fileName: 'document.md',
					operation: 'edit',
					timestamp: new Date(now.getTime() - 30 * 60 * 1000).toLocaleString(),
					user: 'Yiran Zhao'
				},
				{
					id: '2',
					fileId: 'file2',
					fileName: 'introduction.tex',
					operation: 'add',
					timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toLocaleString(),
					user: 'Jiawen Chen'
				},
				{
					id: '3',
					fileId: 'file3',
					fileName: 'unused.md',
					operation: 'delete',
					timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toLocaleString(),
					user: 'Ziqi Yang'
				},
				{
					id: '4',
					fileId: 'file1',
					fileName: 'document.md',
					operation: 'edit',
					timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toLocaleString(),
					user: 'Liyan Tao'
				}
			];
		} catch (error) {
			console.error('Failed to load project history:', error);
		} finally {
			loading = false;
		}
	}

	function getOperationText(operation: OperationType) {
		switch (operation) {
			case 'add':
				return 'Add';
			case 'edit':
				return 'Edit';
			case 'delete':
				return 'Delete';
			default:
				return 'Operation';
		}
	}

	// 查看文件
	async function viewFile(fileId: string, fileName: string) {
		await switchCurrentFile(projectId, fileId, fileName);
	}
</script>

<Sidebar.Content>
	<div class="flex h-full flex-col p-2">
		{#if loading}
			<div class="flex flex-1 items-center justify-center text-muted-foreground">
				Loading history...
			</div>
		{:else if historyEntries.length === 0}
			<div class="flex flex-1 items-center justify-center text-muted-foreground">
				No history records
			</div>
		{:else}
			<div class="flex-1 overflow-y-auto">
				{#each historyEntries as entry}
					<div class="mb-2 rounded-md border p-3 hover:bg-muted">
						<div class="mb-1 flex items-center gap-2">
							{#if entry.operation === 'add'}
								<FilePlus size={20} class="text-green-500" />
							{:else if entry.operation === 'edit'}
								<FileEdit size={20} class="text-blue-500" />
							{:else if entry.operation === 'delete'}
								<FileX size={20} class="text-red-500" />
							{/if}
							<span class="text-sm font-medium"
								>{entry.user} {getOperationText(entry.operation)} {entry.fileName}</span
							>
						</div>
						<div class="mb-2 ml-6 text-xs text-muted-foreground">
							{entry.timestamp}
						</div>
						{#if entry.operation !== 'delete'}
							<div class="mt-2 flex justify-end">
								<Button
									onclick={() => viewFile(entry.fileId, entry.fileName)}
									variant="outline"
									size="sm"
									class="flex items-center bg-transparent px-2 py-0"
								>
									<Eye size={14} />
									View file
								</Button>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</Sidebar.Content>
