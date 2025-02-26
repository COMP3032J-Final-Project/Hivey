<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { Button } from "$lib/components/ui/button/index";
    
	let { children } = $props();  
</script>

<div class="flex flex-col">
    <div class="min-h-screen bg-gradient-to-br from-primary to-primary/30 text-primary-foreground">
        <nav class="flex justify-between items-center p-6 px-8">
            <a href="/" class="text-3xl font-bold">{ m.app_name() }</a>
            
            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center gap-8">
                <div class="flex items-center gap-4 ml-8">
                    <Button href="/auth/signin" variant="link" class="text-primary-foreground">Sign in</Button>
                    <Button variant="secondary" href="/auth/signup" class="shadow">Sign up</Button>
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
            <section class="text-center px-7 py-14 max-w-4xl mx-auto">
                <h1 class="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                    One Editor, All Your Formats
                </h1>
                <p class="text-lg md:text-xl mb-8 opacity-90">
                    Collaborate in real-time while seamlessly previewing your work in Typst, LaTeX, or Markdown.
                </p>
                
                <div class="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 justify-center">
                    <Button size="lg" variant="secondary" href="/auth/signup">Sign up for free and try it now!</Button>
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
