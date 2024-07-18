import { useNetworkCheck } from "@/Context/network-context";

function NetworkStatus() {
    const { isOnline } = useNetworkCheck();
    return (
        <div>
            {!isOnline && (
                <div className="w-2/3 md:max-w-sm text-center text-gray-700 bg-pink-200 p-2 rounded-lg  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <p>
                        Pixel Chat can't connect to internet.
                        <br /> Please check your internet connection.
                    </p>
                </div>
            )}
        </div>
    );
}

export default NetworkStatus;
