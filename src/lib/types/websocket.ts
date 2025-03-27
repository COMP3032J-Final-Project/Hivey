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


