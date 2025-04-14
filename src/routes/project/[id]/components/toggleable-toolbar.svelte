<script lang="ts">
  import { cn } from '$lib/utils.js';
  import type { Snippet } from 'svelte';
  import { ChevronDown, ChevronLeft } from 'lucide-svelte';
  import { onMount, onDestroy } from 'svelte';
	import { Button } from '$lib/components/ui/button';
  
  let {
      children,
      buttonMarginLeft = 2,
      gap = 8,
      class: className = "",
      firstLineClass = "",
      overflowAreaClass = ""
  }: {
      children: Snippet,
      buttonMarginLeft?: number,
      gap?: number,
      class?: string,
      firstLineClass?: string,
      overflowAreaClass?: string
  } = $props();

  let toolbarHeaderElem: HTMLElement;
  let visibleItemsContainerElem: HTMLElement;
  let overflowItemsContainerElem: HTMLElement;
  let childrenElemsContainerElem: HTMLElement;
  let toggleBtnElem: HTMLElement;

  let hasOverflow = $state(false);
  let isExpanded= $state(false);

  let prevFirstOverflowItemIndex: number;
  let allItems: Array<Element>;

  function layoutToolbarItems() {
      const headerContentWidth = toolbarHeaderElem.clientWidth;
      
      const buttonRect = toggleBtnElem.getBoundingClientRect();
      const safeButtonWidth = buttonRect.width > 0 ? buttonRect.width : 35;
      const buttonTotalWidth = safeButtonWidth + buttonMarginLeft;

      const availableWidth = headerContentWidth - buttonTotalWidth;

      let currentWidth = 0;
      let firstOverflowItemIndex = -1;

      for (let i = 0; i < allItems.length; i++ ) {
          const item = allItems[i];
          const tempItem = item.cloneNode(true) as HTMLElement;
          visibleItemsContainerElem.appendChild(tempItem);
          const itemWidth = tempItem.getBoundingClientRect().width;
          visibleItemsContainerElem.removeChild(tempItem);

          const widthWithGap = (currentWidth > 0) ? itemWidth + gap : itemWidth;
          
          if (itemWidth > 0) {
              if (currentWidth + widthWithGap <= availableWidth) {
                  currentWidth += widthWithGap;
              } else {
                  firstOverflowItemIndex = i;
                  // NOTE we set hasOverflow later
                  break;
              }
          }
      }

      if (firstOverflowItemIndex !== prevFirstOverflowItemIndex) {
          prevFirstOverflowItemIndex = firstOverflowItemIndex;
          hasOverflow = firstOverflowItemIndex !== -1 ? true : false;

          visibleItemsContainerElem.replaceChildren();
          overflowItemsContainerElem.replaceChildren();
          
          allItems.forEach((item, index) => {
              const itemClone = item.cloneNode(true);
              if (firstOverflowItemIndex === -1 || index < firstOverflowItemIndex) {
                  visibleItemsContainerElem.appendChild(itemClone);
              } else {
                  overflowItemsContainerElem.appendChild(itemClone);
              }
          });
      }
  }

  function handleToggleBtnClick() {
      isExpanded = !isExpanded;
      overflowItemsContainerElem.classList.toggle('hidden', !isExpanded);
  }
  
  const observer = new ResizeObserver(_ => {
      layoutToolbarItems();
  });

  onMount(() => {
      toggleBtnElem = toolbarHeaderElem.children[1] as HTMLElement;
      overflowItemsContainerElem.classList.toggle('hidden', !isExpanded);
      allItems = Array.from(childrenElemsContainerElem.children);
      layoutToolbarItems();

      observer.observe(toolbarHeaderElem);
  });

  onDestroy(() => {
      observer.disconnect();
  });
</script>

<div class={cn("w-full", className)}>
  <div bind:this={toolbarHeaderElem} class="w-full flex items-center flex-nowrap overflow-hidden">
    <div bind:this={visibleItemsContainerElem}
      class={cn("w-full flex items-center flex-nowrap", firstLineClass)}
      style="gap: {gap}px;">
    </div>
    <Button
      variant="ghost" size="icon"
      class={"rounded-full " + (hasOverflow ? "" : "hidden")}
      onclick={handleToggleBtnClick}
      style="margin-left: {buttonMarginLeft}px;">
      {#if isExpanded}
        <ChevronDown />
      {:else}
        <ChevronLeft />
      {/if}
    </Button>
  </div>
  <div bind:this={overflowItemsContainerElem}
    class={cn("w-full flex items-center flex-wrap", overflowAreaClass)}
    style="gap: {gap}px;" >
  </div>
</div>

<div bind:this={childrenElemsContainerElem} class="hidden">
  {@render children()}
</div>


