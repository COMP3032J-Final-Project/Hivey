import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import { renderSnippet } from '$lib/components/ui/data-table/index.js';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { Checkbox } from '$lib/components/ui/checkbox/index.js';
import DataTableActions from './data-table-actions.svelte';
import DataTableTimeButton from './data-table-time-button.svelte';
import DataTableHeaderWithDelete from './data-table-header-with-delete.svelte';
import type { Project } from '$lib/types/dashboard';

export const columns: ColumnDef<Project>[] = [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(DataTableHeaderWithDelete, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate:
					table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
				onCheckedChange: (value: boolean) => table.toggleAllPageRowsSelected(!!value),
				onDelete: () => {
					const selectedRows = table.getFilteredSelectedRowModel().rows;
					// 执行删除操作
					console.log('删除选中的行', selectedRows.length, '条记录');
					
					// 这里可以通过dispatch事件或调用API来处理实际删除操作
					// 例如：发送删除请求到服务器
					const selectedIds = selectedRows.map(row => row.original.id);
					console.log('要删除的ID列表:', selectedIds);
					
					// 删除后可能需要刷新表格数据
					// refreshData();
					
					// 删除后取消所有选择
					table.toggleAllPageRowsSelected(false);
				}
			}),
		cell: ({ row }) =>
			renderComponent(Checkbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value: boolean) => row.toggleSelected(!!value),
				'aria-label': 'Select row'
			}),
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: 'name',
		header: () => {
			const nameHeaderSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-right">Title</div>`
			}));
			return renderSnippet(nameHeaderSnippet, '');
		},
		cell: ({ row }) => {
			const nameCellSnippet = createRawSnippet<[string]>((getName) => {
				const name = getName();
				return {
					render: () => `<div class="text-right font-medium">${name}</div>`
				};
			});
			return renderSnippet(nameCellSnippet, row.getValue('name'));
		},
		enableHiding: false,
		meta: {
			label: 'Title'
		}
	},
	{
		accessorKey: 'owner',
		header: () => {
			const ownerHeaderSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-right">Owner</div>`
			}));
			return renderSnippet(ownerHeaderSnippet, '');
		},
		cell: ({ row }) => {
			const owner = row.original.owner;
			const ownerEmail = owner?.email || 'Unknown';
			
			const ownerCellSnippet = createRawSnippet<[string]>((getOwner) => {
				const owner = getOwner();
				return {
					render: () => `<div class="text-right font-medium">${owner}</div>`
				};
			});
			return renderSnippet(ownerCellSnippet, ownerEmail);
		},
		enableHiding: false,
		meta: {
			label: 'Owner'
		}
	},
	{
		accessorKey: 'updated_at',
		enableSorting: true,
		sortingFn: 'datetime',
		header: ({ column }) => {
			return renderComponent(DataTableTimeButton, {
				label: 'Updated At',
				onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			});
		},
		cell: ({ row }) => {
			const date = row.getValue('updated_at') as Date;
			const formattedDate =
				date instanceof Date
					? date
							.toLocaleString('zh-CN', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit',
								second: '2-digit',
								hour12: false
							})
							.replace(/\//g, '-')
					: String(date);

			const dateCellSnippet = createRawSnippet<[string]>((getDate) => {
				const date = getDate();
				return {
					render: () => `<div class="text-right font-medium">${date}</div>`
				};
			});
			return renderSnippet(dateCellSnippet, formattedDate);
		},
		meta: {
			label: 'Updated At'
		}
	},
	{
		accessorKey: 'created_at',
		enableSorting: true,
		sortingFn: 'datetime',
		header: ({ column }) => {
			return renderComponent(DataTableTimeButton, {
				label: 'Created At',
				onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			});
		},
		cell: ({ row }) => {
			const date = row.getValue('created_at') as Date;
			const formattedDate =
				date instanceof Date
					? date
							.toLocaleString('zh-CN', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit',
								second: '2-digit',
								hour12: false
							})
							.replace(/\//g, '-')
					: String(date);

			const dateCellSnippet = createRawSnippet<[string]>((getDate) => {
				const date = getDate();
				return {
					render: () => `<div class="text-right font-medium">${date}</div>`
				};
			});
			return renderSnippet(dateCellSnippet, formattedDate);
		},
		meta: {
			label: 'Created At'
		}
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { id: row.original.id });
		},
		enableHiding: false,
		meta: {
			label: 'Actions'
		}
	}
];
