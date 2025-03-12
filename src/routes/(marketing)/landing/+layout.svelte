<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { Button } from "$lib/components/ui/button/index";
    import Header from '../components/Header.svelte';
    
    let { children } = $props();
</script>

<div class="bg-gradient-to-br from-primary/40 to-primary/20 text-primary-foreground">
    <Header />

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
                    {m.one_editor_all_formats()}
                </h1>
                <p class="text-lg md:text-xl mb-10 opacity-90 max-w-xl mx-auto">
                    {m.one_editor_all_formats_description()}
                </p>
                
                <div class="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 justify-center">
                    <Button size="lg" href="/auth/signup" class="font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8">
                        {m.sign_up_for_free()}
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </Button>
                    <Button size="lg" variant="outline" class="bg-transparent hover:bg-accent" href="/features">
                        {m.learn_more()}
                    </Button>
                </div>
            </div>
        </section>

        <!-- Editor Preview Section -->
        <section class="max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-24 relative z-0">
            <div class="bg-card rounded-xl shadow-2xl overflow-hidden border border-white/10">
                <img 
                    src="https://picsum.photos/1200/600" 
                    alt="Hivey Editor Interface"
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
        <h2 class="text-3xl md:text-4xl font-bold mb-6">{m.ready_to_streamline_your_document_workflow()}</h2>   
        <p class="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">{m.join_thousands_of_researchers_students_and_professionals()}</p>
        <Button size="lg" href="/auth/signup" class="font-medium shadow-lg text-lg px-8">
            {m.get_started_for_free()}
        </Button>
    </div>
</div>
