<script lang="ts">
  import { Download } from 'lucide-svelte';
	import * as Menubar from '$lib/components/ui/menubar';
	import { Button } from '$lib/components/ui/button';
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import * as AvatarGroup from '$lib/components/ui/avatar-group';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import InviteButton from './components/button/invite-button.svelte';
	import MembersDialog from './components/members-dialog.svelte';
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Underline from '@lucide/svelte/icons/underline';
	import { Command, ArrowBigUp, House, Share } from 'lucide-svelte';
	import { updateProject } from '$lib/api/dashboard';
	import { success, failure } from '$lib/components/ui/toast';
	import type { PageProps } from './$types';
	import { type User, UserPermissionEnum } from '$lib/types/auth';
	import { getContext, onMount } from 'svelte';
	import EditableLabel from '$lib/components/ui/editable-label';
	import { onlineMembers, currentFile, project, updateProject as updateProjectStore } from './store.svelte';
	import type { WebSocketClient } from '$lib/api/websocket';
	import Editor from './components/editor.svelte';
	import Previewer from './components/previewer.svelte';
	import ShareProjectDialog from './components/share-project2template-modal.svelte';
	import { goto } from '$app/navigation';
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { FileType } from '$lib/types/editor';

	let { data }: PageProps = $props();
	const getWsClient = getContext<() => WebSocketClient | null>('websocket-client'); // 从context中获取WebSocket客户端的函数
	let wsClient = $derived(getWsClient ? getWsClient() : null); // 获取当前的wsClient实例
	let currentUser: User = $state(data.currentUser);
	let membersDialogOpen = $state(false);
	let shareTemplateDialogOpen = $state(false); // 新增：控制对话框显示状态
	let currentFileType: FileType = $derived($currentFile.filetype as FileType);
	let docContent = $state('');

	function formatMarkdown() {
		//TODO Implement markdown formatting logic here
		console.log('Format markdown');
	}

	async function handleProjectNameUpdate(projectName: string) {
		try {
			const updatedProject = await updateProject({
				id: $project.id,
				name: projectName
			});

			updateProjectStore({name: projectName}); // 更新本地项目名称
			success('Project name updated successfully');

			// 通过WebSocket广播项目名称更新
			if (wsClient) {
				try {
					wsClient.sendUpdateProjectNameMessage(projectName);
				} catch (wsError) {
					console.error('WebSocket update failed but API succeeded:', wsError);
					// WebSocket错误不影响API成功，继续返回成功
				}
			}

			return projectName;
		} catch (error) {
			console.error('Project update error:', error);
			failure('Project name update failed');
			return null;
		}
	}

	let editorRef: Editor;
	let value: string[] = $state([]);
	let isBold = $state(false);
	let isItalic = $state(false);
	let isStrikethrough = $state(false);

	function checkSelection() {
		if (editorRef) {
			const boldFormat = getFormatting('bold');
			const italicFormat = getFormatting('italic');
			const strikeFormat = getFormatting('strikethrough');
			
			isBold = editorRef.hasSurroundingSymbols(boldFormat.prefix, boldFormat.suffix);
			isItalic = editorRef.hasSurroundingSymbols(italicFormat.prefix, italicFormat.suffix);
			isStrikethrough = editorRef.hasSurroundingSymbols(strikeFormat.prefix, strikeFormat.suffix);
			
			value = [];
			if (isBold) value.push('bold');
			if (isItalic) value.push('italic');
			if (isStrikethrough) value.push('strikethrough');
		}
	}

		// Format definitions for different file types
		type FormatType = 'bold' | 'italic' | 'strikethrough';
	type FormatDefinition = { prefix: string; suffix: string };
	type FormatMap = Record<FormatType, FormatDefinition>;

	const formatDefinitions: Record<string, FormatMap> = {
		'markdown': {
			bold: { prefix: '**', suffix: '**' },
			italic: { prefix: '*', suffix: '*' },
			strikethrough: { prefix: '~~', suffix: '~~' }
		},
		'latex': {
			bold: { prefix: '\\textbf{', suffix: '}' },
			italic: { prefix: '\\textit{', suffix: '}' },
			strikethrough: { prefix: '\\underline{', suffix: '}' }
		},
		'typst': {
			bold: { prefix: '*', suffix: '*' },
			italic: { prefix: '_', suffix: '_' },
			strikethrough: { prefix: '#underline[', suffix: ']' }
		}
	};

	// Map FileType enum to strings for our format dictionary
	function fileTypeToString(type: FileType): string {
		switch (type) {
			case FileType.MARKDOWN:
				return 'markdown';
			case FileType.LATEX:
				return 'latex';
			case FileType.TYPST:
				return 'typst';
			default:
				return 'markdown'; // Default to markdown
		}
	}

	// Default to markdown if file type not recognized
	function getFormatting(formatType: string): FormatDefinition {
		const formatKey = fileTypeToString(currentFileType);
		const fileFormatting = formatDefinitions[formatKey] || formatDefinitions['markdown'];
		
		// Type guard to check if the format type is valid
		if (formatType === 'bold' || formatType === 'italic' || formatType === 'strikethrough') {
			return fileFormatting[formatType];
		}
		
		// Default empty format if format type is not recognized
		return { prefix: '', suffix: '' };
	}

	function wrapSelection(formatType: string) {
		if (editorRef) {
			const format = getFormatting(formatType);
			const { prefix, suffix } = format;
			
			if (formatType === 'bold') {
				if (isBold) {
					editorRef.unwrapSelection(prefix, suffix);
					isBold = false;
				} else {
					editorRef.wrapSelection(prefix, suffix);
					isBold = true;
				}
			}
			else if (formatType === 'italic') {
				if (isItalic) {
					editorRef.unwrapSelection(prefix, suffix);
					isItalic = false;
				} else {
					editorRef.wrapSelection(prefix, suffix);
					isItalic = true;
				}
			}
			else if (formatType === 'strikethrough') {
				if (isStrikethrough) {
					editorRef.unwrapSelection(prefix, suffix);
					isStrikethrough = false;
				} else {
					editorRef.wrapSelection(prefix, suffix);
					isStrikethrough = true;
				}
			}
		}
	}

	// Menu action handlers
	function handleUndo() {
		if (editorRef) editorRef.undo();
	}

	function handleRedo() {
		if (editorRef) editorRef.redo();
	}

	function handleFindReplace() {
		if (editorRef) editorRef.findReplace();
	}

	function handleFindNext() {
		if (editorRef) editorRef.findNext();
	}

	function handleFindPrevious() {
		if (editorRef) editorRef.findPrevious();
	}

	function handleCut() {
		if (editorRef) editorRef.cutSelection();
	}

	function handleCopy() {
		if (editorRef) editorRef.copySelection();
	}

	function handlePaste() {
		if (editorRef) editorRef.pasteAtCursor();
	}

	onMount(() => {
		const editorDom = document.querySelector('.editor');
		if (editorDom) {
			editorDom.addEventListener('mouseup', checkSelection);
			editorDom.addEventListener('selectionchange', checkSelection);
		}
	});
