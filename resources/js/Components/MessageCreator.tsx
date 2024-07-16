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
    image: File | null;
    clearFile: () => void;
    progress: AxiosProgressEvent | null;
}
function MessageCreator({ ...props }: Props) {
    const fileRef = React.createRef<HTMLInputElement>();
    const [image, setImage] = useState<string>("");
    const [fileKey, setFileKey] = useState<string>(Math.random().toString(36));
    useEffect(() => {
        if (props.image) {
            const imguri = URL.createObjectURL(props.image as File);
            setImage(imguri);
        }
    }, [props.image]);

    return (
        <div className="flex flex-row items-start  grow p-1 border border-blue-500 rounded-lg">
            <input
                accept="image/*"
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
                {props.errors.image && (
                    <div className="text-red-500 text-xs ml-3">
                        {props.errors.image}
                    </div>
                )}

                {props.image && (
                    <div className="relative w-20 bg-gray-200 rounded-lg">
                        <TrashIcon
                            className="w-5 h-5 cursor-pointer text-red-500 absolute top-0 right-0 cursor-pointer"
                            onClick={() => {
                                props.clearFile();
                                setFileKey(Math.random().toString(36));
                            }}
                        />
                        {props.progress && (
                            <progress
                                className="w-20 absolute bottom-8 h-2 rounded-lg"
                                value={props.progress?.percentage}
                                max="100"
                            />
                        )}
                        <img
                            src={image}
                            className="w-20 h-20 rounded-lg object-cover mt-1 mb-1"
                        />
                    </div>
                )}
            </div>
            <button
                type="submit"
                disabled={props.processing || (!props.message && !props.image)}
            >
                <PaperAirplaneIcon className="w-8 h-8 text-blue-700 mt-1" />
            </button>
        </div>
    );
}

export default MessageCreator;
