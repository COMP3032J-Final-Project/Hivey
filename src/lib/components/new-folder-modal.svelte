<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import {Button, buttonVariants} from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { FolderPlus } from 'lucide-svelte';
	import type { NewFolder } from '$lib/types/editor';
	import { success, failure } from '$lib/components/ui/toast';

	let formData: NewFolder = {
		title: '',
	};

	const createFolder = async (e: Event) => {
		console.log('Create folder');

		e.preventDefault();

		const foldernameInput = document.getElementById('foldername') as HTMLInputElement;
		const foldername = foldernameInput.value.trim();

		try{
			if ( !foldername) {
				console.log('Please complete the form');
				throw new Error("Please complete the form");
			}
			else{
				formData = {
					title: foldername,
				};
				//TODO 接后端

				console.log(formData);
				success('Create file successfully');
				document.getElementById("dialog-close-btn")?.click();
			}
		} catch (error) {
			// 直接使用错误消息
			const errorMessage = (error as Error).message;
			failure(errorMessage || m.error_unknown());
		}
	};
</script>
   
<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "outline", size: "icon" })}>
		<FolderPlus class="w-5 h-5" />
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>New folder</Dialog.Title>
			<Dialog.Description>
			Input your new folder info here. Click save when you're done.
			</Dialog.Description>
	  	</Dialog.Header>
		<form onsubmit={createFolder}>
			<div class="grid gap-4 py-4">
				<div class="flex items-center justify-center gap-4">
					<Label for="foldername" class="text-right">输入名称：</Label>
					<Input id="foldername" name="foldername" value="" class="w-[180px]" />
				</div>
			</div>
		<Dialog.Footer>
			<Button type="submit">Confirm</Button>
			<Dialog.Close id="dialog-close-btn" class="hidden" />
		</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>