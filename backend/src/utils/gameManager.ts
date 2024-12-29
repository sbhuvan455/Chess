// Game manager for a multiplayer chess game

import { DISCONNECT, INIT_GAME, MESSAGE_TYPE } from "../types";
import { WebSocket } from "ws";
import { Game } from "./game";
import { BLACK, WHITE } from "chess.js";

export class GameManager {
    private pendingUser: WebSocket | null;
    private users: WebSocket[];
    private ActiveGames: Set<Game>; 


    constructor() {
        this.pendingUser = null;
        this.users = [];
        this.ActiveGames = new Set<Game>();
    }

    public addUser(user: WebSocket): void {
        // add the user to the user array
        this.users.push(user);

        // attach the socket with the socket handlers
        this.socketHandlers(user);
    }

    public removeUser(user: WebSocket): void {
        const index = this.users.indexOf(user);
        if(index > -1){
            this.users.splice(index, 1);
        }
    }

    private socketHandlers(socket: WebSocket): void {
        socket.on('message', (message: MESSAGE_TYPE) => {
            const data = JSON.parse(message.toString());

            switch(data.type){
                case INIT_GAME:
                    // Start the game by initializing the game object

                    if(this.pendingUser === null){
                        this.pendingUser = socket;
                    }else{
                        const game = new Game(this.pendingUser, socket, this.cleanupGame.bind(this));
                        this.ActiveGames.add(game);

                        this.pendingUser.send(JSON.stringify({
                            type: INIT_GAME,
                            payload: {
                                color: WHITE,
                                message: 'You are white'
                            }
                        }))

                        socket.send(JSON.stringify({
                            type: INIT_GAME,
                            payload: {
                                color: BLACK,
                                message: 'You are black'
                            }
                        }))

                        this.pendingUser = null;
                    }

                    break;

                case DISCONNECT:
                    this.removeUser(socket);

                    if(this.pendingUser === socket){
                        this.pendingUser = null;
                    }
                    
                    break;
            }
        })
    }

    private cleanupGame(game: Game): void {
        this.ActiveGames.delete(game);
    }
}