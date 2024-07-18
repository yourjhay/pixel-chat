import ApplicationLogo from "@/Components/ApplicationLogo";
import OnlineStatus from "@/Components/OnlineStatus";
import { Conversation, PageProps, User } from "@/types";
import {
    ArrowRightStartOnRectangleIcon,
    ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import { Head, useForm } from "@inertiajs/react";
import moment from "moment";
import { useEffect, useState } from "react";
import NewUser from "./Partials/AddUser";

interface Props {
    conversation: Conversation;
}
function ChatDetails({ auth, conversation }: PageProps & Props) {
    const { processing, post } = useForm();
    const [usersOnline, setUsersOnline] = useState<User[]>([]);

    useEffect(() => {
        window.Echo.join(`chat.${conversation.id}`)
            .here((users: User[]) => {
                setUsersOnline(users);
            })
            .joining((user: User) => {
                setUsersOnline((prev) => [...prev, user]);
            })
            .leaving((user: User) => {
                setUsersOnline((prev) => prev.filter((u) => u.id !== user.id));
            });
        return () => window.Echo.leave(`chat.${conversation.id}`);
    }, [auth]);

    const handleLeave = () => {
        !processing && post(route("conversation.leave", conversation.id));
    };

    const Member = ({
        user_id,
        nickname,
        added,
        online = false,
    }: {
        user_id: number;
        nickname: string;
        added?: string;
        online: boolean;
    }) => (
        <div className="bg-gray-300 flex flex-row justify-between items-center p-3 rounded-xl">
            <div className="flex flex-row gap-2 items-center">
                <OnlineStatus online={online} />
                <p className="text-lg text-gray-700">
                    {nickname}{" "}
                    {conversation.user_id === user_id ? (
                        <span className="text-sm text-gray-500">(Owner)</span>
                    ) : (
                        ""
                    )}
                </p>
            </div>
            {added && (
                <p className="text-sm text-gray-500">
                    Added {moment(added).fromNow()}
                </p>
            )}
        </div>
    );

    return (
        <div
            className="md:max-w-xl  mx-auto flex flex-col bg-gray-100"
            style={{ height: "99svh" }}
        >
            <Head title={`${conversation.name} Settings`} />

            <div className="flex flex-row gap-2 items-center p-5">
                <div
                    onClick={() => history.back()}
                    className="cursor-pointer p-2 bg-gray-300 rounded-full hover:bg-gray-300"
                >
                    <ChevronLeftIcon className="w-5 h-5 text-blue-500 " />
                </div>
            </div>
            <ApplicationLogo className="w-20 h-20 fill-current text-gray-500 self-center" />
            <h3 className="text-3xl text-center text-blue-500 my-6">
                {conversation.name}
                <p className="text-sm text-gray-500">
                    {conversation.type.toLocaleUpperCase()} ROOM
                </p>
            </h3>
            {conversation.type === "private" && (
                <div className="flex flex-row justify-center gap-2 p-6">
                    <NewUser conversationId={conversation.id} />
                </div>
            )}
            <div className="flex flex-col gap-2 p-6">
                <h3 className="text-2xl text-gray-500">
                    {conversation.type === "private"
                        ? "Members"
                        : "Online Users"}{" "}
                    {conversation.type === "private" &&
                        `(${conversation.members.length})`}
                </h3>
                {conversation.type === "private" &&
                    conversation.members.map((member) => (
                        <Member
                            online={
                                usersOnline.find((u) => u.id === member.user_id)
                                    ? true
                                    : false
                            }
                            key={member.id}
                            nickname={member.user.nickname}
                            user_id={member.user_id}
                            added={member.created_at}
                        />
                    ))}
                {conversation.type === "public" &&
                    usersOnline.map((user) => (
                        <Member
                            online={true}
                            key={user.id}
                            nickname={user.nickname}
                            user_id={user.id}
                        />
                    ))}
            </div>
            <div className="flex flex-col gap-2 p-6">
                {conversation.type === "private" && (
                    <div
                        onClick={handleLeave}
                        className="cursor-pointer bg-gray-300 flex flex-row justify-between items-center p-3 rounded-xl"
                    >
                        <p className="text-red-500">Leave this room</p>
                        <ArrowRightStartOnRectangleIcon className="w-5 h-5 text-red-500" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatDetails;
