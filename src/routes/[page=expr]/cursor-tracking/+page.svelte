<script lang="ts">
    import { onMount } from 'svelte';
    import { throttle } from '$lib/utils';
    import FakeCursor from '$lib/components/ui/fake-cursor';
    import { SvelteMap } from 'svelte/reactivity';

    // Store cursor positions from all users
    type Cursor = {
        left: number;
        top: number;
        clientId: string;
        lastUpdated: number;
        color: string;
    };

    let cursors = $state(new SvelteMap<string, Cursor>());
    let ourClientId = $state<string | null>(null);
    let isConnected = $state(false);

    const COLORS = ["black", "purple", "organge", "red", "green", "blue", "cyan"];

    function handleWsMessage(message: any) {
        if (message.action == "join") {
            if (message.client_id && !ourClientId) {
                ourClientId = message.client_id;
                console.log("Our client ID:", ourClientId);
            }
        }
        if (message.action !== "send_message") return;
        
        const clientId = message.client_id;
        const cursorData = message.message;
        
        // Skip updating our own cursor
        if (clientId === ourClientId) return;

        const originalCursorInfo = cursors.get(clientId);
        
        // Update or add cursor position
        const updatedCursor = {
            left: cursorData.left,
            top: cursorData.top,
            clientId,
            lastUpdated: Date.now(),
            color: originalCursorInfo?.color ?? getRandomColor(), 
        };
        
        cursors.set(clientId, updatedCursor);
    }

    

    onMount(() => {
        const ws = new WebSocket("ws://localhost:8000/project/38bbae14-f1cb-472c-993e-bd442f2e5721/ws/cursor");
        
        ws.addEventListener("open", () => {
            isConnected = true;
            console.log("WebSocket connected");
        });
        
        ws.addEventListener("close", () => {
            isConnected = false;
            console.log("WebSocket disconnected");
        });
        
        ws.addEventListener("message", (event) => {
            const msg = JSON.parse(event.data);
            
            switch (msg.type) {
                case 'batch':
                    for (const message of msg.messages) 
                        handleWsMessage(message);
                    break;
                case undefined:
                    handleWsMessage(msg);
                    break;
                default:
                    break;
            }
        });

        const sendCursorPosToWsFn = (left: number, top: number) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    left, top
                }));
            }
        };
        
        const [sendCursorPosToWsThrottled] = throttle(sendCursorPosToWsFn, 5);
        
        const handleMouseMove = (e: MouseEvent) => {
            if (isConnected) {
                sendCursorPosToWsThrottled(e.clientX, e.clientY);
            }
        };
        
        document.addEventListener('mousemove', handleMouseMove);

        // Clean up stale cursors every second
        const cursorCleanupInterval = setInterval(() => {
            const now = Date.now();
            
            for (const [clientId, cursor] of cursors.entries()) {
                if (now - cursor.lastUpdated > 5000) {
                    cursors.delete(clientId);
                }
            }
        }, 1000);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            clearInterval(cursorCleanupInterval);
            ws.close();
        };
    });
    
    // normally color should returned from project api (attched to user)
    // like "red", client can use a map to fine tune these colors
    function getRandomColor(): string {
        return COLORS.at(COLORS.length*Math.random())!;
    }
</script>

{#if !isConnected}
    <div class="fixed bottom-2 right-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md text-sm">
        Cursor tracking disconnected
    </div>
{/if}

<!-- Debug information -->
<div class="fixed top-2 right-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm opacity-70">
    Cursors: {cursors.size}
</div>

{#each [...cursors.values()] as cursor (cursor.clientId)}
    <FakeCursor 
        left={cursor.left} 
        top={cursor.top}
        color={cursor.color}
    />
{/each}

