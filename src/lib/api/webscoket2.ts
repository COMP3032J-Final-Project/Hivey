import type { UserAuth } from '$lib/types/auth';
import { BACKEND_ADDR_WEBSOCKET } from '$lib/constants';

export class WebSocketClient {
    private url: URL;
    private maxReconnectAttempts: number;
    private onMessageHandler: (event: MessageEvent) => void;
    
    private socket?: WebSocket;
    private reconnectAttempts = 0;
    private reconnectFn: ReturnType<typeof setTimeout> | null = null;

    public get connectionStatus() {
        return this.socket?.readyState;
    }

    constructor(
        projectId: string,
        userAuth: UserAuth,
        onMessageHandler: (event: MessageEvent) => void,
        maxReconnectAttempts: number = 5
    ) {
        this.url = new URL(
            `project/${projectId}/ws/?access_token=${userAuth.access_token}`,
            `${BACKEND_ADDR_WEBSOCKET}`
        );
        this.onMessageHandler = onMessageHandler;
        this.maxReconnectAttempts = maxReconnectAttempts;
    }

    public connect(): void {

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log('WebSocket already open.');
            return;
        }
        
        this.socket = new WebSocket(this.url);
        this.socket.onopen = () => {
            console.log('WebSocket connection established.');
            this.reconnectAttempts = 0;
        };
        this.socket.onmessage = this.onMessageHandler;
        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        this.socket.onclose = (event) => {
            console.log('WebSocket connection closed:', event.code, event.reason);
            this.socket = undefined;
            if (event.code !== 1000) { // 1000 = Normal closure
                this.scheduleReconnect();
            }
        };
    }

    
    public close() {
        if (this.reconnectFn) {
            clearTimeout(this.reconnectFn);
            this.reconnectFn = null;
        }
        this.reconnectAttempts = this.maxReconnectAttempts; // Prevent further reconnects
        if (this.socket) {
            console.log('Closing WebSocket connection manually.');
            this.socket.close(1000, 'Client initiated disconnect'); // Normal closure
        }
    }

    scheduleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const timeout = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
            console.log(`WebSocket disconnected. Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${timeout / 1000}s...`);
            this.reconnectFn = setTimeout(() => this.connect(), timeout);
        } else {
            console.error('WebSocket max reconnect attempts reached.');
        }
    }
    
    send(message: object) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket not open. Cannot send message:', message);
        }
    }
}
