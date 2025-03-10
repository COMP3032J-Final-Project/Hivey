<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let width: number;
    export let minWidth: number;
    export let maxWidth: number;
    export let resizeFrom: 'left' | 'right' = 'right';

    const dispatch = createEventDispatcher<{
        resize: number;
    }>();

    let isDragging = false;
    let startX = 0;
    let startWidth = 0;

    function startDrag(e: MouseEvent) {
        isDragging = true;
        startX = e.clientX;
        startWidth = width;
        window.addEventListener('mousemove', handleDrag);
        window.addEventListener('mouseup', stopDrag);
    }

    function handleDrag(e: MouseEvent) {
        if (!isDragging) return;
        
        const delta = resizeFrom === 'right' 
            ? e.clientX - startX 
            : startX - e.clientX;
            
        const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth + delta));
        dispatch('resize', newWidth);
    }

    function stopDrag() {
        isDragging = false;
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', stopDrag);
    }
</script>

<div class="relative" style="width: {width}px">
    <slot></slot>
    <div 
        class="absolute top-0 {resizeFrom === 'right' ? 'right-[-2px]' : 'left-[-2px]'} w-1 h-full bg-gray-200 hover:bg-gray-300 cursor-col-resize" 
        on:mousedown={startDrag}
    />
</div>
