<script lang="ts">
  let {
      offset = $bindable(),
      class: className = "",
  }: {
      offset: {
          x: number,
          y: number,
      },
      class: string
  } = $props();

  let startX: number;
  let startY: number;
  
  function onMounseDown(event: MouseEvent) {
      startX = event.clientX;
      startY = event.clientY;
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      
      // Prevent text selection during drag
      document.body.style.userSelect = 'none';
  }

  function onMouseMove(event: MouseEvent) {
      offset.x = event.clientX - startX;
      offset.y = event.clientY - startY;
  }

  function onMouseUp(_event: MouseEvent) {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.userSelect = '';
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class={className}
  onmousedown={onMounseDown}
  role="separator"
></div>
