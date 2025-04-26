<script lang="ts">
    import { Download } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    
    export let onClick: () => void;
</script>

<div>
    <Tooltip.Root>
        <Tooltip.Trigger>
            <Button class="m-1" variant="ghost" size="icon" onclick={onClick}>
                <Download />
            </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
            Download PDF
        </Tooltip.Content>
    </Tooltip.Root>
</div>
