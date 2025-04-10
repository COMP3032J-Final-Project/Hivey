import * as v from 'valibot';

export const JoinLeaveMessage = v.object({
    action: v.picklist(["join", "leave"]),
    client_id: v.string(),
});

export const SendMessageMessage = v.object({
    action: v.literal("send_message"),
    client_id: v.string(),
    message: v.any()
});

export const Message = v.union([JoinLeaveMessage, SendMessageMessage]);

export type Message = v.InferOutput<typeof Message>;


/*
class EventScope(str, Enum):
    """
    事件范围
    - project: 项目
    - member: 成员
    - file: 文件
    - chat: 聊天
    - error: 错误
    """
    PROJECT = "project"
    MEMBER = "member"
    FILE = "file"
    CHAT = "chat"
    ERROR = "error"

class EventType(str, Enum):
    """事件类型"""
    # 项目相关
    PROJECT_UPDATED = "project_updated"
    PROJECT_DELETED = "project_deleted"
    # 成员相关
    MEMBER_ADDED = "member_added"
    MEMBER_UPDATED = "member_updated"
    MEMBER_REMOVED = "member_removed"
    OWNERSHIP_TRANSFERRED = "ownership_transferred"
    MEMBER_STATUS_CHANGED = "member_status_changed"
    # 文件相关
    FILE_ADDED = "file_added"
    FILE_RENAMED = "file_renamed"
    FILE_MOVED = "file_moved"
    FILE_DELETED = "file_deleted"
    # 聊天相关
    MESSAGE_SENT = "message_sent"
    MESSAGE_EDITED = "message_edited"
    MESSAGE_WITHDRAWN = "message_withdrawn"
*/

export const WSRequest = v.object({
    event_scope: v.picklist(["project", "member", "file", "chat", "error"]),
    event_type: v.string(),
    data: v.any()
});
export type WSRequest = v.InferOutput<typeof WSRequest>;


export const WSResponse = v.object({
    event_scope: v.picklist(["project", "member", "file", "chat", "error"]),
    event_type: v.string(),
    channel: v.string(),
    client_id: v.string(),
    data: v.any()
});
export type WSResponse = v.InferOutput<typeof WSResponse>;

