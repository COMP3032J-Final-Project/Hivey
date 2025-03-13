<script lang="ts">
  import { cn } from "$lib/utils.js";
  import { getContext } from "svelte";

  let {
    class: className = "",
    value = $bindable(""),
    ...props
  } = $props();

  export { value as value };
</script>

<textarea
  class={cn(
    "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    className
  )}
  bind:value
  {...props}
/> 