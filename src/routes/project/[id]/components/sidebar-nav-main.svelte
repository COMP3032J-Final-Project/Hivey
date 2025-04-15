<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { TreeNode } from '$lib/types/editor';
	import FileTreeItem from './FileTreeItem.svelte';
	import { filesStruct, switchCurrentFile } from '../store.svelte';

	async function handleFileClick(file: TreeNode) {
		const {id, project_id, filename} = file;
		console.log('[NavMain] File clicked:', filename);
		const filetype = filename.split('.').pop() || 'md';
		await switchCurrentFile(project_id, id, filename);
	}

</script>

<Sidebar.Content>
	<Sidebar.Group>
    <Sidebar.Menu>
	    {#each $filesStruct as item (item.id)}
        <FileTreeItem {item} onFileClick={handleFileClick} />
      {/each}
    </Sidebar.Menu>    
	</Sidebar.Group>
</Sidebar.Content>
