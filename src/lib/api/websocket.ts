import type { ChatMessage } from '$lib/types/editor';
import type { UserAuth, User } from '$lib/types/auth';
import type { WSRequest, WSResponse } from '$lib/types/websocket';

// WebSocket连接状态枚举
export enum WebSocketState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3
}

// WebSocket客户端类
export class WebSocketClient {
    // WebSocket的相关属性
    private socket: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    // 建立Websocket连接的必要参数
    private projectId: string;
    private currentUser: User;
    private userAuth: UserAuth;

    // chat
    public chatMessageHandler: ((message: ChatMessage) => void) | null = null;
    // TODO project
    public projectUpdateHandler: ((data: any) => void) | null = null;
    public projectDeletedHandler: ((data: any) => void) | null = null;
    // TODO member
    public memberUpdateHandler: ((data: any) => void) | null = null;

    constructor(
        projectId: string, 
        currentUser: User, 
        userAuth: UserAuth
    ) {
        this.projectId = projectId;
        this.currentUser = currentUser;
        this.userAuth = userAuth;
    }

    // 连接到WebSocket服务器
    public connect(): void {
        // 构建WebSocket URL
        const wsUrl = `ws://127.0.0.1:8000/project/${this.projectId}/ws/?access_token=${this.userAuth.access_token}`;

        try {
            this.socket = new WebSocket(wsUrl);
            // 设置事件处理程序
            this.socket.onopen = this.handleOpen.bind(this);
            this.socket.onmessage = this.handleMessage.bind(this);
            this.socket.onclose = this.handleClose.bind(this);
            this.socket.onerror = this.handleError.bind(this);
        } catch (error) {
            console.error('Project WebSocket connection failed:', error);
        }
    }

    // 关闭WebSocket连接
    public disconnect(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
    }

    // 处理连接打开事件
    private handleOpen(event: Event): void {
        console.log('Project WebSocket connected');
        this.reconnectAttempts = 0;
    }

    // 处理WebSocket的消息事件
    private handleMessage(event: MessageEvent): void {
        try {
            // 解析响应数据为WSResponse格式
            const response = JSON.parse(event.data) as WSResponse;
            
            // 使用switch-case结构处理不同的event_scope
            switch (response.event_scope) {
                case "chat":
                    this.handleChatEvent(response);
                    break;
                case "project":
                    this.handleProjectEvent(response);
                    break;
                case "member":
                    this.handleMemberEvent(response);
                    break;
                case "file":
                    this.handleFileEvent(response);
                    break;
                case "error":
                    this.handleErrorEvent(response);
                    break;
                default:
                    console.warn("Unknown event scope:", response.event_scope);
                    break;
            }
        } catch (error) {
            console.error('Failed to parse message:', error, 'original data:', event.data);
        }
    }

    // 处理聊天相关事件
    private handleChatEvent(response: WSResponse): void {
        switch (response.event_type) {
            case "message_sent":
                if (!this.chatMessageHandler) {
                    console.warn("Chat message handler not set");
                    return;
                }
                const messageData = response.data;
                const chatMessage: ChatMessage = {
                    message_type: "text", // 假设默认消息类型为text，需要根据实际情况调整
                    user: messageData.user,
                    content: messageData.content,
                    timestamp: new Date(messageData.timestamp)
                };
                this.chatMessageHandler(chatMessage);
                break;
            case "message_edited":
                // TODO: 处理消息编辑事件
                break;
            case "message_withdrawn":
                // TODO: 处理消息撤回事件
                break;
            default:
                console.warn("Unknown chat event type:", response.event_type);
                break;
        }
    }

    // 处理项目相关事件
    private handleProjectEvent(response: WSResponse): void {
        switch (response.event_type) {
            case "project_updated":
                // TODO: 处理项目更新事件
                if (!this.projectUpdateHandler) {
                    console.warn("Project update handler not set");
                    return;
                }
                this.projectUpdateHandler(response.data);
                break;
            case "project_deleted":
                if (!this.projectDeletedHandler) {
                    console.warn("Project deleted handler not set");
                    return;
                }
                this.projectDeletedHandler(response.data);
                // 项目被删除后自动断开连接
                this.disconnect();
                break;
            default:
                console.warn("Unknown project event type:", response.event_type);
                break;
        }
    }

    // 处理成员相关事件
    private handleMemberEvent(response: WSResponse): void {
        switch (response.event_type) {
            case "member_added":
                // TODO: 处理成员添加事件
                break;
            case "member_updated":
                // TODO: 处理成员更新事件
                break;
            case "member_removed":
                // TODO: 处理成员移除事件
                break;
            case "ownership_transferred":
                // TODO: 处理所有权转移事件
                break;
            case "member_status_changed":
                // TODO: 处理成员状态变更事件
                break;
            default:
                console.warn("Unknown member event type:", response.event_type);
                break;
        }
    }

    // 处理文件相关事件
    private handleFileEvent(response: WSResponse): void {
        switch (response.event_type) {
            case "file_added":
                // TODO: 处理文件添加事件
                break;
            case "file_renamed":
                // TODO: 处理文件重命名事件
                break;
            case "file_moved":
                // TODO: 处理文件移动事件
                break;
            case "file_deleted":
                // TODO: 处理文件删除事件
                break;
            default:
                console.warn("Unknown file event type:", response.event_type);
                break;
        }
    }

    // 处理错误相关事件
    private handleErrorEvent(response: WSResponse): void {
        console.error("Server error:", response.data);
        // 可以根据具体错误类型做不同处理
    }

    // 处理连接关闭事件
    private handleClose(event: CloseEvent): void {
        console.log('Project WebSocket connection closed:', event.code, event.reason);

        // 尝试重连
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const timeout = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

            console.log(`${timeout}ms later, try to reconnect...`);

            this.reconnectTimeout = setTimeout(() => {
                this.connect();
            }, timeout);
        } else {
            console.log('Project WebSocket connection closed');
        }
    }

    // 处理WebSocket的错误事件
    private handleError(event: Event): void {
        console.error('Project WebSocket error:', event);
    }

    // 获取当前WebSocket连接状态
    public getState(): WebSocketState {
        return this.socket ? this.socket.readyState : WebSocketState.CLOSED;
    }

    // EventScope: chat
    // chat: 发送聊天消息
    public sendChatMessage(content: string): void {
        if (!this.socket || this.socket.readyState !== WebSocketState.OPEN) {
            return;
        }
        try {
            // 构建符合WSRequest格式的请求
            const request: WSRequest = {
                event_scope: "chat",
                event_type: "message_sent",
                data: {
                    message_type: "text",
                    content: content
                }
            };
            this.socket.send(JSON.stringify(request)); // 以JSON格式发送请求
        } catch (error) {
            console.error('Failed to send chat message:', error);
        }
    }

    // EventScope: project
    // TODO: project: 更新项目名称
    // project: 处理项目删除事件的方法
    public onProjectDeleted(callback: (data: any) => void): void {
        this.projectDeletedHandler = callback;
    }

}

// 创建WebSocket客户端实例
export function createWebSocketClient(
    projectId: string,
    currentUser: User,
    userAuth: UserAuth
): WebSocketClient {
    return new WebSocketClient(projectId, currentUser, userAuth);
}
