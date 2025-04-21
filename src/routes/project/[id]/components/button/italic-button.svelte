<script lang="ts">
    import { Italic } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";

    function italicText() {
        // Implement markdown formatting logic here
        console.log('Italic:');
    }
</script>

<div>
    <Tooltip.Root>
        <Tooltip.Trigger>
            <Button variant="ghost" size="icon" onclick={() => italicText()}>
                <Italic />
            </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
            Italic
        </Tooltip.Content>
    </Tooltip.Root>
</div>
