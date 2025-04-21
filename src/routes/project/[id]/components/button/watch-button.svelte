<script lang="ts">
    import { Eye } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";

    function subscribe() {
        // Implement markdown formatting logic here
        console.log('subscribe the project');
    }
</script>

<div>
    <Tooltip.Root>
        <Tooltip.Trigger>
            <Button variant="ghost" size="icon" onclick={() => subscribe()}>
                <Eye />
            </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
            Watch Project
        </Tooltip.Content>
    </Tooltip.Root>
</div>
