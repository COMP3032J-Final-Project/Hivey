<script lang="ts">
	import {Button, buttonVariants} from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { FilePlus, Folder } from 'lucide-svelte';

	interface NavItem {
	title: string;
	url: string;
	icon?: any;
	isActive?: boolean;
	items?: NavItem[];
	}

	interface Data {
	navMain: NavItem[];
	}

	// Sample data
	const SampleData = {
		navMain: [
		{
			title: "Projects",
			url: "#",
			icon: Folder,
			isActive: true,
			items: [
			{
				title: "All",
				url: "#",
			},
			{
				title: "Mine",
				url: "#",
			},
			{
				title: "Shared with Me",
				url: "#",
			},],
		},
		{
			title: "Templates",
			url: "#",
			icon: Folder,
			items: [
			{
				title: "All",
				url: "#",
			},
			{
				title: "Mine",
				url: "#",
			},
			{
				title: "Shared with Me",
				url: "#",
			},
			{
				title: "Favourite",
				url: "#",
			},],
		}]
	};

	let value = $state("");

	const foldersData = [
		{ value: "", label: "root" },
		{ value: "Projects", label: "Projects" },
		{ value: "Templates", label: "Templates" }
	];

	const triggerContent = $derived(
		foldersData.find((folder) => folder.value === value)?.label ?? "选择文件夹"
	);

	const fileTypes = [
		{ value: "md", label: "md" },
		{ value: "tex", label: "tex" },
		{ value: "typ", label: "typ" }
	];
	let value1 = $state("");
 
	const triggerContent1 = $derived(
		fileTypes.find((f) => f.value === value)?.label ?? "选择文件类型"
	);

	const createFile = async (e: Event) => {
		console.log('Create file');
		e.preventDefault();
	};
</script>


<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "outline", size: "icon" })} aria-label="New File">
		<FilePlus class="w-5 h-5" /> 
	</Dialog.Trigger> 
    <Dialog.Content class="sm:max-w-[500px]">
		<Dialog.Header class="items-center">
			<Dialog.Title>Create new file</Dialog.Title>
			<Dialog.Description>
			Make changes to your profile here. Click save when you're done.
			</Dialog.Description>
		</Dialog.Header>
		<form onsubmit={createFile}>
			<div class="grid gap-4 py-4">
				<div class="flex items-center justify-center gap-4">
					<Label for="folder-select" class="text-right w-1/3">选择文件夹：</Label>
						<Select.Root type="single" name="folder" bind:value>
						<Select.Trigger id="folder-select" class="w-[180px]">
						{triggerContent}
						</Select.Trigger>
						<Select.Content>
						<Select.Group>
							{#each foldersData as folder}
							<Select.Item value={folder.value} label={folder.label}
								>{folder.label}</Select.Item
							>
							{/each}
						</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="flex items-center justify-center gap-4">
					<Label for="filename" class="text-right w-1/3">输入文件名：</Label>
					<Input id="filename" name="filename" value="" class="w-[180px]" />
				</div>
				<div class="flex items-center justify-center gap-4">
					<Label for="filetype" class="text-right w-1/3">选择文件类型：</Label>
					<Select.Root type="single" name="filetype" bind:value>
						<Select.Trigger id="filetype" class="w-[180px]">
						{triggerContent1}
						</Select.Trigger>
						<Select.Content>
						<Select.Group>
							{#each fileTypes as fileType}
							<Select.Item value={fileType.value} label={fileType.label}
								>{fileType.label}</Select.Item
							>
							{/each}
						</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Confirm</Button>
			</Dialog.Footer>
		</form>
    </Dialog.Content>
</Dialog.Root>

