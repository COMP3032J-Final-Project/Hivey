<script lang="ts">
  import { cn } from '$lib/utils.js';
  import { onMount } from 'svelte';
  import MarkdownIt from 'markdown-it';
	import ExportButton from './button/export-button.svelte';
  import * as pdfjsLib from 'pdfjs-dist';
  import { currentFile } from './../store.svelte';
  import workerEntry from 'pdfjs-dist/build/pdf.worker.mjs?worker';

  pdfjsLib.GlobalWorkerOptions.workerPort = new workerEntry();

  let {
      class: className = '',
  }: {
      class?: string,
  } = $props();

  let canvas: HTMLCanvasElement;
  let pdfUrl = '/GroupProject.pdf';
    
  // Initialize MarkdownIt instance
  const markdownRender = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
  });

  let renenderedHTML = markdownRender.render($currentFile.fileContent || '');

  // Function to render PDF
  const renderPDF = async (url: string) =>{
    try {
      const loadingTask = pdfjsLib.getDocument(url);
      console.log('🔗 Loading PDF from URL:', url);
      const pdf = await loadingTask.promise;
      console.log('✅ PDF loaded:', pdf);
      
      // 获取第一页
      const page = await pdf.getPage(1);
      console.log('📄 Page 1 loaded:', page);
      const viewport = page.getViewport({ scale: 1.0 });
      console.log('📐 Viewport:', viewport);
      
      // 设置 canvas 尺寸
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Failed to get canvas 2D context');
      }
      // 渲染 PDF 页面
      console.log('🖌️ Starting to render PDF page');
      await page.render({
        canvasContext: context,
        viewport,
      }).promise;
      console.log('✅ PDF page rendered successfully');
    } catch (error) {
      console.error('Error rendering PDF:', error);
    }
  }

  let renenderedPDF = renderPDF(pdfUrl);

  onMount(async () => {
    if ($currentFile.filetype === 'pdf') {
      
    };
  });
</script>

<div class={cn("relative flex flex-col size-full shadow-inner group", className)}>
  <div class="absolute top-0 right-0 flex flex-row-reverse hidden group-hover:block">
    <ExportButton />
  </div>
  <canvas bind:this={canvas}></canvas>
</div>
