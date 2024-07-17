import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";

import { AxiosProgressEvent } from "axios";
import React, { useEffect, useState } from "react";

interface Props {
    isTyping: () => void;
    message: string;
    errors: any;
    processing: boolean;
    setMessage: (key: string, value: string) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    attachment: File | null;
    clearFile: () => void;
    progress: AxiosProgressEvent | null;
}
function MessageCreator({ ...props }: Props) {
    const fileRef = React.createRef<HTMLInputElement>();
    const [image, setImage] = useState<string>("");
    const [fileKey, setFileKey] = useState<string>(Math.random().toString(36));
    useEffect(() => {
        if (props.attachment?.type.includes("image")) {
            const imgUri = URL.createObjectURL(props.attachment as File);
            setImage(imgUri);
        }
        if (props.attachment?.type.includes("video")) {
            const videoUri = URL.createObjectURL(props.attachment as File);
            setImage(videoUri);
        }
    }, [props.attachment]);

    return (
        <div className="flex flex-row items-start  grow p-1 mx-2 border border-blue-500 rounded-lg">
            <input
                accept="video/*,image/jpeg,image/png,image/gif,image/webp,image/jpg"
                onChange={props.onFileChange}
                ref={fileRef}
                type="file"
                key={fileKey}
                className="hidden"
            />
            <PhotoIcon
                onClick={() => fileRef.current?.click()}
                className="w-10 h-10 mr-1 text-blue-500 mt-1 "
            />
            <div className="w-full">
                <input
                    placeholder="Message"
                    autoComplete="off"
                    onKeyDown={props.isTyping}
                    className="input border-none focus:ring-0 w-full text-lg rounded-lg"
                    type="text"
                    name="message"
                    value={props.message}
                    onChange={(e) =>
                        props.setMessage("message", e.target.value)
                    }
                />
                {props.processing && (
                    <div className="text-gray-500 text-xs ml-3">Sending...</div>
                )}
                {props.errors.message && (
                    <div className="text-red-500 text-xs ml-3">
                        {props.errors.message}
                    </div>
                )}
                {props.errors.message_attachment && (
                    <div className="text-red-500 text-xs ml-3">
                        {props.errors.message_attachment}
                    </div>
                )}
                <div className="relative w-20 bg-gray-200 rounded-lg">
                    {props.attachment?.type.includes("image") ||
                        (props.attachment?.type.includes("video") && (
                            <TrashIcon
                                className="z-10 w-5 h-5 cursor-pointer text-red-500 absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                    props.clearFile();
                                    setFileKey(Math.random().toString(36));
                                }}
                            />
                        ))}
                    {props.progress && (
                        <progress
                            className="w-20 absolute bottom-8 h-2 rounded-lg"
                            value={props.progress?.percentage}
                            max="100"
                        />
                    )}
                    {props.attachment?.type.includes("video") && (
                        <video
                            autoPlay={false}
                            controls={false}
                            preload={"none"}
                            src={image}
                            className="w-20 h-20 rounded-lg object-cover mt-1 mb-1"
                        />
                    )}

                    {props.attachment &&
                        props.attachment?.type.includes("image") && (
                            <img
                                src={image}
                                className="w-20 h-20 rounded-lg object-cover mt-1 mb-1"
                            />
                        )}
                </div>
            </div>
            <button
                type="submit"
                disabled={
                    props.processing || (!props.message && !props.attachment)
                }
            >
                <PaperAirplaneIcon className="w-8 h-8 text-blue-700 mt-1" />
            </button>
        </div>
    );
}

export default MessageCreator;
