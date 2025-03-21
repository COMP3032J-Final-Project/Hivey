import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import { renderSnippet } from '$lib/components/ui/data-table/index.js';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { Checkbox } from '$lib/components/ui/checkbox/index.js';
import DataTableActions from './data-table-actions.svelte';
import DataTableTimeButton from './data-table-time-button.svelte';

export type Repository = {
	id: string;
	name: string;
	owner_id: string;
	created_at: Date;
	updated_at: Date;
};

export const columns: ColumnDef<Repository>[] = [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(Checkbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate:
					table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
				onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all'
			}),
		cell: ({ row }) =>
			renderComponent(Checkbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value) => row.toggleSelected(!!value),
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
		}
	},
	{
		accessorKey: 'owner_id',
		header: () => {
			const ownerHeaderSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-right">Owner</div>`
			}));
			return renderSnippet(ownerHeaderSnippet, '');
		},
		cell: ({ row }) => {
			const ownerCellSnippet = createRawSnippet<[string]>((getOwner) => {
				const owner = getOwner();
				return {
					render: () => `<div class="text-right font-medium">${owner}</div>`
				};
			});
			return renderSnippet(ownerCellSnippet, row.getValue('owner_id'));
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
		}
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(DataTableActions, { id: row.original.id });
		}
	}
];
