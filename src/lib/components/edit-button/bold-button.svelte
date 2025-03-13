<script lang="ts">
    import { Bold } from 'lucide-svelte';

    function boldText() {
        // Implement markdown formatting logic here
        console.log('Bold:');
    }
</script>

<div>
	<button onclick={() => boldText()}>
        <Bold />
    </button>
</div>
