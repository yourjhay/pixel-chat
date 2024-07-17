import MessageCreator from "@/Components/MessageCreator";
import Modal from "@/Components/Modal";
import OnlineStatus from "@/Components/OnlineStatus";
import { Conversation, Message, PageProps, User } from "@/types";
import {
    GlobeAltIcon,
    PlayCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
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
    const [attachment, setAttachment] = useState<{
        uri: string;
        mime: string;
    } | null>(null);
    const { data, setData, post, processing, errors, reset, progress } =
        useForm<{
            message: string;
            type: "text" | "image";
            message_attachment: File | null;
        }>({
            message: "",
            type: "text",
            message_attachment: null,
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
                console.log(e.message);
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

    const renderText = (txt: string) => {
        if (!txt) return;
        return txt.split(" ").map((part, i) =>
            URL_REGEX.test(part) ? (
                <a
                    key={i}
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
    };

    return (
        <div
            className="md:max-w-xl md:mt-10 mx-auto"
            style={{ height: "70lvh" }}
        >
            <Modal
                show={attachment !== null}
                maxWidth="full"
                onClose={() => setAttachment(null)}
            >
                <div className="flex justify-center relative bg-gray-900">
                    <XCircleIcon
                        onClick={() => setAttachment(null)}
                        className="z-10 absolute right-3 top-3 w-10 h-10 text-pink-700 p-1 bg-gray-300 rounded-full cursor-pointer"
                    />

                    {attachment?.mime.includes("image") && (
                        <img
                            src={attachment?.uri}
                            className="w-auto "
                            style={{ maxHeight: "85lvh" }}
                        />
                    )}
                    {attachment?.mime.includes("video") && (
                        <video
                            controls={true}
                            src={attachment?.uri}
                            className="w-auto "
                            style={{ maxHeight: "85lvh" }}
                        />
                    )}
                </div>
            </Modal>
            <Head title={`Chat ${chatID}`} />
            <div className="flex flex-row justify-between items-center bg-gray-200  px-2 py-3">
                <div className="flex flex-row gap-2 items-center">
                    <Link href={route("conversation")}>
                        <div className="cursor-pointer p-2 bg-gray-300 rounded-full hover:bg-gray-300">
                            <ChevronLeftIcon className="w-5 h-5" />
                        </div>
                    </Link>

                    <div className="flex flex-col ">
                        <h2 className="text-xl font-bold text-gray-500 ">
                            {conversation.name}
                        </h2>
                        <span className="text-gray-500 text-sm ">
                            {onlines.length}{" "}
                            {onlines.length === 1 ? "user" : "users"} online
                        </span>
                    </div>
                </div>
                {conversation.type === "private" ? (
                    <NewUser conversationId={conversation.id} />
                ) : (
                    <p className="flex flex-row items-center text-gray-500">
                        Public <GlobeAltIcon className="w-4 h-4 ml-2" />
                    </p>
                )}
            </div>
            <div
                ref={listRef}
                style={{ height: "100%" }}
                className="flex flex-col-reverse gap-2 px-2 pt-2 overflow-auto no-scrollbar"
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
                                msg.user?.nickname === nickname
                                    ? "flex-end"
                                    : "flex-start",
                        }}
                    >
                        <div
                            className="rounded-lg p-2 "
                            style={{
                                backgroundColor:
                                    msg.user?.nickname === nickname
                                        ? "#2f82ed"
                                        : "#e2e8f0",
                                maxWidth: "60%",
                                color:
                                    msg.user?.nickname === nickname
                                        ? "white"
                                        : "black",
                            }}
                        >
                            {msg.user?.nickname != nickname && (
                                <div className="flex flex-row gap-1 items-center">
                                    <OnlineStatus
                                        online={onlines.includes(msg.user?.id)}
                                    />
                                    <p className="text-xs text-pink-500">
                                        {msg.user?.nickname ??
                                            "Deleted Account"}{" "}
                                    </p>
                                </div>
                            )}
                            <div className="w-full text-balance break-words">
                                <p className="text-md">
                                    {msg.message && renderText(msg.message)}
                                </p>
                                {msg.media?.map((media, i) => (
                                    <div key={i}>
                                        {media.mime_type.includes("image") && (
                                            <img
                                                loading="lazy"
                                                onClick={() =>
                                                    setAttachment({
                                                        uri: media.original_url,
                                                        mime: media.mime_type,
                                                    })
                                                }
                                                src={media.preview_url}
                                                className="w-32 h-32 my-1 object-cover rounded-lg cursor-pointer"
                                            />
                                        )}
                                        {media.mime_type.includes("video") && (
                                            <div
                                                onClick={() =>
                                                    setAttachment({
                                                        uri: media.original_url,
                                                        mime: media.mime_type,
                                                    })
                                                }
                                                className="relative"
                                            >
                                                <PlayCircleIcon className="w-10 h-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
                                                <video
                                                    preload="metadata"
                                                    autoPlay={false}
                                                    src={media.original_url}
                                                    className="w-32 h-32 my-1 object-cover rounded-lg cursor-pointer"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <p
                                className={`text-xs ${
                                    msg.user?.nickname === nickname
                                        ? "text-gray-100"
                                        : "text-gray-500"
                                } text-right`}
                                title={
                                    "Sent " +
                                    moment(msg.created_at).format("LLL")
                                }
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
            <form onSubmit={handleSubmit} method="post">
                <MessageCreator
                    progress={progress}
                    clearFile={() => setData("message_attachment", null)}
                    attachment={data.message_attachment}
                    onFileChange={(e) => {
                        if (!e.target.files) {
                            return;
                        } else {
                            setData("message_attachment", e.target.files[0]);
                        }
                    }}
                    isTyping={isTyping}
                    message={data.message}
                    errors={errors}
                    processing={processing}
                    setMessage={setData}
                />
            </form>
        </div>
    );
}
