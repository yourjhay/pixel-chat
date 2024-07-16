import { PhotoIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

interface Props {
    isTyping: () => void;
    message: string;
    errors: any;
    processing: boolean;
    setMessage: (key: string, value: string) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    image: File | null;
}
function MessageCreator({ ...props }: Props) {
    const fileRef = React.createRef<HTMLInputElement>();
    const [image, setImage] = useState<string>("");
    useEffect(() => {
        if (props.image) {
            const imguri = URL.createObjectURL(props.image as File);
            setImage(imguri);
        }
    }, [props.image]);

    return (
        <div className="flex flex-row  grow">
            <input
                accept="image/*"
                onChange={props.onFileChange}
                ref={fileRef}
                type="file"
                className="hidden"
            />
            <PhotoIcon
                onClick={() => fileRef.current?.click()}
                className="w-10 h-10 mr-3 text-blue-500 mt-1"
            />
            <div className="w-full">
                <input
                    placeholder="Message"
                    autoComplete="off"
                    onKeyDown={props.isTyping}
                    className="input w-full text-lg rounded-lg"
                    type="text"
                    name="message"
                    value={props.message}
                    onChange={(e) =>
                        props.setMessage("message", e.target.value)
                    }
                />
                {props.errors.message && (
                    <div className="text-red-500">{props.errors.message}</div>
                )}
                {props.processing && (
                    <div className="text-gray-500 text-xs">Sending...</div>
                )}
                {props.image && (
                    <img
                        src={image}
                        className="w-20 h-20 object-cover mt-1 mb-1"
                    />
                )}
            </div>
        </div>
    );
}

export default MessageCreator;
