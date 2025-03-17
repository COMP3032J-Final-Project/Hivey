<script lang="ts">
    import Header from '../components/Header.svelte';
    import * as m from '$lib/paraglide/messages';
    import * as Card from "$lib/components/ui/card/index.js";
    let { children } = $props();
</script>

<Header />

<main class="flex-grow">
    <div class="max-w-6xl mx-auto px-6 md:px-8">
        <h2 class="text-4xl font-semibold leading-none tracking-tight mb-8 text-center">{m.about_us()} - MGGA</h2>
        <!-- Company Vision and Business Cooperation Sections in side-by-side layout -->
        <div class="flex flex-col md:flex-row gap-8 mb-12">
            <!-- Company Vision Section -->
            <div class="flex-1">
                <Card.Root class="h-full">
                    <Card.Header>
                        <Card.Title class="text-center">{m.company_vision()}</Card.Title>
                    </Card.Header>
                    <Card.Content class="pt-6">
                        <p class="text-muted-foreground">
                            {m.company_vision_description()}
                        </p>
                    </Card.Content>
                </Card.Root>
            </div>
            
            <!-- Business Cooperation Section -->
            <div class="flex-1">
                <Card.Root class="h-full">
                    <Card.Header>
                        <Card.Title class="text-center">{m.business_cooperation()}</Card.Title>
                    </Card.Header>
                    <Card.Content class="pt-6">
                        <p class="text-muted-foreground">
                            {m.business_cooperation_description()}
                        </p>
                    </Card.Content>
                </Card.Root>
            </div>
    </div>

    {@render children()}
    </div>
</main>
