<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { Button } from "$lib/components/ui/button/index";
    
	  let { children } = $props();
</script>

<div class="flex flex-col">
    <div class="min-h-screen bg-gradient-to-br from-primary to-primary/60 text-white">
        <nav class="flex justify-between items-center p-6 px-8">
            <a href="/" class="text-3xl font-bold text-white">{ m.app_name() }</a>
            
            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center gap-8">
                <div class="flex items-center gap-4 ml-8">
                    <Button href="#signin">Sign in</Button>
                    <Button variant="secondary" href="#signup">Sign up</Button>
                </div>
            </div>

            <!-- Mobile Menu Button -->
            <button class="md:hidden">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-16 6h16"/>
                </svg>
            </button>
        </nav>

        <main>
            <section class="text-center px-8 py-16 max-w-4xl mx-auto">
                <h1 class="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    Compose papers faster
                </h1>
                <p class="text-lg md:text-xl mb-8 opacity-90">
                    Focus on your text and let Typst take care of layout and formatting.
                </p>
                
                <div class="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 justify-center">
                    <a href="#signup" class="bg-white text-black px-6 py-3 rounded font-medium hover:opacity-90 transition-opacity">
                        Sign up for free and try it now!
                    </a>
                    <a href="https://github.com/typst/typst" 
                        class="border-2 border-white px-6 py-3 rounded font-medium hover:opacity-90 transition-opacity">
                        View on GitHub
                    </a>
                </div>
            </section>

            <section class="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                <img src="https://picsum.photos/1200/600" 
                    alt="Typst Editor Interface"
                    class="w-full rounded-lg shadow-xl">
            </section>
        </main>
        
    </div>
    <div class="flex flex-col bg-secondary">
        {@render children()}
    </div>
</div>
