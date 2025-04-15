<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import DataTable from './data-table/data-table.svelte';
	import { columns } from './data-table/columns';
	import { members } from '../store.svelte';
	import { getContext } from 'svelte';
	import type { User } from '$lib/types/auth';
	import type { WebSocketClient } from '$lib/api/websocket';
  import { removeMember, updateMember } from '../store.svelte';
  import { UserPermissionEnum } from '$lib/types/auth';
	let { currentUser, projectId, open = false, onOpenChange }: { currentUser: User; projectId: string; open: boolean; onOpenChange: (open: boolean) => void } =
		$props();

  const getWsClient = getContext<() => WebSocketClient | null>('websocket-client'); // 从context中获取WebSocket客户端的函数
	let wsClient = $derived(getWsClient ? getWsClient() : null); // 获取当前的wsClient实例
  
  $effect(() => {
    if (wsClient) {
      wsClient.memberUpdateHandler = (username: string, permission: UserPermissionEnum) => {
        updateMember(username, {
          permission: permission
        });
      }

      wsClient.memberRemoveHandler = (username: string) => {
        removeMember(username);
      }
    }
  });
</script>

<Dialog.Root {open} {onOpenChange}>
	<Dialog.Content class="sm:max-w-[800px]">
		<div class="py-4">
			<Dialog.Header>
				<Dialog.Title>Project Members</Dialog.Title>
				<Dialog.Description>
					View and manage project members and their permissions
				</Dialog.Description>
			</Dialog.Header>
			<DataTable data={$members} {columns} {currentUser} {projectId} />
		</div>
	</Dialog.Content>
</Dialog.Root>
