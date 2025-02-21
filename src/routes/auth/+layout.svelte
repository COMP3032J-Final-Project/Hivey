<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    let { children } = $props();
</script>

<div class="flex flex-col min-h-screen bg-gradient-to-br from-primary to-primary/30 text-white">
    <nav class="flex justify-between items-center p-6 px-8">
        <a href="/" class="text-3xl font-bold text-white">{ m.app_name() }</a>
    </nav>

    <main class="flex flex-grow items-center justify-center p-6">
        <div class="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg">
            {@render children()}
        </div>
    </main>
</div>
