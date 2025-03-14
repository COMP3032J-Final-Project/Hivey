<script lang="ts">
    import { onMount } from 'svelte';
    import { throttle } from '$lib/utils';
    import FakeCursor from '$lib/components/ui/fake-cursor';
    let left = 100;
    let top = 100;

    onMount(() => {
        const fn = () => console.log("hi");

        const [throttledFn, cancel] = throttle(fn, 200);

        throttledFn();
        setTimeout(throttledFn, 500);

        const customCursor = document.querySelector('.custom-cursor');

        // const cursor = document.getElementById('fakeCursor');
        
        // document.addEventListener('mousemove', (e) => {
        //     left = e.clientX;
        //     top = e.clientY;
        // });
    })
</script>

<FakeCursor left={left} top={top} class="size-10"></FakeCursor>


