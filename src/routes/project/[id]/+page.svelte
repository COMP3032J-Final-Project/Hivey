<script lang="ts">
	import * as Menubar from '$lib/components/ui/menubar';
	import { Button } from '$lib/components/ui/button';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import * as AvatarGroup from '$lib/components/ui/avatar-group';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import Editor from '$lib/components/editor.svelte';
	import Previewer from '$lib/components/previewer.svelte';
	import InviteButton from './components/button/invite-button.svelte';
	import Exportbutton from './components/button/export-button.svelte';
	import MembersDialog from './components/members-dialog.svelte';
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Underline from '@lucide/svelte/icons/underline';
	import { updateProject } from '$lib/api/dashboard';
	import { success, failure } from '$lib/components/ui/toast';
	import type { Project } from '$lib/types/dashboard';
	import type { PageProps } from './$types';
	import { type User, UserPermissionEnum } from '$lib/types/auth';
	import { getContext, onMount } from 'svelte';
	import type { EditorFileInfo } from '$lib/types/editor';
	import EditableLabel from '$lib/components/ui/editable-label';
	import { members } from './store.svelte';
	import type { WebSocketClient } from '$lib/api/websocket';

	let { data, wsClient }: PageProps & { wsClient?: WebSocketClient | null } = $props();

	let project: Project = $state(data.project);
	let currentUser: User = $state(data.currentUser);
	let membersDialogOpen = $state(false);

	let docContent = $state('');
	let currentFileType = $state('Format');
	const { currentFileType: fileTypeFromContext, docContent: docContentStore } =
		getContext<EditorFileInfo>('editor-context');
	fileTypeFromContext.subscribe((value) => {
		currentFileType = value;
		console.log('[Page] currentFileType updated to:', currentFileType);
	});
	docContentStore?.subscribe((value) => {
		docContent = value;
		console.log('[Page] File content set to:', docContent);
	});

	function formatMarkdown() {
		//TODO Implement markdown formatting logic here
		console.log('Format markdown');
	}

	async function handleProjectNameUpdate(projectName: string) {
		try {
			const updatedProject = await updateProject({
				id: project.id,
				name: projectName
			});
			project.name = updatedProject.name;
			success('Project name modified success');
			return projectName;
		} catch (error) {
			failure('Project name modified failed');
			return null;
		}
	}

	let editorRef: Editor;
	let value: string[] = $state([]);
	let isBold = $state(false);

	function checkSelection() {
		if (editorRef) {
			isBold = editorRef.hasSurroundingSymbols('**', '**');
			value = [];
			if (isBold) {
				value.push('bold');
			}
		}
	}

	function wrapSelection(value: string) {
		if (editorRef) {
			if (value === 'bold') {
				if (isBold) {
					editorRef.unwrapSelection('**', '**');
					isBold = false;
					console.log('Unwrap selection');
				} else {
					editorRef.wrapSelection('**', '**');
					isBold = true;
				}
			}
		}
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
					<Menubar.Trigger>Edit</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Item>
							Find & Replace
							<Menubar.Shortcut>Ctrl+F</Menubar.Shortcut>
						</Menubar.Item>
					</Menubar.Content>
				</Menubar.Menu>
			</Menubar.Root>
		</div>

		<div class="flex items-center">
			<EditableLabel initialText={project.name} handleUpdateValueFn={handleProjectNameUpdate} />
		</div>

		<div class="hidden items-center gap-4 md:flex">
			<button
				class="cursor-pointer"
				onclick={() => (membersDialogOpen = true)}
				onkeydown={(e) => e.key === 'Enter' && (membersDialogOpen = true)}
			>
				<AvatarGroup.Root>
					{#each $members.slice(0, 3) as member (member.username)}
						<AvatarGroup.Member class="size-8">
							<AvatarGroup.MemberImage src={member.avatar} alt={member.username} />
							<AvatarGroup.MemberFallback>
								{member.username[0]}
							</AvatarGroup.MemberFallback>
						</AvatarGroup.Member>
					{/each}
					{#if $members.length > 3}
						<AvatarGroup.Etc class="size-8" plus={$members.length - 3} />
					{/if}
				</AvatarGroup.Root>
			</button>

			<InviteButton {currentUser} projectId={project.id} />
		</div>
	</header>

	<MembersDialog
		{currentUser}
		projectId={project.id}
		open={membersDialogOpen}
		onOpenChange={(open) => (membersDialogOpen = open)}
	/>

	<Resizable.PaneGroup direction="horizontal" autoSaveId="project">
		<Resizable.Pane defaultSize={50}>
			<div class="flex h-full flex-col">
				<div class="flex items-center space-x-2 border-b p-1">
					<Button size="sm" onclick={formatMarkdown}>{currentFileType}</Button>
					<ToggleGroup.Root type="multiple" bind:value>
						<ToggleGroup.Item
							value="bold"
							aria-label="Toggle bold"
							onclick={() => wrapSelection('bold')}
						>
							<Bold class="size-4 p-0" />
						</ToggleGroup.Item>
						<ToggleGroup.Item value="italic" aria-label="Toggle italic">
							<Italic class="size-4 p-0" />
						</ToggleGroup.Item>
						<ToggleGroup.Item value="strikethrough" aria-label="Toggle strikethrough">
							<Underline class="size-4 p-0" />
						</ToggleGroup.Item>
					</ToggleGroup.Root>
				</div>
				<div class="flex-1">
					<Editor
						bind:value={docContent}
						bind:this={editorRef}
						username={data.currentUser.username}
						project_id={data.project.id}
						access_token={data.authInfo.access_token}
						permission={data.currentUser.permission ?? UserPermissionEnum.Viewer}
						{wsClient}
					/>
				</div>
			</div>
		</Resizable.Pane>

		<Resizable.Handle />

		<Resizable.Pane defaultSize={50}>
			<div class="flex h-full flex-1 flex-col">
				<div class="border-b p-1">
					<div class="flex items-center justify-between">
						<div class="flex">
							<p class="flex h-10 items-center justify-center p-3">Preview</p>
						</div>
						<div class="flex">
							<Exportbutton />
						</div>
					</div>
				</div>
				<div class="flex-1 overflow-y-auto">
					<Previewer fileType="markdown" content={docContent} />
				</div>
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
