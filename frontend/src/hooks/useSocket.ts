// Creating a custom hook to handle socket connection

"use client"

import { DISCONNECT } from "@/types";
import { useEffect, useState } from "react";


// const WS_URL = "https://chess-nkxr.onrender.com";
const WS_URL = "ws://localhost:8080";

export const useSocket = (): WebSocket | null => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            setSocket(ws);
        };

        ws.onclose = () => {
            setSocket(null);
        };

        return () => {
            socket?.send(JSON.stringify({
                type: DISCONNECT,
                payload: {}
            }))

            ws.close();
        };

    }, [])

    return socket;
}