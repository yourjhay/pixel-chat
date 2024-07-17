import { Conversation, PageProps } from "@/types";
import {
    ArrowRightStartOnRectangleIcon,
    ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import { Head, useForm } from "@inertiajs/react";
import moment from "moment";
import NewUser from "./Partials/AddUser";

interface Props {
    conversation: Conversation;
}
function ChatDetails({ auth, conversation }: PageProps & Props) {
    const { processing, post } = useForm();

    const handleLeave = () => {
        post(route("conversation.leave", conversation.id));
    };

    return (
        <div
            className="md:max-w-xl  mx-auto flex flex-col bg-gray-100"
            style={{ height: "98svh" }}
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
            <h3 className="text-3xl text-center text-blue-500 my-10">
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
                <h3 className="text-2xl">
                    Members ({conversation.members.length})
                </h3>
                {conversation.members.map((member) => (
                    <div
                        key={member.user.id}
                        className="bg-gray-300 flex flex-row justify-between items-center p-3 rounded-xl"
                    >
                        <p className="text-lg">
                            {member.user.nickname}{" "}
                            {conversation.user_id === member.user.id ? (
                                <span className="text-sm text-gray-500">
                                    (Owner)
                                </span>
                            ) : (
                                ""
                            )}
                        </p>
                        <p className="text-sm text-gray-500">
                            Added {moment(member.created_at).fromNow()}
                        </p>
                    </div>
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
