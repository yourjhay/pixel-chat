import OnlineStatus from "@/Components/OnlineStatus";
import GuestLayout from "@/Layouts/GuestLayout";
import { Conversation, Message, PageProps, User } from "@/types";
import { GlobeAltIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { Head, Link, useForm } from "@inertiajs/react";

import moment from "moment";
import React, { FormEventHandler, useEffect, useState } from "react";
import NewUser from "./Partials/AddUser";

interface Props {
    chatID: string;
    conversation: Conversation;
}

interface TypingEvent {
    user: string;
    typing: boolean;
}

export default function Chat({
    chatID,
    conversation,
    auth,
}: Props & PageProps) {
    const listRef = React.createRef<HTMLDivElement>();
    const nickname = auth.user?.nickname;
    const { data, setData, post, processing, errors, reset } = useForm({
        message: "",
        type: "text",
    });

    const [chats, setMessages] = useState<Message[]>(conversation.messages);
    const [onlines, setOnlines] = useState<Array<number>>([]);
    const [typing, setTyping] = useState<TypingEvent>({
        user: "",
        typing: false,
    });
    const [channel, setChannel] = useState<any>(null);

    let time: any;
    useEffect(() => {
        const channel = window.Echo.join(`chat.${chatID}`)
            .here((users: User[]) => {
                users.map((user) => {
                    setOnlines((prev) => [...prev, user.id]);
                });
            })
            .joining((user: User) => {
                setOnlines((prev) => [...prev, user.id]);
            })
            .leaving((user: User) => {
                setOnlines((prev) => prev.filter((u) => u !== user.id));
            })
            .listenForWhisper("typing", (e: TypingEvent) => {
                setTyping({
                    user: e.user,
                    typing: e.typing,
                });
                clearTimeout(time);
                time = setTimeout(() => {
                    setTyping({
                        user: "",
                        typing: false,
                    });
                }, 600);
            })
            .listen("MessageEvent", (e: { message: Message }) => {
                setTyping({
                    user: "",
                    typing: false,
                });
                setMessages((prev) => [e.message, ...prev]);
            });

        setChannel(channel);
        return () => {
            window.Echo.leave(`chat.${chatID}`);
        };
    }, []);

    useEffect(() => {
        if (listRef.current) {
            listRef.current?.firstElementChild?.scrollIntoView();
        }
    }, [chats]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("chat.send", chatID), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const isTyping = () => {
        if (conversation.type === "private") {
            setTimeout(function () {
                channel.whisper("typing", {
                    user: auth.user.nickname,
                    typing: true,
                });
            }, 500);
        }
    };
    const URL_REGEX =
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

    const renderText = (txt: string) =>
        txt.split(" ").map((part) =>
            URL_REGEX.test(part) ? (
                <a
                    target="_blank"
                    className="text-red-900 font-bold"
                    href={part}
                >
                    {part}{" "}
                </a>
            ) : (
                part + " "
            )
        );

    return (
        <GuestLayout>
            <Head title={`Chat ${chatID}`} />
            <div className="flex flex-row justify-between items-center bg-gray-200 -mx-6 -mt-4 px-6 py-3">
                <div className="flex flex-row gap-2 items-center">
                    <Link href={route("conversation", { nickname })}>
                        <div className="cursor-pointer p-2 bg-gray-300 rounded-full hover:bg-gray-300">
                            <ChevronLeftIcon className="w-5 h-5" />
                        </div>
                    </Link>

                    <h2 className="text-xl font-bold text-gray-500 my-3">
                        {conversation.name}
                    </h2>
                    <span className="text-gray-500 text-sm mt-1 ">
                        {onlines.length}{" "}
                        {onlines.length === 1 ? "user" : "users"} online
                    </span>
                </div>
                {conversation.type === "private" ? (
                    <NewUser conversationId={conversation.id} />
                ) : (
                    <p className="flex flex-row items-center text-gray-500">
                        Public <GlobeAltIcon className="w-4 h-4 ml-2" />
                    </p>
                )}
            </div>
            <form onSubmit={handleSubmit} method="post">
                <div
                    ref={listRef}
                    style={{ height: "70vh" }}
                    className="flex flex-col-reverse gap-2  overflow-auto no-scrollbar"
                >
                    <div className="my-2">
                        <div className="text-gray-500 text-xs italic">
                            {typing.user && `${typing.user} is typing...`}
                        </div>
                    </div>
                    {chats.slice(0, 100).map((msg) => (
                        <div
                            key={msg.id}
                            className="flex flex-row gap-2"
                            style={{
                                justifyContent:
                                    msg.user.nickname === nickname
                                        ? "flex-end"
                                        : "flex-start",
                            }}
                        >
                            <div
                                className="rounded-lg p-2 "
                                style={{
                                    backgroundColor:
                                        msg.user.nickname === nickname
                                            ? "#2f82ed"
                                            : "#e2e8f0",
                                    maxWidth: "60%",
                                    color:
                                        msg.user.nickname === nickname
                                            ? "white"
                                            : "black",
                                }}
                            >
                                {msg.user.nickname != nickname && (
                                    <div className="flex flex-row gap-1 items-center">
                                        <OnlineStatus
                                            online={onlines.includes(
                                                msg.user.id
                                            )}
                                        />
                                        <p className="text-xs text-pink-500">
                                            {msg.user.nickname}{" "}
                                        </p>
                                    </div>
                                )}
                                <div className="w-full text-balance break-words">
                                    <p>{renderText(msg.message)}</p>
                                </div>
                                <p
                                    className={`text-xs ${
                                        msg.user.nickname === nickname
                                            ? "text-gray-100"
                                            : "text-gray-500"
                                    } text-right`}
                                >
                                    {moment(msg.created_at).fromNow()}
                                </p>
                            </div>
                        </div>
                    ))}
                    {chats.length === 0 && (
                        <div className="text-center text-gray-500">
                            <h3 className="text-xl font-bold">
                                {conversation.name}
                            </h3>
                            No messages yet. Why don't you send one?
                        </div>
                    )}
                </div>

                <div className="flex flex-row gap-2 mt-3">
                    <div className="grow">
                        <input
                            placeholder="Message"
                            autoComplete="off"
                            onKeyDown={isTyping}
                            className="input w-full text-lg rounded-full"
                            type="text"
                            name="message"
                            value={data.message}
                            onChange={(e) => setData("message", e.target.value)}
                        />
                        {errors.message && (
                            <div className="text-red-500">{errors.message}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing || !data.message}
                    >
                        <PaperAirplaneIcon className="w-7 h-7 text-blue-700" />
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
