<script lang="ts">
    import { Fullscreen } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";

    function fullScreen() {
        // Implement markdown formatting logic here
        console.log('View preview in full screen');
    }
</script>

<div>
    <Tooltip.Root>
        <Tooltip.Trigger>
            <Button variant="ghost" size="icon" onclick={() => fullScreen()}>
                <Fullscreen />
            </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
            Full Screen Preview
        </Tooltip.Content>
    </Tooltip.Root>
</div>