</script>

<div class="flex size-full flex-col">
	<header class="flex h-12 justify-between border-b px-4">
		<div class="hidden items-center md:flex">
			<Sidebar.Trigger class="-ml-1" />
			<Menubar.Root class="border-0 bg-transparent">
				<Menubar.Menu>
					<Menubar.Trigger>Project</Menubar.Trigger>
					<Menubar.Content class="w-48">
						<Menubar.Item onclick={() => {
							if (wsClient) {
								wsClient.disconnect();
							}
							goto(localizeHref('/dashboard/repository/projects/all'));
						}}>
							Home page
							<Menubar.Shortcut><House class="size-4" /></Menubar.Shortcut>
						</Menubar.Item>
						{#if $project.type !== 'template'}
						<Menubar.Item
							onclick={() => {
								if (currentUser.permission !== UserPermissionEnum.Owner) {
									failure('Only owner can share project as template');
									return;
								}
								shareTemplateDialogOpen = true;
							}}
						>
							Share as Template
							<Menubar.Shortcut><Share class="size-4" /></Menubar.Shortcut>
						</Menubar.Item>
						{/if}
					</Menubar.Content>
				</Menubar.Menu>
				<Menubar.Menu>
					<Menubar.Trigger>Edit</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Item onclick={handleUndo}>
							Undo
							<Menubar.Shortcut class="flex items-center gap-1"
								><Command class="size-4" />Z</Menubar.Shortcut
							>
						</Menubar.Item>
						<Menubar.Item onclick={handleRedo}>
							Redo
							<Menubar.Shortcut class="flex items-center gap-1"
								><Command class="size-4" /><ArrowBigUp class="size-4" />Z</Menubar.Shortcut
							>
						</Menubar.Item>
						<Menubar.Separator />
						<Menubar.Sub>
							<Menubar.SubTrigger>Find & Replace</Menubar.SubTrigger>
							<Menubar.SubContent class="w-48">
								<Menubar.Item onclick={handleFindReplace}>
									Find & Replace
									<Menubar.Shortcut class="flex items-center gap-1"
										><Command class="size-4" />F</Menubar.Shortcut
									>
								</Menubar.Item>
								<Menubar.Item onclick={handleFindNext}>
									Find Next
									<Menubar.Shortcut class="flex items-center gap-1"
										><Command class="size-4" />G</Menubar.Shortcut
									>
								</Menubar.Item>
								<Menubar.Item onclick={handleFindPrevious}>
									Find Previous
									<Menubar.Shortcut class="flex items-center gap-1"
										><Command class="size-4" /><ArrowBigUp class="size-4" />G</Menubar.Shortcut
									>
								</Menubar.Item>
							</Menubar.SubContent>
						</Menubar.Sub>
						<Menubar.Separator />
						<Menubar.Item onclick={handleCut}>
							Cut
							<Menubar.Shortcut class="flex items-center gap-1"
								><Command class="size-4" />X</Menubar.Shortcut
							>
						</Menubar.Item>
						<Menubar.Item onclick={handleCopy}>
							Copy
							<Menubar.Shortcut class="flex items-center gap-1"
								><Command class="size-4" />C</Menubar.Shortcut
							>
						</Menubar.Item>
						<Menubar.Item onclick={handlePaste}>
							Paste
							<Menubar.Shortcut class="flex items-center gap-1"
								><Command class="size-4" />V</Menubar.Shortcut
							>
						</Menubar.Item>
					</Menubar.Content>
				</Menubar.Menu>
			</Menubar.Root>
		</div>

		<div class="flex items-center">
			<EditableLabel initialText={$project.name} handleUpdateValueFn={handleProjectNameUpdate} />
		</div>

		<div class="hidden items-center gap-4 md:flex">
			<button
				class="cursor-pointer"
				onclick={() => (membersDialogOpen = true)}
				onkeydown={(e) => e.key === 'Enter' && (membersDialogOpen = true)}
			>
				<AvatarGroup.Root>
					{#each $onlineMembers.slice(0, 5) as member (member.username)}
						<AvatarGroup.Member class="size-8">
							<AvatarGroup.MemberImage src={member.avatar_url} alt={member.username} />
							<AvatarGroup.MemberFallback>
								{member.username[0]}
							</AvatarGroup.MemberFallback>
						</AvatarGroup.Member>
					{/each}
					{#if $onlineMembers.length > 5}
						<AvatarGroup.Etc class="size-8" plus={$onlineMembers.length - 5} />
					{/if}
				</AvatarGroup.Root>
			</button>

			<InviteButton {currentUser} projectId={$project.id} />
		</div>
	</header>

	<MembersDialog
		{currentUser}
		projectId={$project.id}
		open={membersDialogOpen}
		onOpenChange={(open) => (membersDialogOpen = open)}
	/>

	<ShareProjectDialog
		projectId={$project.id}
		{currentUser}
		project={$project}
		open={shareTemplateDialogOpen}
		onOpenChange={(open) => (shareTemplateDialogOpen = open)}
	/>

	<Resizable.PaneGroup direction="horizontal" autoSaveId="project">
		<Resizable.Pane defaultSize={50}>
			<div class="flex h-full flex-col">
				<!-- TODO make overflowed area float above editor -->
        <!-- TODO toggleable-toolbar from ./components/toggleable-toolbar.svelte -->
				{#if [FileType.MARKDOWN, FileType.TYPST, FileType.LATEX].includes(currentFileType) && $project.type !== 'template' && currentUser.permission !== UserPermissionEnum.Viewer && currentUser.permission !== UserPermissionEnum.NonMember}
					<div class="border-b p-1 flex justify-normal">
						<Button class="mr-1" onclick={formatMarkdown}>{currentFileType}</Button>
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Button class="mr-1" variant="ghost" size="icon" onclick={() => wrapSelection('bold')}>
									<Bold/>
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>
								Bold
							</Tooltip.Content>
						</Tooltip.Root>
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Button class="mr-1" variant="ghost" size="icon" onclick={() => wrapSelection('italic')}>
									<Italic/>
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>
								Italic
							</Tooltip.Content>
						</Tooltip.Root>
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Button class="mr-1" variant="ghost" size="icon" onclick={() => wrapSelection('strikethrough')}>
									<Underline/>
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>
								Underline
							</Tooltip.Content>
						</Tooltip.Root>
					</div>
				{/if}
				<div class="flex-1 overflow-auto">
					<Editor
						bind:docContent={docContent}
						bind:this={editorRef}
						username={data.currentUser.username}
						permission={data.currentUser.permission ?? UserPermissionEnum.Viewer}
					/>
				</div>
			</div>
		</Resizable.Pane>

		<Resizable.Handle />

		<Resizable.Pane defaultSize={50}>
			<Previewer docContent={docContent}/>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
