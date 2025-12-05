import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import type { Client, Frame } from 'stompjs';

const WEBSOCKET_ENDPOINT = '/ws';

// Interop check to handle various module formats
const SockJSConstructor = (SockJS as any).default || SockJS;

export const connectWebSocket = (
    onConnect: (client: Client) => void,
    onError: (error: string | Frame) => void
): Client | null => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_BASE_URL) {
        onError('NEXT_PUBLIC_API_URL is not defined.');
        return null;
    }

    // FIX: Do NOT strip the protocol. SockJS needs the full URL (e.g., http://localhost:8080/ws)
    // when connecting to a server that is not the same origin as the frontend.
    const socketUrl = `${API_BASE_URL}${WEBSOCKET_ENDPOINT}`;

    const socket = new SockJSConstructor(socketUrl);

    const stompClient = Stomp.over(socket);

    stompClient.connect({},
        (frame: Stomp.Frame | undefined) => {
            console.log('Connected: ' + frame);
            onConnect(stompClient);
        },
        (error: string | Stomp.Frame) => {
            console.error('WebSocket connection error:', error);
            onError(error);
        }
    );

    return stompClient;
};
