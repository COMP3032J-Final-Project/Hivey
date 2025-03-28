/**
 * new URL("project", "http://localhost:8000/api") => "http://localhost:8000/project"
 * new URL("project", "http://localhost:8000/api/")  => "http://localhost:8000/api/project"
 * new URL("/project", "http://localhost:8000/api/")  => "http://localhost:8000/project"
 */

import { PUBLIC_BACKEND_ADDR } from '$env/static/public';


// Ensure BACKEND_ADDR ends with a trailing slash
export const BACKEND_ADDR = PUBLIC_BACKEND_ADDR.endsWith('/') 
    ? PUBLIC_BACKEND_ADDR 
    : `${PUBLIC_BACKEND_ADDR}/`;

// change PUBLIC_BACKEND_ADDR's `http` to `ws`; change `https` to `wss`
export const BACKEND_ADDR_WEBSOCKET = (() => {
    const url = new URL(PUBLIC_BACKEND_ADDR);
    url.protocol = url.protocol.replace('http', 'ws');
    // Ensure the websocket URL also ends with a trailing slash
    if (!url.pathname.endsWith('/')) {
        url.pathname += '/';
    }
    return url.toString();
})();


export const LOCAL_STORAGE_KEY = {
    AUTH: {
        OBJ: 'auth/obj',
        EXPIRES_AT: 'auth/expires_at'
    },
};

