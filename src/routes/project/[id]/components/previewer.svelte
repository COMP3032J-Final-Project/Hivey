<script lang="ts">
  import { cn } from '$lib/utils.js';
  import MarkdownIt from 'markdown-it';
	import ExportButton from './button/export-button.svelte';
  import * as pdfjsLib from 'pdfjs-dist';
  import { currentFile } from './../store.svelte';
  import workerEntry from 'pdfjs-dist/build/pdf.worker.mjs?worker';
  import 'pdfjs-dist/web/pdf_viewer.css';
  import { EventBus, PDFViewer, PDFLinkService } from 'pdfjs-dist/web/pdf_viewer.mjs';

  let {
      docContent,
      class: className = '',
  }: {
      docContent: string,
      class?: string,
  } = $props();


  pdfjsLib.GlobalWorkerOptions.workerPort = new workerEntry();

  let container = $state<HTMLDivElement | null>(null);
  let viewer = $state<HTMLDivElement | null>(null);
  let pdfUrl = '/GroupProject.pdf';
  let pdfViewer = $state<PDFViewer | null>(null);
  let userScaled = $state(false);
    
  // Initialize MarkdownIt instance
  const markdownRender = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
  });
  let renenderedHTML = $state('');

  const zoomIn = () => {
      console.log('zoomIn() called');
      if (pdfViewer) {
          userScaled = true;
          const newScale = Math.min(pdfViewer.currentScale * 1.2, 3.0);
          pdfViewer.currentScale = newScale;
      }
  };

  const zoomOut = () => {
      console.log('zoomOut() called');
      if (pdfViewer) {
          userScaled = true;
          const newScale = Math.max(pdfViewer.currentScale / 1.2, 0.5);
          pdfViewer.currentScale = newScale;
      }
  };

  const renderPDF = async () => {
      console.log('renderPDF() called with rawContent:', $currentFile.rawData);
      try {
          // const loadingTask = pdfjsLib.getDocument(new Uint8Array($currentFile.rawData));
          const loadingTask = pdfjsLib.getDocument(pdfUrl);
          const pdfDoc = await loadingTask.promise;
          const eventBus = new EventBus();
          const linkService = new PDFLinkService({ eventBus });

          // 提前解包并判断 container 和 viewer
          const containerEl = container;
          const viewerEl = viewer;

          if (!containerEl || !viewerEl) {
              console.error("container or viewer is not ready");
              return;
          }

          pdfViewer = new PDFViewer({
              container: containerEl,
              viewer: viewerEl,
              eventBus,
              linkService,
          });

          linkService.setViewer(pdfViewer);
          pdfViewer.setDocument(pdfDoc);
          linkService.setDocument(pdfDoc, null);

          eventBus.on("pagesloaded", async () => {
              const page = await pdfDoc.getPage(1);
              const viewport = page.getViewport({ scale: 1.0 });

              // 查找已渲染的第一页
              const firstPageEl = viewerEl.querySelector('.page');
              if (firstPageEl && pdfViewer) {
                  const renderedPageWidth = firstPageEl.getBoundingClientRect().width;
                  const scale = (containerEl.clientWidth / renderedPageWidth) * 0.95;

                  pdfViewer.currentScale = scale;
                  // console.log('Applied scale based on rendered page:', scale);
                  // console.log('container:', containerEl.clientWidth, containerEl.scrollWidth);
                  // console.log('viewer:', viewerEl.clientWidth, viewerEl.scrollWidth);
              }
          });
      } catch (error) {
          console.error('Error rendering PDF:', error);
      }
  };

  $effect(() => {
      const filetype = $currentFile.filetype;
      if (!filetype) return;
      
      if (filetype === 'markdown') {
          renenderedHTML = markdownRender.render(docContent || '');
      } 
      else if (filetype === 'pdf') {
          renderPDF();
      }
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
{#if $currentFile.filetype === "pdf"}
  <button onclick={zoomIn} class="zoom-button" title="放大">+</button>
  <button onclick={zoomOut} class="zoom-button" title="缩小">-</button>
{/if}
<div class={cn("relative flex flex-col size-full shadow-inner group", className)}>
  <div class="absolute top-0 right-0 flex flex-row-reverse hidden group-hover:block z-index:100">
    <ExportButton />
  </div>
  {#if $currentFile.filetype === "md"}
    <div class="prose lg:prose-md overflow-y-auto p-2 break-words">
      {@html renenderedHTML}
    </div>
  {:else if $currentFile.filetype === 'pdf'}
    <div bind:this={container} class="documentContainer">
      <div bind:this={viewer} class="pdfViewer"></div>
    </div>
  {/if}
</div>
