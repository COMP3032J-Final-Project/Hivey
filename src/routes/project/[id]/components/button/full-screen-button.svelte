<script lang="ts">
    import { Fullscreen } from 'lucide-svelte';

    function fullScreen() {
        // Implement markdown formatting logic here
        console.log('View preview in full screen');
    }
</script>

<div>
	<button onclick={() => fullScreen()}>
    	<Fullscreen />
    </button>
</div>
