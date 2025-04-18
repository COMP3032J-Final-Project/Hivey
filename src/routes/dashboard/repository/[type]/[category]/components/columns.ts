import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import { renderSnippet } from '$lib/components/ui/data-table/index.js';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { Checkbox } from '$lib/components/ui/checkbox/index.js';
import DataTableActions from './data-table-actions.svelte';
import TemplateActions from './template-actions.svelte';
import DataTableTimeButton from './data-table-time-button.svelte';
import type { Project } from '$lib/types/dashboard';
import type { User } from '$lib/types/auth';

export const getColumns = (type: string, currentUser: User | null): ColumnDef<Project>[] => {
	const baseColumns: ColumnDef<Project>[] = [
		{
			id: 'select',
			header: ({ table }) => {
				if (!currentUser) return null;
				return renderComponent(Checkbox, {
					checked: table.getIsAllPageRowsSelected(),
					indeterminate:
						table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
					onCheckedChange: (value: boolean) => table.toggleAllPageRowsSelected(!!value),
					'aria-label': 'Select all'
				});
			},
			cell: ({ row }) => {
				if (!currentUser || currentUser.email !== row.original.owner?.email) return null;
				return renderComponent(Checkbox, {
					checked: row.getIsSelected(),
					onCheckedChange: (value: boolean) => row.toggleSelected(!!value),
					'aria-label': 'Select row'
				});
			},
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
		}
	];

	if (type === 'projects') {
		baseColumns.push({
			id: 'actions',
			cell: ({ row, table }) => {
				return renderComponent(DataTableActions, { 
					id: row.original.id,
					selectedIds: table.getFilteredSelectedRowModel().rows.map(row => row.original.id),
					onDelete: () => {
						table.toggleAllPageRowsSelected(false);
					},
					isOwner: currentUser?.email === row.original.owner?.email
				});
			},
			enableHiding: false,
			meta: {
				label: 'Actions'
			}
		});
	} else if (type === 'templates') {
		baseColumns.push({
			id: 'actions',
			cell: ({ row, table }) => {
				const category = window.location.pathname.split('/').pop() || '';
				return renderComponent(TemplateActions, { 
					id: row.original.id,
					selectedIds: table.getFilteredSelectedRowModel().rows.map(row => row.original.id),
					onDelete: () => {
						table.toggleAllPageRowsSelected(false);
					},
					isFavorite: row.original.isFavorite === true ? true : category === 'favourite',
					isOwner: currentUser?.email === row.original.owner?.email
				});
			},
			enableHiding: false,
			meta: {
				label: 'Actions'
			}
		});
	} else {
		baseColumns.push({
			id: 'actions',
			cell: ({ row, table }) => {
				return renderComponent(DataTableActions, { 
					id: row.original.id,
					selectedIds: table.getFilteredSelectedRowModel().rows.map(row => row.original.id),
					onDelete: () => {
						table.toggleAllPageRowsSelected(false);
					},
					isOwner: currentUser?.email === row.original.owner?.email
				});
			},
			enableHiding: false,
			meta: {
				label: 'Actions'
			}
		});
	}

	return baseColumns;
};

// 为了兼容性保留旧的columns导出
export const columns = getColumns('projects', null);
