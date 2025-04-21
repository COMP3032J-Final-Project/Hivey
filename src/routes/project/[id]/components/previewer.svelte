<script lang="ts">
  import { onMount } from 'svelte';
  import MarkdownIt from 'markdown-it';
	import ExportButton from './button/export-button.svelte';
  import * as pdfjsLib from 'pdfjs-dist';
  import { currentFile } from './../store.svelte';
  import workerEntry from 'pdfjs-dist/build/pdf.worker.mjs?worker';
  import 'pdfjs-dist/web/pdf_viewer.css';
  import { EventBus, PDFViewer, PDFLinkService, PDFFindController } from 'pdfjs-dist/web/pdf_viewer.mjs';

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
    const findController = new PDFFindController({ eventBus, linkService });
    const pdfViewer = new PDFViewer({
      container,      // 外层滚动容器
      viewer,         // 内层渲染节点
      eventBus,
      linkService,
      findController
    });
    linkService.setViewer(pdfViewer);
    pdfViewer.setDocument(pdfDoc);
    linkService.setDocument(pdfDoc, null);
    pdfViewer.currentScaleValue = 'page-width';
  } catch (error) {
    console.error('Error rendering PDF:', error);
  }
};

  let renenderedPDF = renderPDF(pdfUrl);

  onMount(async () => {
    if ($currentFile.filetype === 'pdf') {
      
    };
  });
</script>

<style>
  /* 父层必须 relative，否则下面 absolute 会相对 body 定位 */
  .wrapper { position: relative; width:100%; height:100%; }

  /* 外层滚动容器，PDFViewer 要求必须是 absolute */
  .documentContainer {
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    overflow-y: auto;
  }
  /* 内层渲染节点：所有 .page .textLayer 都挂到这里 */
  .pdfViewer {
    position: relative;
    display: block;       /* 保证是单列布局，避免横向排列 */
  }
</style>

<div class="wrapper">
  <div class="absolute top-0 right-0 flex flex-row-reverse hidden group-hover:block">
    <ExportButton />
  </div>
  <div bind:this={container} class="documentContainer">
    <div bind:this={viewer} class="pdfViewer"></div>
  </div>
</div>
