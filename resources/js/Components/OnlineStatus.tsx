function OnlineStatus({ online }: { online: boolean }) {
    return (
        <div>
            {online ? (
                <div
                    title="online"
                    className="cursor-pointer rounded-full w-2 h-2 bg-green-500"
                />
            ) : (
                <div
                    title="offline"
                    className="cursor-pointer rounded-full w-2 h-2 bg-gray-400"
                />
            )}
        </div>
    );
}

export default OnlineStatus;
