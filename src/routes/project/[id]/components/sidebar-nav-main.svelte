<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { getContext } from 'svelte';
	import type { EditorFileInfo, TreeNode } from '$lib/types/editor';
	import FileTreeItem from './FileTreeItem.svelte';

    let treeData: TreeNode[] = [];

	const { currentFilesStruct: latestFilesStruct, updateFileName, updateFileType, loadFile } = getContext<EditorFileInfo>('editor-context');
	
    
    latestFilesStruct?.subscribe((value) => {
        treeData = value;
        console.log('[NavMain] File Structure set to:', treeData);
    });
	async function handleFileClick(file: TreeNode) {
		const fileName = file.filename;
        const fileType = file.filename.split('.').pop() || 'md';
        console.log('[NavMain] File clicked:', fileName);
      
        if (loadFile) {
			const fileId = file.id;
            const fileTitle = file.filename;
            console.log('[NavMain] Loading file:', fileId, fileTitle);
            await loadFile(fileId, fileTitle);
        } else {
			updateFileName(fileName);
            updateFileType(fileType);
        }
    }

</script>

<Sidebar.Content>
	<Sidebar.Group>
    <Sidebar.Menu>
	  {#each treeData as item (item.id)}
        <FileTreeItem {item} onFileClick={handleFileClick} />
      {/each}
    </Sidebar.Menu>    
	</Sidebar.Group>
</Sidebar.Content>
