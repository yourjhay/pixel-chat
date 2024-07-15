import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { useForm } from "@inertiajs/react";
import React, { FormEventHandler, useState } from "react";

interface Props {
    conversationId: number;
}
const NewUser: React.FC<Props> = (props) => {
    const { data, setData, post, reset, errors } = useForm({
        nickname: "",
        conversation_id: props.conversationId,
    });

    const [show, setShow] = useState(false);
    const handleSave: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("conversation.user.add"), {
            onSuccess: () => {
                reset();
                setShow(false);
            },
        });
    };

    return (
        <div>
            <div
                className="cursor-pointer p-2 bg-gray-300 rounded-full hover:bg-gray-300"
                onClick={() => setShow(true)}
            >
                <UserPlusIcon className="w-5 h-5" />
            </div>
            <Modal show={show} onClose={() => setShow(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        ADD USER TO THIS ROOM
                    </h2>
                    <p>
                        If you add this user to this room, they will be able to
                        join and sent messages
                    </p>
                    <form onSubmit={handleSave} method="post" className="mt-4">
                        <InputLabel htmlFor="name" value="Nickname" />
                        <TextInput
                            id="name"
                            type="text"
                            name="nickname"
                            value={data.nickname}
                            onChange={(e) =>
                                setData("nickname", e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="Enter user nickname"
                        />
                        <InputError
                            message={errors.nickname}
                            className="mt-2"
                        />

                        <PrimaryButton className="mt-4 mr-2">
                            Add {data.nickname}
                        </PrimaryButton>
                        <SecondaryButton onClick={() => setShow(false)}>
                            Cancel
                        </SecondaryButton>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default NewUser;
