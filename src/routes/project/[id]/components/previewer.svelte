<script lang="ts">
  import { cn } from '$lib/utils.js';
  import { onMount } from 'svelte';
  import MarkdownIt from 'markdown-it';
	import ExportButton from './button/export-button.svelte';
  import * as pdfjsLib from 'pdfjs-dist';
  import type {
    PDFDocumentLoadingTask,
    PDFDocumentProxy,
    PDFPageProxy,
  } from "pdfjs-dist/types/src/pdf";


  let {
      class: className = '',
      fileType = '',
      content = ''
  }: {
      class?: string,
      fileType: string,
      content: string
  } = $props();

  let canvas: HTMLCanvasElement;
    
  // Initialize MarkdownIt instance
  const markdownRender = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
  });

  let renenderedHTML = $derived(markdownRender.render(content))

  onMount(async () => {
    if (fileType === 'pdf') {
      // 渲染 PDF
      const loadingTask = pdfjsLib.getDocument({ data: content });
      const pdf: PDFDocumentProxy = await loadingTask.promise;
      const page: PDFPageProxy = await pdf.getPage(1); // 获取第一页

      const scale = 1.5; // 设置渲染比例
      const viewport = page.getViewport({ scale });

      const context = canvas.getContext('2d') as CanvasRenderingContext2D;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;
    }
  });
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
  {#if fileType === 'pdf'}
    <canvas bind:this={canvas}></canvas>
  {/if}
</div>
