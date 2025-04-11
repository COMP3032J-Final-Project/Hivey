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
    - crdt: 协同编辑
    """
    PROJECT = "project"
    MEMBER = "member"
    FILE = "file"
    CHAT = "chat"
    ERROR = "error"
    CRDT = "crdt"

class ProjectAction(str, Enum):
    DELETE_PROJECT = "delete_project"
    UPDATE_NAME = "update_name"


class MemberAction(str, Enum):
    JOINED = "joined"
    LEFT = "left"
    ADD_MEMBER = "add_member"
    UPDATE_MEMBER = "update_member"
    REMOVE_MEMBER = "remove_member"
    TRANSFER_OWNERSHIP = "transfer_ownership"


class FileAction(str, Enum):
    ADDED = "added"
    RENAMED = "renamed"
    MOVED = "moved"
    DELETED = "deleted"


class ChatAction(str, Enum):
    SEND_MESSAGE = "send_message"
    # MESSAGE_EDITED = "message_edited"
    # MESSAGE_WITHDRAWN = "message_withdrawn"


class CRDTAction(str, Enum):
    BROADCAST = "broadcast"

*/

export const WSRequest = v.object({
    scope: v.picklist(["project", "member", "file", "chat", "error", "crdt"]),
    action: v.string(),
    payload: v.any()
});
export type WSRequest = v.InferOutput<typeof WSRequest>;


export const WSResponse = v.object({
    scope: v.picklist(["project", "member", "file", "chat", "error", "crdt"]),
    action: v.string(),
    payload: v.any(),
    client_id: v.string(),
});
export type WSResponse = v.InferOutput<typeof WSResponse>;

