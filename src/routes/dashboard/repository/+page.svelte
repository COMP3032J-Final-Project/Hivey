<script lang="ts">
	import DataTable from './data-table.svelte';
	import { columns } from './columns.js';

	let { data } = $props();

	// 模拟数据
	const tableData = [
		{
			id: '1',
			name: 'Project 1',
			owner_id: 'user123',
			created_at: new Date('2024-03-19T10:00:30'),
			updated_at: new Date('2024-03-19T12:00:30')
		},
		{
			id: '2',
			name: 'Project 2',
			owner_id: 'user456',
			created_at: new Date('2024-03-19T11:30:45'),
			updated_at: new Date('2024-03-19T11:30:45')
		}
	];
</script>

<main class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<DataTable data={tableData} {columns} />
</main>
