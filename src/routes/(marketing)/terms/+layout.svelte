<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import Header from '../components/Header.svelte';
    let { children } = $props();
    let mobileMenuOpen = $state(false);
    
    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }
</script>

<Header />

<div class="max-w-5xl mx-auto px-6 md:px-8">
    {@render children()}
</div>
