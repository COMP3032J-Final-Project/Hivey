import { WebSocketClient } from '$lib/api/webscoket2';
import { WSResponse } from '$lib/types/websocket';
import type { UserAuth } from '$lib/types/auth';
import * as v from 'valibot';
import { } from './store.svelte';

let wsClient: WebSocketClient | undefined = $state(undefined);

function initializeWebSocket(projectId: string, userAuth: UserAuth) {
    if (wsClient) {
        console.warn('WebSocket already initialized. Closing existing connection.');
        wsClient.close();
    }
    wsClient = new WebSocketClient(projectId, userAuth, handleIncomingMessage);
}


function handleIncomingMessage(event: MessageEvent) {
    let response;
    try {
        response = v.parse(WSResponse, event.data);
    } catch (error) {
        console.error("Error processing websocket message:", error);
        return;
    }

    switch (response.scope) {
        case 'project':
            break;
        case 'member':
            break;
        case 'chat':
            break;
        case 'file':
            break;
        case 'crdt':
            break;
        case 'error':
            console.log("Received Error Message:", response);
            break;
        default:
            console.log("Received Error Message:", response);
    }

}

function getCurrentWebSocketStatus() {
    return wsClient?.connectionStatus;
}

export {
    getCurrentWebSocketStatus
}
