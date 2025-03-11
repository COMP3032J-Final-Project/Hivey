<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { Button } from "$lib/components/ui/button/index";
    import { fade } from 'svelte/transition';
    import { assets } from '$app/paths';
    import LanguageButton from "$lib/components/language-button.svelte";
    
    let mobileMenuOpen = $state(false);
    
    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }
</script>

<header class="relative z-10">
    <nav class="flex justify-between items-center p-6 px-8 max-w-7xl mx-auto">
        <a href="/" class="text-3xl font-bold flex items-center gap-2">
            <enhanced:img class="w-12 h-12" src="$lib/images/logo.svg" alt="Logo" />
            <span>{ m.app_name() }</span>
        </a>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
            <div class="flex items-center gap-4">
                <LanguageButton />
                <Button href="/auth/signin" variant="link" class="text-primary-foreground font-medium">{ m.sign_in() }</Button>
                <Button variant="secondary" href="/auth/signup" class="shadow-md hover:shadow-lg transition-all duration-300">{ m.sign_up() }</Button>
            </div>
        </div>

        <!-- Mobile Menu Button -->
        <button class="md:hidden focus:outline-none" on:click={toggleMobileMenu}>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-16 6h16"}/>
            </svg>
        </button>
    </nav>
    
    <!-- Mobile Menu -->
    {#if mobileMenuOpen}
        <div class="md:hidden px-8 pb-6 pt-2 bg-primary/90 absolute w-full" transition:fade={{ duration: 200 }}>
            <div class="flex flex-col space-y-4">
                <Button href="/auth/signin" variant="link" class="text-primary-foreground justify-start">{m.sign_in()}</Button>
                <Button variant="secondary" href="/auth/signup" class="shadow">{m.sign_up()}</Button>
            </div>
        </div>
    {/if}
</header> 