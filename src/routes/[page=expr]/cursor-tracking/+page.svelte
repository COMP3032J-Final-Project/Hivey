<script lang="ts">
    import { onMount } from 'svelte';
    import { throttle } from '$lib/utils';

    onMount(() => {
        const fn = () => console.log("hi");

        const [throttledFn, cancel] = throttle(fn, 200);

        throttledFn();
        setTimeout(throttledFn, 500);
    })
</script>
