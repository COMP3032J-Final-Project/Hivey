<script lang="ts">
  import { cn } from '$lib/utils.js';
  import MarkdownIt from 'markdown-it';
	import ExportButton from './button/export-button.svelte';

  let {
      class: className = '',
      fileType = '',
      content = ''
  }: {
      class?: string,
      fileType: string,
      content: string
  } = $props();
    
  // Initialize MarkdownIt instance
  const markdownRender = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
  });

  let renenderedHTML = $derived(markdownRender.render(content))
</script>

<div class={cn("relative flex flex-col size-full shadow-inner group", className)}>
  <div class="absolute top-0 right-0 flex flex-row-reverse hidden group-hover:block">
    <ExportButton />
  </div>
  {#if fileType === "markdown"}
    <div class="prose lg:prose-md overflow-y-auto p-2 break-words">
      {@html renenderedHTML}
    </div>
  {/if}
</div>
