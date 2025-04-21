<script lang="ts">
    import { Bold } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";

    function boldText() {
        // Implement markdown formatting logic here
        console.log('Bold:');
    }
</script>

<div>
    <Tooltip.Root>
        <Tooltip.Trigger>
            <Button variant="ghost" size="icon" onclick={() => boldText()}>
                <Bold />
            </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
            Bold
        </Tooltip.Content>
    </Tooltip.Root>
</div>
