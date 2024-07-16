import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm } from "@inertiajs/react";
import React, { FormEventHandler, useState } from "react";

interface Props {
    nickname: string | null;
}
const CreateNickname: React.FC<Props> = (props) => {
    const { data, setData, post, reset, errors } = useForm({
        nickname: "",
        pin: "",
    });
    const [show, setShow] = useState(props.nickname === undefined);
    const handleSave: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("nickname"), {
            onSuccess: () => {
                reset();
                setShow(false);
            },
        });
    };

    return (
        <div>
            <Modal show={show} onClose={() => {}}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">
                        Welcome to Pixel chat. Please create a nickname & PIN to
                        start any conversation or join chat rooms.
                    </h2>
                    <form onSubmit={handleSave} method="post">
                        <div>
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
                                placeholder="Enter Nickname"
                            />
                            <InputError
                                message={errors.nickname}
                                className="mt-2"
                            />
                        </div>
                        <div className="mt-2">
                            <InputLabel htmlFor="name" value="PIN" />
                            <TextInput
                                minLength={4}
                                maxLength={4}
                                id="name"
                                type="text"
                                name="password"
                                value={data.pin}
                                onChange={(e) => setData("pin", e.target.value)}
                                className="mt-1 block w-3/4 md:w-1/4"
                                isFocused
                                placeholder="Create 4 Digit PIN"
                                autoComplete="off"
                            />
                            <span className="text-gray-500 text-xs">
                                This use to recover your chats on another web
                                browser or to access your existing chats.
                            </span>
                            <InputError message={errors.pin} className="mt-2" />
                        </div>
                        <div className="mt-2">
                            Do you have an existing account ?{" "}
                            <Link
                                className="text-blue-500"
                                href={route("login")}
                            >
                                Login here.
                            </Link>
                        </div>
                        <PrimaryButton className="mt-4">
                            Save Nickname & PIN
                        </PrimaryButton>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default CreateNickname;
