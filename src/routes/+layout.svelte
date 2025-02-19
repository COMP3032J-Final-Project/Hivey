<script lang="ts">
 import { i18n } from '$lib/i18n';
 import { ParaglideJS } from '@inlang/paraglide-sveltekit';
 import '../app.css';
 let { children } = $props();
 import { ProgressBar } from "@prgm/sveltekit-progress-bar";
</script>

<ProgressBar class="text-primary" />

<ParaglideJS {i18n}>
	  {@render children()}
</ParaglideJS>
