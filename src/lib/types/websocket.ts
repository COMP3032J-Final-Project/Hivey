import * as v from 'valibot';

// --- Enums / Literal Types ---

// EventScope -> Use picklist for string enums
export const EventScopeSchema = v.picklist([
    "project",
    "member",
    "file",
    "chat",
    "crdt",
    "error",
]);
export type EventScope = v.InferInput<typeof EventScopeSchema>;

// Action Schemas based on Scope
export const ProjectActionSchema = v.picklist([
    "delete_project",
    "update_name",
]);
export type ProjectAction = v.InferInput<typeof ProjectActionSchema>;

export const MemberActionSchema = v.picklist([
    "joined",
    "left",
    "add_member",
    "update_member",
    "remove_member",
    "transfer_ownership",
]);
export type MemberAction = v.InferInput<typeof MemberActionSchema>;

export const FileActionSchema = v.picklist([
    "added",
    "renamed",
    "moved",
    "deleted",
]);
export type FileAction = v.InferInput<typeof FileActionSchema>;

export const ChatActionSchema = v.picklist([
    "send_message",
]);
export type ChatAction = v.InferInput<typeof ChatActionSchema>;

export const CRDTActionSchema = v.picklist([
    "broadcast",
]);
export type CRDTAction = v.InferInput<typeof CRDTActionSchema>;

// --- Payload Schemas ---

export const CrdtPayloadSchema = v.object({
    type: v.picklist(["update", "awareness"]),
    data: v.string(), // Represents base64 encoded data
    client_id: v.string(),
});
export type CrdtPayload = v.InferInput<typeof CrdtPayloadSchema>;

export const ErrorPayloadSchema = v.object({
    code: v.number(),
    message: v.string(),
});
export type ErrorPayload = v.InferInput<typeof ErrorPayloadSchema>;


// --- Message Schemas (using Discriminated Union) ---

const ProjectMessageBaseSchema = v.object({
    scope: v.literal("project"),
    action: ProjectActionSchema,
    payload: v.any(),
});

const MemberMessageBaseSchema = v.object({
    scope: v.literal("member"),
    action: MemberActionSchema,
    payload: v.any(),
});

const FileMessageBaseSchema = v.object({
    scope: v.literal("file"),
    action: FileActionSchema,
    payload: v.any(),
});

const ChatMessageBaseSchema = v.object({
    scope: v.literal("chat"),
    action: ChatActionSchema,
    payload: v.any(),
});

const CrdtMessageBaseSchema = v.object({
    scope: v.literal("crdt"),
    action: CRDTActionSchema,
    payload: CrdtPayloadSchema,
});

const ErrorMessageSchema = v.object({
    scope: v.literal("error"),
    action: v.null_(),
    payload: ErrorPayloadSchema,
});


// --- Request & Response ---

// Use v.intersect to add the required client_id to each base schema variant
export const WSRequest = v.union([
    v.intersect([ChatMessageBaseSchema, v.object({ client_id: v.string() })]),
    v.intersect([CrdtMessageBaseSchema, v.object({ client_id: v.string() })]),
]);
export type WSRequest = v.InferOutput<typeof WSRequest>;


export const WSResponse = v.union([
     v.intersect([ProjectMessageBaseSchema, v.object({ client_id: v.optional(v.string()) })]),
     v.intersect([MemberMessageBaseSchema, v.object({ client_id: v.optional(v.string()) })]),
     v.intersect([FileMessageBaseSchema, v.object({ client_id: v.optional(v.string()) })]),
     v.intersect([ChatMessageBaseSchema, v.object({ client_id: v.optional(v.string()) })]),
     v.intersect([CrdtMessageBaseSchema, v.object({ client_id: v.optional(v.string()) })]),
     ErrorMessageSchema,
]);
export type WSResponse = v.InferOutput<typeof WSResponse>;

