import type { ChatMessage, File } from '$lib/types/editor';
import type { UserAuth, User} from '$lib/types/auth';
import { UserPermissionEnum} from '$lib/types/auth';
import type { WSRequest, WSResponse } from '$lib/types/websocket';
import { BACKEND_ADDR_WEBSOCKET } from '$lib/constants';

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

    // 以下是事件处理函数
    // chat
    public chatMessageHandler: ((message: ChatMessage) => void) | null = null;
    // project
    public projectUpdateHandler: ((data: { name: string }) => void) | null = null;
    public projectDeletedHandler: ((data: { id: string }) => void) | null = null;
    // member
    public memberJoinedHandler: ((username: string) => void) | null = null;
    public memberInvitedHandler: ((invitee: User) => void) | null = null;
    public memberUpdateHandler: ((username: string, permission: UserPermissionEnum) => void) | null = null;
    public memberRemoveHandler: ((username: string) => void) | null = null;
    public memberTransferHandler: ((data: any) => void) | null = null;
    public memberLeftHandler: ((username: string) => void) | null = null;
    // CRDT
    public crdtEventHandler: ((response: WSResponse) => void) | null = null;
    // file
    public fileAddedHandler: ((file: File) => void) | null = null;
    public fileRenamedHandler: ((file: File) => void) | null = null;
    public fileDeletedHandler: ((id: string ) => void) | null = null;
    public fileMoveHandler: ((file: File) => void) | null = null;


    constructor(
        projectId: string,
        currentUser: User,
        userAuth: UserAuth
    ) {
        this.projectId = projectId;
        this.currentUser = currentUser;
        this.userAuth = userAuth;
    }

    public connect(): void {
        const wsUrl = new URL(
            `project/${this.projectId}/ws/?access_token=${this.userAuth.access_token}`,
            `${BACKEND_ADDR_WEBSOCKET}`
        );

        try {
            this.socket = new WebSocket(wsUrl);
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
        console.debug('WebSocket disconnected');
    }

    // 处理连接打开事件
    private handleOpen(event: Event): void {
        console.debug('Project WebSocket connected');
        this.reconnectAttempts = 0;
    }

    // 处理WebSocket的消息事件
    private handleMessage(event: MessageEvent): void {
        try {
            const response = JSON.parse(event.data); // 解析响应数据为WSResponse格式
            
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
            const action = scope ==='error' ? 'error' : response.action;  // 如果scope为'error'则action也为'error'
            
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
                console.log('Member joined:', response.payload);
                const username = response.payload?.username || "Unknown";
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
                if (!this.memberInvitedHandler) {
                    console.warn("Member invited handler not set");
                    return;
                }
                const invitee : User = {
                    username: response.payload?.username || "Unknown",
                    email: response.payload?.email || "Unknown",
                    permission: response.payload?.permission || UserPermissionEnum.Viewer,
                }
                this.memberInvitedHandler(invitee);
                break;
            case "update_member":
                if (!this.memberUpdateHandler) {
                    console.warn("Member update handler not set");
                    return;
                }
                this.memberUpdateHandler(response.payload?.username, response.payload?.permission);
                break;
            case "remove_member":
                if (!this.memberRemoveHandler) {
                    console.warn("Member remove handler not set");
                    return;
                }
                this.memberRemoveHandler(response.payload?.username);
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
                if (!this.fileAddedHandler) {
                    console.warn("File added handler not set");
                    return;
                }
                const addedFile: File = response.payload;
                console.log('File added:', addedFile);
                this.fileAddedHandler(addedFile);
                break;
            case "renamed":
                if (!this.fileRenamedHandler) {
                    console.warn("File rename handler not set");
                    return;
                }
                const renamedFile: File = response.payload;
                this.fileRenamedHandler(renamedFile);
                break;
            case "moved":
                if (!this.fileMoveHandler) {
                    console.warn("File moved handler not set");
                    return;
                }
                const movedFile: File = response.payload;
                this.fileMoveHandler(movedFile);
                break;
            case "deleted":
                if (!this.fileDeletedHandler) {
                    console.warn("File deleted handler not set");
                    return;
                }
                const deletedFileId = response.payload.id;
                this.fileDeletedHandler(deletedFileId);
                break;
            default:
                console.warn("Unknown file event type:", response.action);
                break;
        }
    }

    // 处理CRDT相关事件
    private handleCRDTEvent(response: WSResponse): void {
        switch (response.action) {
            case "broadcast":
                if (!this.crdtEventHandler) {
                    console.warn("CRDT event handler not set");
                    return;
                }
                this.crdtEventHandler(response);
                break;
        }
    }

    // 处理错误相关事件
    private handleErrorEvent(response: WSResponse): void {
        const errorMessage = response.payload.message;
        console.error("Project WebSocket error:", errorMessage);
    }

    // 处理连接关闭事件
    private handleClose(event: CloseEvent): void {
        console.log('Project WebSocket connection closed:', event.code, event.reason);

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

    // 以下是消息发送方法

    // 通用消息发送方法，用于发送任何类型的消息
    public sendMessage(message: WSRequest): void {
        if (!this.socket || this.socket.readyState !== WebSocketState.OPEN) {
            console.error('WebSocket not connected, current state:', this.socket ? this.socket.readyState : 'null');
            return;
        }
        try {
            this.socket.send(JSON.stringify(message));
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }

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
                    },
                    timestamp: new Date().toISOString()
                }
            };
            this.socket.send(JSON.stringify(request));
        } catch (error) {
            console.error('Failed to send chat message:', error);
        }
    }

    // project: 更新项目名称的方法
    public sendUpdateProjectNameMessage(newName: string): void {
        if (!this.socket || this.socket.readyState !== WebSocketState.OPEN) {
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
            this.socket.send(JSON.stringify(request));
        } catch (error) {
            console.error('Failed to update project name:', error);
            throw error;
        }
    }

    // crdt: 发送CRDT更新消息
    public sendCRDTUpdateMessage(data: string ): void {
		if (!this.socket || this.socket.readyState !== WebSocketState.OPEN) {
            console.error('WebSocket not connected for CRDT update, current state:', this.socket ? this.socket.readyState : 'null');
            return;
        }
        
        try {
            const request: WSRequest = {
                scope: "crdt",
                action: "broadcast",
                payload: {
                    type: "update",
                    data: data,
                    client_id: this.currentUser.username
                }
            };
            this.socket.send(JSON.stringify(request));
        } catch (error) {
            console.error('Failed to send CRDT update message:', error);
        }
	}

    // crdt: 发送awareness更新消息
    public sendAwarenessUpdateMessage(data: string ): void {
		if (!this.socket || this.socket.readyState !== WebSocketState.OPEN) {
            console.error('WebSocket not connected for awareness update, current state:', this.socket ? this.socket.readyState : 'null');
            return;
        }
        try {
            const request: WSRequest = {
                scope: "crdt",
                action: "broadcast",
                payload: {
                    type: "awareness",
                    data: data,
                    client_id: this.currentUser.username
                }
            };
            this.socket.send(JSON.stringify(request));
        } catch (error) {
            console.error('Failed to send awareness update message:', error);
        }
	}

    // file: 发送文件添加消息
    public sendFileAddedMessage(file: File ): void {
		if (!this.socket || this.socket.readyState !== WebSocketState.OPEN) {
            return;
        }
        try {
            // 根据后端格式，更新请求结构
            const request: WSRequest = {
                scope: "file",
                action: "added",
                payload: {
                    file_info: file,
                    project_id: this.projectId
                }
            };
            this.socket.send(JSON.stringify(request));
        } catch (error) {
            console.error('Failed to add new file:', error);
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
