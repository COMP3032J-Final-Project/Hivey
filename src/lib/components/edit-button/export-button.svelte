<script lang="ts">
    import { Download } from 'lucide-svelte';

    function exportPDF() {
        // Implement markdown formatting logic here
        console.log('export PDF');
    }
</script>

<div>
	<button onclick={() => exportPDF()}>
        <Download />
    </button>
</div>
