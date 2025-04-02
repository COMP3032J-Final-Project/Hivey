<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import DataTable from './data-table/data-table.svelte';
	import { columns } from './data-table/columns';
	import { members } from '../store.svelte';
	import { mpp } from '$lib/trans'; 
	import type { User } from '$lib/types/auth';
	let { currentUser, projectId, open = false, onOpenChange }: { currentUser: User; projectId: string; open: boolean; onOpenChange: (open: boolean) => void } =
		$props();
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
