import { PUBLIC_BACKEND_ADDR } from '$env/static/public';

export const BACKEND_ADDR = PUBLIC_BACKEND_ADDR;

// change PUBLIC_BACKEND_ADDR's `http` to `ws`; change `https` to `wss`
export const BACKEND_ADDR_WEBSOCKET = (() => {
    const url = new URL(PUBLIC_BACKEND_ADDR);
    url.protocol = url.protocol.replace('http', 'ws');
    return url.toString();
})();


export const LOCAL_STORAGE_KEY = {
    AUTH: {
        OBJ: 'auth/obj',
        EXPIRES_AT: 'auth/expires_at'
    },
};

