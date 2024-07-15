export interface User {
    id: number;
    nickname: string;
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
    name: string;
    type: "public" | "private";
    created_at: string;
    messages: Message[];
}
export interface Nickname {
    id: number;
    name: string;
    created_at: string;
}

export interface Message {
    id?: number;
    conversation_id?: number;
    message: string;
    user: User;
    file?: string;
    created_at: string;
    type: "text" | "file";
}
