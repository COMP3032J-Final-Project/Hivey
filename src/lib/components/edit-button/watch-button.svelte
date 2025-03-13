<script lang="ts">
    import { Eye } from 'lucide-svelte';

    function subscribe() {
        // Implement markdown formatting logic here
        console.log('subscribe the project');
    }
</script>

<div>
	<button onclick={() => subscribe()}>
    	<Eye />
    </button>
</div>
