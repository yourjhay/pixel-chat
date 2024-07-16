import GuestLayout from "@/Layouts/GuestLayout";
import { Conversation, Nickname, PageProps } from "@/types";
import {
    GlobeAltIcon,
    LockClosedIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import CreateNickname from "./Partials/CreateNickname";
import NewRoom from "./Partials/NewRoom";

interface Props {
    conversations: {
        data: Conversation[];
        current_page: number;
        total: number;
    };
    nickname: Nickname;
}
interface Unread {
    conversation_id: number;
    unread: number;
}
function Coversation({ conversations, nickname, auth }: Props & PageProps) {
    const [unread, setUnread] = useState<Unread[]>([]);

    useEffect(() => {
        conversations.data.map((conversation) => {
            setUnread((prev) => [
                ...prev,
                {
                    conversation_id: conversation.id,
                    unread: 0,
                },
            ]);
        });
    }, [auth]);

    return (
        <GuestLayout>
            <CreateNickname nickname={auth.user?.nickname} />
            <div className="flex flex-row-reverse justify-between items-center">
                {auth.user?.id && <NewRoom />}
                {nickname && (
                    <Link href={route("profile.edit")}>
                        <div className="flex flex-row gap-2 items-center cursor-pointer text-indigo-500">
                            <UserCircleIcon className="w-6 h-6" />
                            <p className="text-lg  font-bold">
                                {auth.user.nickname}
                            </p>
                        </div>
                    </Link>
                )}
            </div>
            <Head title="Coversations" />
            <h2 className="text-xl font-bold text-gray-500 my-3">Chat Rooms</h2>
            <div
                style={{ maxHeight: "70vh" }}
                className="flex flex-col gap-2 overflow-auto py-4"
            >
                {conversations.data.map((conversation) => (
                    <Link
                        key={conversation.id}
                        href={route("chat", conversation.id)}
                    >
                        <div className="p-4 bg-gray-300 shadow sm:rounded-lg flex items-center flex-row justify-between text-pink-500 font-bold">
                            <p className="flex flex-row gap-2 items-center">
                                {" "}
                                {conversation.name}
                                {unread.find(
                                    (u) => u.conversation_id === conversation.id
                                )?.unread !== undefined &&
                                    unread.filter(
                                        (u) =>
                                            u.conversation_id ===
                                            conversation.id
                                    )[0]?.unread > 0 && (
                                        <span className="text-xs rounded-full bg-pink-500 text-white p-1 px-2">
                                            {
                                                unread.find(
                                                    (u) =>
                                                        u.conversation_id ===
                                                        conversation.id
                                                )?.unread
                                            }
                                        </span>
                                    )}
                            </p>
                            <span className="text-xs text-gray-500 flex flex-row gap-2">
                                {conversation.type}
                                {conversation.type === "public" ? (
                                    <GlobeAltIcon className="w-4 h-4" />
                                ) : (
                                    <LockClosedIcon className="w-4 h-4" />
                                )}
                            </span>
                        </div>
                    </Link>
                ))}
                {conversations.data.length === 0 && (
                    <div className="text-center text-gray-500">
                        You don't have chat rooms yet. Why don't you create or
                        join one?
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}

export default Coversation;
