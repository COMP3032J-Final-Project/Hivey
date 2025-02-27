<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    let { children } = $props();
</script>

<div class="flex flex-col min-h-screen bg-gradient-to-br from-primary to-primary/30 text--foreground">
    <nav class="flex justify-between items-center p-6 px-8">
        <a href="/" class="text-3xl font-bold flex items-center gap-2">
            <enhanced:img class="w-12 h-12" src="$lib/images/logo.svg" alt="Logo" />
            <span>{ m.app_name() }</span>
        </a>
    </nav>
    
    <main class="flex flex-grow items-center justify-center p-6">
        <div class="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg">
            {@render children()}
        </div>
    </main>
</div>
