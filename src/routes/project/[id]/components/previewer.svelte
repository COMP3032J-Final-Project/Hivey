<script lang="ts">
  import { cn } from '$lib/utils.js';
  import { onMount } from 'svelte';
  import MarkdownIt from 'markdown-it';
	import ExportButton from './button/export-button.svelte';
  import * as pdfjsLib from 'pdfjs-dist';
  import { currentFile } from './../store.svelte';
  import workerEntry from 'pdfjs-dist/build/pdf.worker.mjs?worker';
  import 'pdfjs-dist/web/pdf_viewer.css';
  import { EventBus, PDFViewer, PDFLinkService } from 'pdfjs-dist/web/pdf_viewer.mjs';

  let {
      class: className = '',
  }: {
      class?: string,
  } = $props();


  pdfjsLib.GlobalWorkerOptions.workerPort = new workerEntry();

  let container: HTMLDivElement;
  let viewer: HTMLDivElement;
  let pdfUrl = '/GroupProject.pdf';
    
  // Initialize MarkdownIt instance
  const markdownRender = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
  });

  let renenderedHTML = markdownRender.render($currentFile.fileContent || '');

  // Function to render PDF
  const renderPDF = async (url: string) => {
  console.log('🚀 renderPDF() called with URL:', url);
  try {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdfDoc = await loadingTask.promise;
    const eventBus = new EventBus();
    const linkService = new PDFLinkService({ eventBus });
    const pdfViewer = new PDFViewer({
      container,      // 外层滚动容器
      viewer,         // 内层渲染节点
      eventBus,
      linkService,
    });
    linkService.setViewer(pdfViewer);
    pdfViewer.setDocument(pdfDoc);
    linkService.setDocument(pdfDoc, null);
    eventBus.on("pagesloaded", async () => {
      const page = await pdfDoc.getPage(1);
      const viewport = page.getViewport({ scale: 1.0 });

      // 尝试读取渲染后的页面宽度
      const firstPageEl = viewer.querySelector('.page');
      if (firstPageEl) {
        const renderedPageWidth = firstPageEl.getBoundingClientRect().width;
        const scale = (container.clientWidth / renderedPageWidth) * 0.95;

        pdfViewer.currentScale = scale;

        console.log('✅ Applied scale based on rendered page:', scale);
        console.log('container:', container.clientWidth, container.scrollWidth);
        console.log('viewer:', viewer.clientWidth, viewer.scrollWidth);
      }
    });
  } catch (error) {
    console.error('Error rendering PDF:', error);
  }
};

  let renenderedPDF = renderPDF(pdfUrl);

  setTimeout(() => {
    console.log('container:', container.clientWidth, container.scrollWidth);
    console.log('viewer:', viewer.clientWidth, viewer.scrollWidth);
  }, 1000);


  onMount(async () => {
    if ($currentFile.filetype === 'pdf') {
      
    };
  });
</script>

<style>
  .documentContainer {
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    overflow-y: auto;
    width: 100%;
    height: 100%;
  }

  .pdfViewer {
    position: relative;
    display: block;
    width: 100% !important;
  }
</style>

<div class={cn("relative flex flex-col size-full shadow-inner group", className)}>
  <div class="absolute top-0 right-0 flex flex-row-reverse hidden group-hover:block">
    <ExportButton />
  </div>
  <div bind:this={container} class="documentContainer">
    <div bind:this={viewer} class="pdfViewer"></div>
  </div>
</div>
