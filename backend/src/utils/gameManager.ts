// Game manager for a multiplayer chess game

import { INIT_GAME, MESSAGE_TYPE } from "../types";
import { WebSocket } from "ws";

export class GameManager {
    private pendingUser: WebSocket | null;
    private users: WebSocket[];


    constructor() {
        this.pendingUser = null;
        this.users = [];
    }

    public addUser(user: WebSocket): void {
        // add the user to the user array
        this.users.push(user);

        // attach the socket with the socket handlers
        this.socketHandlers(user);
    }

    private socketHandlers(socket: WebSocket): void {
        socket.on('message', (message: MESSAGE_TYPE) => {
            const data = JSON.parse(message.toString());

            switch(data.type){
                case INIT_GAME:
                    // send the message to the other user
                    socket.send(JSON.stringify({
                        type: INIT_GAME,
                        payload: data.payload,
                        data: "The game has been started"
                    }))
                    break;
                default:
                    console.log('Unknown message type');
            }
        })
    }
}