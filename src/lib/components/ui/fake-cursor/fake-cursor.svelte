<script lang="ts">
    import { cn } from '$lib/utils';

    let {
        left = 100,
        top = 100,
        class: className = "",
        color = "black",
        scale = 1,
        children,
    }: {
        left: number,
        top: number,
        class?: string,
        color?: string,
        scale?: number,
        children?: any
    } = $props();

    let triangleSize = $derived(0.75 * scale);
    let pointerOffset = $derived(-0.4 * scale);
    let bodySize = $derived(1.6 * scale);
</script>

<div class={cn("fixed pointer-events-none z-50", className)} style="left: {left}px; top: {top}px;">
    <!-- Triangle pointer part -->
    <div 
        class="absolute border-solid border-l-transparent border-r-transparent -rotate-45"
        style="
        top: {pointerOffset}rem; 
        left: {pointerOffset}rem;
        border-left-width: {triangleSize}rem;
        border-right-width: {triangleSize}rem;
        border-bottom-width: {2 * triangleSize}rem;
        width: 0;
        height: 0;
        border-bottom-color: {color};
        "
    ></div>
    
    <!-- Circle part with avatar -->
    <div 
        class="relative bg-white rounded-full border-2 overflow-hidden"
        style="
        width: {bodySize}rem;
        height: {bodySize}rem;
        border-color: {color};
        "
    >
        {@render children?.()}
    </div>
</div>
