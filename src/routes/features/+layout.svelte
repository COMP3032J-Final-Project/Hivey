<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>

<div class="flex flex-col min-h-screen">
    <Header />
    
    <main class="flex-grow">
        <slot />
    </main>
    
    <Footer />
</div>
