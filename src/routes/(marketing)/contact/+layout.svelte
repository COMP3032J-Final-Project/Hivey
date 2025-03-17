<script lang="ts">
    import Header from '../components/Header.svelte';
    import * as m from '$lib/paraglide/messages';
    let { children } = $props();
</script>

<Header />

<main class="flex-grow">
    <div class="max-w-4xl mx-auto px-6 md:px-8">
    {@render children()}
    </div>
</main>
