import { toast } from '@zerodevx/svelte-toast';

/**
 * 显示成功提示的toast
 * @param message 提示消息
 */
export function success(message: string): void {
  toast.push(`<span style="display: flex; align-items: center; gap: 8px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    ${message}
  </span>`, {
    theme: {
      '--toastBackground': 'rgba(72, 187, 120, 0.95)',
      '--toastColor': 'white',
      '--toastBarBackground': '#2F855A',
      '--toastBorderRadius': '12px',
      '--toastBoxShadow': '0 8px 16px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)'
    },
    duration: 3000,
  });
}

/**
 * 显示失败提示的toast
 * @param message 提示消息
 */
export function failure(message: string): void {
  toast.push(`<span style="display: flex; align-items: center; gap: 8px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
    ${message}
  </span>`, {
    theme: {
      '--toastBackground': 'rgba(245, 101, 101, 0.95)',
      '--toastColor': 'white',
      '--toastBarBackground': '#C53030',
      '--toastBorderRadius': '12px',
      '--toastBoxShadow': '0 8px 16px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)'
    },
    duration: 3000,
  });
}

/**
 * 显示通知提示的toast
 * @param message 提示消息
 */
export function notification(message: string): void {
  toast.push(`<span style="display: flex; align-items: center; gap: 8px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
    ${message}
  </span>`, {
    theme: {
      '--toastBackground': 'rgba(237, 137, 54, 0.95)',
      '--toastColor': 'white',
      '--toastBarBackground': '#C05621',
      '--toastBorderRadius': '12px',
      '--toastBoxShadow': '0 8px 16px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)'
    },
    duration: 3000,
  });
} 
