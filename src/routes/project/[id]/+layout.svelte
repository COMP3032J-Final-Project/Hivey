<script lang="ts">
	import { MessageSquare } from 'lucide-svelte';
	import CreateFileDialog from '$lib/components/new-file-modal.svelte';
	import CreateFolderDialog from '$lib/components/new-folder-modal.svelte';
	import type { SidebarFolder, SidebarFile, EditorFileInfo, FileType } from '$lib/types/editor';
	import NavMain from './components/sidebar-nav-main.svelte';
	import ChatRoom from './components/sidebar-chatroom.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import { Button } from "$lib/components/ui/button/index.js";
	import { getFileContent, fetchDocData } from '$lib/api/editor';

	let { data, children } = $props<{
		data: {
			groupName: string;
			folders: SidebarFolder[];
			files: SidebarFile[];
			chatMessages: any[];
			currentUser: any;
			projectId: string;
		};
		children: any;
	}>();
	let projectId = data.projectId;
	let folders = writable<SidebarFolder[]>(data.folders);
	let files = writable<SidebarFile[]>(data.files);
	let showChat = $state(false); // 聊天室的显示状态

	function addNewFolder() {
		console.log('Add new folder');
	}

	// const currentFile = writable<FileType>;
	const currentFileId = writable('');
	const currentFileName = writable('');
	const currentFileType = writable('Format');
    const docContent = writable('');
    const currentFilePath = writable('');

	setContext<EditorFileInfo>('editor-context', {
		currentFileId,
		updateFileId: (id) => currentFileId.set(id),
		currentFileName,
		updateFileName: (name) => currentFileName.set(name),
		currentFileType,
		updateFileType: (type) => currentFileType.set(type),
		docContent,
		updateContent: (content) => docContent.set(content),
		currentFilePath,
		loadFile: async (fileId, fileName) => {
			try {
				console.log('Loading file:', fileName);
				const fileType = fileName.split('.').pop() || 'md';
				currentFileType.set(fileType);
				currentFileName.set(fileName);
				currentFilePath.set("1");
				if (fileType === 'tex') {
					const content = await getFileContent(projectId, fileId);
					const str = content.url;
					console.log('File content url:', str);
					fetchDocData(str).then((data) => {
						console.log('File content:', data);
					});
					docContent.set(`# Heading 1
 
 ## Heading 2
 
 ### Heading 3
 
 This is a link to [Google](https://www.google.com/).
 
 Here is an example of inline code: \`console.log('Hello, World!');\`.
 
 Below is a code block:
 
 \`\`\`javascript
 function greet(name) {
	 console.log(\`Hello!\`);
 }
 greet('Alice');
 \`\`\``);
				} else if (fileType === 'png') {
					docContent.set('Loading JSON content...');
				} else {
					docContent.set('Unsupported file type');
				}
				return true;
				return false;
			} catch (error) {
				console.error('Failed to load file:', error);
				return false;
			}
		}
	});

	currentFileType.subscribe((value) => {
		console.log('[Layout] currentFileType updated to:', value);
	});
	docContent.subscribe((value) => {
		console.log('[Layout] File content set to:', value);
	});
</script>

<Sidebar.Provider>
	<Sidebar.Root collapsible="offcanvas" variant="inset">
    <Sidebar.Header>
      <div class="flex pb-1">
			  <CreateFileDialog />
			  <CreateFolderDialog />
			  <Button variant="ghost" size="icon" onclick={() => (showChat = !showChat)} >
				  <MessageSquare size={20} />
			  </Button>
      </div>
    </Sidebar.Header>

    <Sidebar.Separator />

    {#if showChat}
			<ChatRoom projectId={data.projectId} currentUser={data.currentUser} />
		{:else}
			<NavMain folders_tmp={$folders} files_tmp={$files} />
		{/if}
	</Sidebar.Root>

	<Sidebar.Inset>
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
