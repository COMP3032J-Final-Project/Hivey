<script lang="ts">
  import { SvelteToast } from '@zerodevx/svelte-toast';
  
  // 自定义toast选项
  const options = {
    // 设置toast显示在顶部中间
    position: 'top-center',
    // 设置toast显示时间为3秒
    duration: 3000,
    // 设置toast样式
    style: `
      min-width: 280px;
      padding: 14px 18px;
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06);
      font-weight: 500;
      text-align: center;
      backdrop-filter: blur(8px);
    `
  };
</script>

<SvelteToast {options} />

<style>
  /* 自定义全局toast样式 */
  :global(._toastContainer) {
    --toastContainerTop: 1.5rem !important;
    --toastContainerRight: auto !important;
    --toastContainerBottom: auto !important;
    --toastContainerLeft: 50% !important;
    transform: translateX(-50%) !important;
    z-index: 9999 !important;
  }
  
  :global(._toastItem) {
    width: auto !important;
    min-width: 280px !important;
    max-width: 380px !important;
    margin-bottom: 0.75rem !important;
    border-left: 4px solid var(--toastBarBackground, transparent) !important;
    transition: transform 0.2s ease-out !important;
    animation: toast-in 0.3s ease-out !important;
  }
  
  :global(._toastItem:hover) {
    transform: translateY(-3px) !important;
  }
  
  :global(._toastMsg) {
    font-size: 0.95rem !important;
    line-height: 1.4 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  :global(._toastBar) {
    height: 4px !important;
    border-radius: 0 0 4px 4px !important;
  }
  
  :global(._toastBtn) {
    opacity: 0.7 !important;
    transition: opacity 0.2s !important;
  }
  
  :global(._toastBtn:hover) {
    opacity: 1 !important;
  }
  
  @keyframes toast-in {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style> 