import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';

const WEBSOCKET_ENDPOINT = '/ws';

export const connectWebSocket = (
    onConnect: (client: Stomp.Client) => void,
    onError: (error: string | Stomp.Frame) => void
) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_BASE_URL) {
        onError('NEXT_PUBLIC_API_URL is not defined.');
        return;
    }

    // Strip http(s):// for SockJS
    const socketUrl = `${API_BASE_URL.replace(/^https?:\/\//, '')}${WEBSOCKET_ENDPOINT}`;
    const socket = new SockJS(socketUrl);
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
