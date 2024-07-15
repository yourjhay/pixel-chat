import axios from "axios";
window.axios = axios;
import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

const PUSHER_KEY = import.meta.env.VITE_PUSHER_APP_KEY;
const PUSHER_HOST = import.meta.env.VITE_PUSHER_HOST;
const PUSHER_APP_ID = import.meta.env.VITE_PUSHER_APP_ID;
const PUSHER_APP_SECRET = import.meta.env.VITE_PUSHER_APP_SECRET;
const PUSHER_SCHEME = import.meta.env.VITE_PUSHER_SCHEME;
const PUSHER_PORT = import.meta.env.VITE_PUSHER_PORT;
const PUSHER_APP_CLUSTER = import.meta.env.VITE_PUSHER_APP_CLUSTER;

declare global {
    interface Window {
        Pusher: any;
        Echo: Echo;
    }
}
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: "pusher",
    key: PUSHER_KEY,
    wsHost: PUSHER_HOST,
    wsPort: PUSHER_PORT,
    wssPort: PUSHER_PORT,
    forceTLS: false,
    encrypted: true,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
    cluster: PUSHER_APP_CLUSTER,
});
