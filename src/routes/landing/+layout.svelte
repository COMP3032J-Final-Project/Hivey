<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { Button } from "$lib/components/ui/button/index";
    import { fade } from 'svelte/transition';
    import { assets } from '$app/paths';
    
    let { children } = $props();
    let mobileMenuOpen = $state(false);
    
    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }
</script>

<div class="flex flex-col min-h-screen">
    <!-- Hero Section with Gradient Background -->
    <div class="bg-gradient-to-br from-primary to-primary/30 text-primary-foreground">
        <header class="relative z-10">
            <nav class="flex justify-between items-center p-6 px-8 max-w-7xl mx-auto">
                <a href="/" class="text-3xl font-bold flex items-center gap-2">
                    <!-- Icon for logo - you can replace with your actual logo -->
                    <enhanced:img class="w-12 h-12" src="$lib/images/logo.svg" alt="Logo" />
                    <span>{ m.app_name() }</span>
                </a>
                
                <!-- Desktop Navigation -->
                <div class="hidden md:flex items-center gap-8">
                    <div class="flex items-center gap-4">
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
                        <Button href="/auth/signin" variant="link" class="text-primary-foreground justify-start">Sign in</Button>
                        <Button variant="secondary" href="/auth/signup" class="shadow">Sign up</Button>
                    </div>
                </div>
            {/if}
        </header>

        <main>
            <!-- Hero Content -->
            <section class="relative overflow-hidden">
                <!--
                Decorative Elements
                <div class="absolute top-20 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div class="absolute bottom-10 left-10 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>
                -->
                
                <div class="text-center px-7 py-14 md:py-20 max-w-4xl mx-auto relative z-0">
                    <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        One Editor, <span class="text-secondary-foreground">All Your Formats</span>
                    </h1>
                    <p class="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                        Collaborate in real-time while seamlessly previewing your work in Typst, LaTeX, or Markdown.
                    </p>
                    
                    <div class="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 justify-center">
                        <Button size="lg" variant="secondary" href="/auth/signup" class="font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8">
                            Sign up for free
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </Button>
                        <Button size="lg" variant="outline" class="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                            Learn more
                        </Button>
                    </div>
                </div>
            </section>

            <!-- Editor Preview Section -->
            <section class="max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-24 relative z-0">
                <div class="bg-card rounded-xl shadow-2xl overflow-hidden border border-white/10">
                    <!-- Replace this with an actual editor mockup image of SyncE -->
                    <img 
                        src="https://picsum.photos/1200/600" 
                        alt="SyncE Editor Interface"
                        class="w-full">
                    <!--
                    <div class="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none"></div>
                    -->
                </div>
            </section>
        </main>
    </div>
    
    {@render children()}
    
    
    <!-- CTA Section -->
    <div class="bg-primary/10 py-16 md:py-20">
        <div class="max-w-5xl mx-auto px-6 md:px-8 text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to streamline your document workflow?</h2>
            <p class="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">Join thousands of researchers, students, and professionals who are already using SyncE.</p>
            <Button size="lg" href="/auth/signup" class="font-medium shadow-lg text-lg px-8">
                Get started for free
            </Button>
        </div>
    </div>
    
    <!-- Footer -->
    <footer class="bg-muted py-12">
        <div class="max-w-7xl mx-auto px-6 md:px-8">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="mb-6 md:mb-0">
                    <a href="/" class="text-xl font-bold flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        { m.app_name() }
                    </a>
                    <p class="mt-2 text-sm text-muted-foreground">The collaborative editor for all your document formats.</p>
                </div>
                
                <div class="flex gap-6">
                    <a href="/about" class="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
                    <a href="/features" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
                    <a href="/pricing" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
                    <a href="/contact" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
                </div>
            </div>
            
            <div class="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
                <p class="text-sm text-muted-foreground">Â© {new Date().getFullYear()} { m.app_name() }. All rights reserved.</p>
                <div class="flex gap-4 mt-4 md:mt-0">
                    <a href="/terms" class="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</a>
                    <a href="/privacy" class="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
                </div>
            </div>
        </div>
    </footer>    
</div>
