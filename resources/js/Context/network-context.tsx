import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

type childrenType = {
    children: React.ReactNode;
};

type networkStatusContextType = {
    isOnline: boolean;
};

const NetworkContext = createContext<networkStatusContextType | null>(null);

export const NetworkProvider = ({ children }: childrenType) => {
    const [isOnline, setOnline] = useState<boolean>((): boolean => {
        return navigator.onLine;
    });

    const setOnlineToTrue = useCallback((): void => {
        setOnline(true);
    }, []);
    const setOnlineToFalse = useCallback((): void => {
        setOnline(false);
    }, []);

    useEffect(() => {
        window.addEventListener("online", setOnlineToTrue);
        window.addEventListener("offline", setOnlineToFalse);

        return () => {
            window.removeEventListener("online", setOnlineToTrue);
            window.removeEventListener("offline", setOnlineToFalse);
        };
    }, [setOnlineToTrue, setOnlineToFalse]);

    return (
        <NetworkContext.Provider value={{ isOnline }}>
            {children}
        </NetworkContext.Provider>
    );
};

export const useNetworkCheck = () => {
    const context = useContext(NetworkContext);
    if (!!!context) {
        throw Error("useNetworkCheck must be used inside of NetworkProvider");
    }

    return context;
};
