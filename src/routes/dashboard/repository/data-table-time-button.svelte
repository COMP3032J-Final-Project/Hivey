<script lang="ts">
	import ArrowUpDown from '@lucide/svelte/icons/arrow-up-down';
	import { Button } from '$lib/components/ui/button/index.js';

	export let label = 'Time';
	export let onClick = () => {};
</script>

<div class="flex items-center justify-end">
	<span class="mr-2 font-medium">{label}</span>
	<Button variant="ghost" size="icon" class="h-8 w-8 p-0" onclick={onClick}>
		<ArrowUpDown class="h-4 w-4" />
	</Button>
</div>
