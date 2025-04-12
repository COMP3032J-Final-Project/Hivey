<script lang="ts">
    import { Download } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button/index.js";
    function exportPDF() {
        // Implement markdown formatting logic here
        console.log('export PDF');
    }
</script>

<div>
	<Button variant="ghost" size="icon" onclick={() => exportPDF()}>
        <Download />
  </Button>
</div>
