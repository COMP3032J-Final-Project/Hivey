<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  export let title: string;
  export let description: string | undefined = undefined;
  export let duration = 2000;
  export let show = false;

  const dispatch = createEventDispatcher();

  let timeout: number;

  $: if (show) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      show = false;
      dispatch('close');
    }, duration) as unknown as number;
  }
</script>

{#if show}
  <div
    role="alert"
    class="fixed top-4 right-4 z-50 w-[420px] bg-background border rounded-lg shadow-lg"
    transition:fly={{ y: -20, duration: 200 }}
    on:mouseenter={() => clearTimeout(timeout)}
    on:mouseleave={() => {
      timeout = setTimeout(() => {
        show = false;
        dispatch('close');
      }, duration) as unknown as number;
    }}
  >
    <div class="p-4">
      <div class="flex items-start gap-3">
        <div class="flex-1">
          <h3 class="font-medium">{title}</h3>
          {#if description}
            <p class="text-sm text-muted-foreground mt-1">{description}</p>
          {/if}
        </div>
        <button
          aria-label="Close notification"
          class="text-muted-foreground hover:text-foreground"
          on:click={() => {
            show = false;
            dispatch('close');
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>
{/if} 
