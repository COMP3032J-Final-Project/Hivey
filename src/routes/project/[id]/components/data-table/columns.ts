import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import { renderSnippet } from '$lib/components/ui/data-table/index.js';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableActions from './data-table-actions.svelte';
import DataTablePermissionButton from './data-table-permission-button.svelte';
import type { User } from '$lib/types/auth';

export const columns: ColumnDef<User>[] = [
    {   
        id: "username",
        accessorKey: "username",
        header: () => {
          const usernameHeaderSnippet = createRawSnippet(() => ({
            render: () => `<div class="text-center">Username</div>`,
          }));
          return renderSnippet(usernameHeaderSnippet, "");
        },
        cell: ({ row }) => {
          const usernameCellSnippet = createRawSnippet<[string]>((getUsername) => {
            const username = getUsername();
            return {
              render: () => `<div class="text-center font-bold">${username}</div>`,
            };
          });
          return renderSnippet(usernameCellSnippet, row.getValue("username"));
        },
    },
    {
      id: 'email',
      accessorKey: "email",
      header: () => {
        const emailHeaderSnippet = createRawSnippet(() => ({
          render: () => `<div class="text-center">Email</div>`,
        }));
        return renderSnippet(emailHeaderSnippet, "");
      },
      cell: ({ row }) => {
        const emailCellSnippet = createRawSnippet<[string]>((getEmail) => {
          const email = getEmail();
          return {
            render: () => `<div class="text-center">${email}</div>`,
          };
        });
        return renderSnippet(emailCellSnippet, row.getValue("email"));
      },
    },
    {
        id: 'permission',
        accessorKey: "permission",
        header: ({ column }) =>
          renderComponent(DataTablePermissionButton, {
            onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          }), 
        cell: ({ row }) => {
          const permissionCellSnippet = createRawSnippet<[string]>((getPermission) => {
            const permission = getPermission();
            return {
              render: () => `<div class="text-center">${permission}</div>`,
            };
          });
          return renderSnippet(permissionCellSnippet, row.getValue("permission"));
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return renderComponent(DataTableActions, { id: row.original.username });
        },
    },
    
  ];