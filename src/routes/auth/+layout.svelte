<script lang="ts">
  import LanguageButton from "$lib/components/language-button.svelte";
  import { m } from '$lib/trans';
  import { localizeHref } from '$lib/paraglide/runtime';
  let { children } = $props();
</script>

<div class="flex flex-col min-h-screen bg-gradient-to-br from-primary/40 to-primary/20 text--foreground">
  <nav class="flex justify-between items-center p-6 px-8">
    <a href={localizeHref("/landing")} class="text-3xl font-bold flex items-center gap-2">
      <enhanced:img class="w-12 h-12" src="$lib/images/logo.svg" alt="Logo" />
      <span>{ m.app_name() }</span>
    </a>
    <LanguageButton />
  </nav>
    
  <main class="flex flex-grow items-center justify-center">
    {@render children()}
  </main>
</div>
