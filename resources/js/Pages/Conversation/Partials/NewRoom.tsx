import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import React, { FormEventHandler, useState } from "react";

interface Props {}
const NewRoom: React.FC<Props> = (props) => {
    const { data, setData, post, reset, errors } = useForm({
        name: "",
        type: "private",
    });

    const [show, setShow] = useState(false);
    const handleSave: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("conversation.new"), {
            onSuccess: () => {
                reset();
                setShow(false);
            },
        });
    };

    return (
        <div>
            <PrimaryButton onClick={() => setShow(true)}>
                Create Room
            </PrimaryButton>
            <Modal maxWidth="lg" show={show} onClose={() => setShow(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Create New Chat Room
                    </h2>
                    <form onSubmit={handleSave} method="post">
                        <InputLabel htmlFor="name" value="Enter Room Name" />
                        <TextInput
                            id="name"
                            type="text"
                            name="nickname"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="mt-1 block w-full"
                            isFocused
                            placeholder="Enter room name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                        <div className="flex items-center gap-2 mt-4">
                            <input
                                checked={data.type === "private"}
                                onChange={() =>
                                    setData(
                                        "type",
                                        data.type === "public"
                                            ? "private"
                                            : "public"
                                    )
                                }
                                type="checkbox"
                                name="private"
                                id="private"
                            />
                            <InputLabel
                                htmlFor="private"
                                value="Private Room"
                            />
                        </div>
                        <div className="mt-2">
                            <p className="text-gray-500 text-sm">
                                This room will be {data.type}{" "}
                            </p>
                        </div>
                        <PrimaryButton className="mt-4">
                            Create Room
                        </PrimaryButton>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default NewRoom;
