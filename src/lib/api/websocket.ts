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
    public projectUpdateHandler: ((data: { name: string }) => void) | null = null;
    public projectDeletedHandler: ((data: { id: string }) => void) | null = null;
    // TODO member
    public memberJoinedHandler: ((username: string) => void) | null = null;
    public memberUpdateHandler: ((data: any) => void) | null = null;
    public memberLeftHandler: ((username: string) => void) | null = null;

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
            try {
                if (this.socket.readyState === WebSocketState.OPEN) {
                    // 发送用户离开的消息
                    try {
                        const leaveMessage: WSRequest = {
                            scope: "member",
                            action: "left",
                            payload: {
                                username: this.currentUser.username,
                                email: this.currentUser.email
                            }
                        };
                        this.socket.send(JSON.stringify(leaveMessage));
                        console.log('Sent leave message');
                    } catch (error) {
                        console.error('Failed to send leave message:', error);
                    }
                    
                    this.socket.close();
                } else if (this.socket.readyState === WebSocketState.CONNECTING) {
                    this.socket.close();
                }
            } catch (error) {
                console.error('Error closing WebSocket connection:', error);
            } finally {
                this.socket = null;
            }
        }
        
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        
        console.log('WebSocket disconnected');
    }

    // 处理连接打开事件
    private handleOpen(event: Event): void {
        console.log('Project WebSocket connected');
        this.reconnectAttempts = 0;
        
        // 发送用户加入项目的消息
        if (this.socket && this.socket.readyState === WebSocketState.OPEN) {
            try {
                // 发送加入消息，通知其他用户
                const joinMessage: WSRequest = {
                    scope: "member",
                    action: "joined",
                    payload: {
                        username: this.currentUser.username,
                        email: this.currentUser.email,
                        avatar: this.currentUser.avatar
                    }
                };
                this.socket.send(JSON.stringify(joinMessage));
                console.log('Sent join message');
            } catch (error) {
                console.error('Failed to send join message:', error);
            }
        }
    }

    // 处理WebSocket的消息事件
    private handleMessage(event: MessageEvent): void {
        try {
            // 解析响应数据为WSResponse格式
            const response = JSON.parse(event.data);
            
            // 调试日志
            console.log('Received WebSocket message:', response);
            
            // 检查消息格式
            if (!response || typeof response !== 'object') {
                console.error('Invalid WebSocket message format:', response);
                return;
            }
            
            // 检查是否为服务器错误消息
            if (response.error) {
                console.error('Server error:', response.error);
                return;
            }
            
            // 尝试获取scope和action
            const scope = response.scope;
            const action = response.action;
            
            if (!scope) {
                console.error('WebSocket message missing scope:', response);
                return;
            }
            
            if (!action) {
                console.error('WebSocket message missing action:', response);
                return;
            }
            
            // 使用switch-case结构处理不同的event_scope
            switch (scope) {
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
                case "crdt":
                    this.handleCRDTEvent(response);
                    break;
                case "error":
                    this.handleErrorEvent(response);
                    break;
                default:
                    console.warn("Unknown event scope:", scope);
                    break;
            }
        } catch (error) {
            console.error('Failed to parse WebSocket message:', error, 'original data:', event.data);
        }
    }

    // 处理聊天相关事件
    private handleChatEvent(response: WSResponse): void {
        switch (response.action) {
            case "send_message":
                if (!this.chatMessageHandler) {
                    console.warn("Chat message handler not set");
                    return;
                }
                const messageData = response.payload;
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
                console.warn("Unknown chat event type:", response.action);
                break;
        }
    }

    // 处理项目相关事件
    private handleProjectEvent(response: WSResponse): void {
        console.log('Handling project event:', response.action, response.payload);
        
        switch (response.action) {
            case "update_name":
                if (!this.projectUpdateHandler) {
                    console.warn("Project update handler not set");
                    return;
                }
                console.log('Calling project update handler with payload:', response.payload);
                this.projectUpdateHandler(response.payload);
                break;
            case "delete_project":
                if (!this.projectDeletedHandler) {
                    console.warn("Project deleted handler not set");
                    return;
                }
                try {
                    // 根据后端的 payload 结构提取 project_id
                    const projectId = response.payload?.project_id || this.projectId;
                    console.log('Project deleted:', projectId);
                    this.projectDeletedHandler({ id: projectId });
                    
                    // 项目被删除后自动断开连接，防止重连
                    this.disconnect();
                } catch (error) {
                    console.error('Error handling project deletion:', error);
                }
                break;
            default:
                console.warn("Unknown project event type:", response.action);
                break;
        }
    }

    // 处理成员相关事件
    private handleMemberEvent(response: WSResponse): void {
        switch (response.action) {
            case "joined":
                if (!this.memberJoinedHandler) {
                    console.warn("Member joined handler not set");
                    return;
                }
                const username = response.payload?.username || "Unknown";
                console.log(`Member joined: ${username}`);
                this.memberJoinedHandler(username);
                break;
            case "left":
                if (!this.memberLeftHandler) {
                    console.warn("Member left handler not set");
                    return;
                }
                const leftUsername = response.payload?.username || "Unknown";
                console.log(`Member left: ${leftUsername}`);
                this.memberLeftHandler(leftUsername);
                break;
            case "add_member":
                // TODO: 处理成员添加事件
                break;
            case "update_member":
                // TODO: 处理成员更新事件
                break;
            case "remove_member":
                // TODO: 处理成员移除事件
                break;
            case "transfer_ownership":
                // TODO: 处理所有权转移事件
                break;
            default:
                console.warn("Unknown member event type:", response.action);
                break;
        }
    }

    // 处理文件相关事件
    private handleFileEvent(response: WSResponse): void {
        switch (response.action) {
            case "added":
                // TODO: 处理文件添加事件
                break;
            case "renamed":
                // TODO: 处理文件重命名事件
                break;
            case "moved":
                // TODO: 处理文件移动事件
                break;
            case "deleted":
                // TODO: 处理文件删除事件
                break;
            default:
                console.warn("Unknown file event type:", response.action);
                break;
        }
    }

    // 处理协同编辑相关事件
    private handleCRDTEvent(response: WSResponse): void {
        switch (response.action) {
            case "broadcast":
                // TODO: 处理协同编辑广播事件
                break;
        }
    }

    // 处理错误相关事件
    private handleErrorEvent(response: WSResponse): void {
        console.error("Server error:", response.payload);
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
                scope: "chat",
                action: "send_message",
                payload: {
                    message_type: "text",
                    content: content,
                    user: {
                        username: this.currentUser.username,
                        email: this.currentUser.email,
                        avatar: this.currentUser.avatar
                    },
                    timestamp: new Date().toISOString()
                }
            };
            console.log('Sending chat message:', request);
            this.socket.send(JSON.stringify(request));
        } catch (error) {
            console.error('Failed to send chat message:', error);
        }
    }

    // EventScope: project
    // project: 处理项目删除事件的方法
    public onProjectDeleted(callback: (data: { id: string }) => void): void {
        this.projectDeletedHandler = callback;
    }

    // project: 处理项目更新事件的方法
    public onProjectUpdate(callback: (data: { name: string }) => void): void {
        this.projectUpdateHandler = callback;
    }

    // member: 处理成员加入事件的方法
    public onMemberJoined(callback: (username: string) => void): void {
        this.memberJoinedHandler = callback;
    }

    // member: 处理成员离开事件的方法
    public onMemberLeft(callback: (username: string) => void): void {
        this.memberLeftHandler = callback;
    }

    // project: 更新项目名称的方法
    public updateProjectName(newName: string): void {
        if (!this.socket) {
            console.error('WebSocket not initialized');
            return;
        }
        
        if (this.socket.readyState !== WebSocketState.OPEN) {
            console.error('WebSocket not open, current state:', this.socket.readyState);
            return;
        }
        
        try {
            // 根据后端格式，更新请求结构
            const request: WSRequest = {
                scope: "project",
                action: "update_name",
                payload: {
                    name: newName,
                    project_id: this.projectId
                }
            };
            console.log('Sending project name update via WebSocket:', request);
            this.socket.send(JSON.stringify(request));
            console.log('Project name update sent successfully');
        } catch (error) {
            console.error('Failed to update project name:', error);
            throw error;
        }
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
