<script lang="ts">
    import { Download } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    
    function exportPDF() {
        // TODO: Implement markdown formatting logic here
        console.log('export PDF');
    }
</script>

<div>
    <Tooltip.Root>
        <Tooltip.Trigger>
            <Button class="m-1" variant="ghost" size="icon" onclick={() => exportPDF()}>
                <Download />
            </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
            Download PDF
        </Tooltip.Content>
    </Tooltip.Root>
</div>
