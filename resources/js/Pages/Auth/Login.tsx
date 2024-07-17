import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect } from "react";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nickname: "",
        pin: "",
        remember: true,
    });

    useEffect(() => {
        return () => {
            reset("pin");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <h3 className="text-lg font-medium mb-4">Login</h3>
            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="username" value="Nickname" />

                    <TextInput
                        id="nickname"
                        type="text"
                        name="username"
                        value={data.nickname}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("nickname", e.target.value)}
                        placeholder="Enter your nickname"
                    />

                    <InputError message={errors.nickname} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="PIN" />

                    <TextInput
                        id="password"
                        type="text"
                        name="password"
                        value={data.pin}
                        className="mt-1 block w-1/2"
                        autoComplete="password"
                        onChange={(e) => setData("pin", e.target.value)}
                        placeholder="Your 4 Digit PIN"
                    />

                    <InputError message={errors.pin} className="mt-2" />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">
                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Forgot your PIN?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
                <div className="text-center mt-4">
                    <p>
                        Don't have an account?{" "}
                        <a
                            className="underline  text-gray-600 hover:text-gray-900"
                            href={route("conversation")}
                        >
                            Sign up & Chat
                        </a>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
