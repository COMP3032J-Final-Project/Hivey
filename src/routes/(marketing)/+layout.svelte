<script lang="ts">
    import Footer from './components/Footer.svelte';
    let { children } = $props();
</script>

<div class="flex flex-col min-h-screen">
    {@render children()}

    <Footer />
</div>
