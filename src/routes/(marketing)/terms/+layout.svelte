<script lang="ts">
    import Header from '../components/Header.svelte';
    let { children } = $props();
</script>

<Header />

<div class="max-w-5xl mx-auto px-6 md:px-8">
    {@render children()}
</div>
