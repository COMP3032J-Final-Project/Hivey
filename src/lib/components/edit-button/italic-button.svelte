<script lang="ts">
    import { Italic } from 'lucide-svelte';

    function italicText() {
        // Implement markdown formatting logic here
        console.log('Italic:');
    }
</script>

<div>
	<button onclick={() => italicText()}>
        <Italic />
    </button>
</div>
