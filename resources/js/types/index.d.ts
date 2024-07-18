export interface User {
    id: number;
    nickname: string;
    email: string;
    email_verified_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};

export interface Conversation {
    id: number;
    user_id: number;
    name: string;
    type: "public" | "private";
    created_at: string;
    messages: Message[];
    members: {
        id: number;
        conversation_id: number;
        user_id: number;
        user: User;
        created_at: string;
    }[];
}
export interface Nickname {
    id: number;
    name: string;
    created_at: string;
}

export interface Media {
    id: number;
    collection_name: string;
    size: number;
    original_url: string;
    preview_url: string;
    name: string;
    uuid: string;
    updated_at: string;
    file_name: string;
    mime_type: string;
}
export interface Message {
    id?: number;
    conversation_id?: number;
    message: string;
    user: User;
    file?: string;
    created_at: string;
    type: "text" | "file";
    media: Media[];
}

export interface MessageRequest {
    message: string;
    type: "text" | "image";
    message_attachment: File | null;
}
