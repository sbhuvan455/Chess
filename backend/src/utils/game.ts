import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { DRAW, LOST, MESSAGE_TYPE, MOVE, MOVES, RESIGN, WIN } from "../types";


// The Game Class

export class Game {
    private board: Chess;
    private player1: WebSocket;
    private player2: WebSocket;
    private moves: MOVES[];
    private onGameOver: (game: Game) => void;

    constructor(player1: WebSocket, player2: WebSocket, onGameOver: (game: Game) => void) {
        this.board = new Chess();
        this.player1 = player1;
        this.player2 = player2;
        this.moves = [];
        this.onGameOver = onGameOver;

        this.socketHandler(player1);
        this.socketHandler(player2);
    }

    private cleanup(): void {
        this.player1.removeListener("message", this.socketHandler);
        this.player2.removeListener("message", this.socketHandler);
        this.onGameOver(this);
    }

    // Function to handle the moves
    private socketHandler(socket: WebSocket){
        socket.on('message', (message: MESSAGE_TYPE) => {
            const data = JSON.parse(message.toString());

            switch(data.type){
                case MOVE:
                    const move = data.payload;

                    try {
                        const moveData = this.board.move(move)

                        if(moveData){
                            this.moves.push(move);

                            // Check if there is a checkmate
                            if(this.board.isCheckmate()){

                                if(this.player1 == socket){
                                    this.player1.send(JSON.stringify({
                                        type: WIN,
                                        payload: "You won the game"
                                    }))

                                    this.player2.send(JSON.stringify({
                                        type: LOST,
                                        payload: "You lost the game"
                                    }))
                                }else{
                                    this.player1.send(JSON.stringify({
                                        type: LOST,
                                        payload: "You lost the game"
                                    }))

                                    this.player2.send(JSON.stringify({
                                        type: WIN,
                                        payload: "You won the game"
                                    }))
                                }

                                this.cleanup();
                            }

                            // check if there is a draw
                            if(this.board.isStalemate() || this.board.isThreefoldRepetition() || this.board.isInsufficientMaterial()){
                                this.player1.send(JSON.stringify({
                                    type: DRAW,
                                    payload: "The game is a draw"
                                }))

                                this.player2.send(JSON.stringify({
                                    type: DRAW,
                                    payload: "The game is a draw"
                                }))

                                this.cleanup();
                            }

                            this.player1.send(JSON.stringify({
                                type: MOVE,
                                payload: moveData,
                                board: this.board.fen(),
                                moveNumber: this.board.moveNumber()
                            }))

                            this.player2.send(JSON.stringify({
                                type: MOVE,
                                payload: moveData,
                                board: this.board.fen(),
                                moveNumber: this.board.moveNumber()
                            }))
                        }
                    } catch (error) {
                        socket.send(JSON.stringify({
                            type: MOVE,
                            payload: "Invalid Move"
                        }))
                    }
                    break;

                case RESIGN:
                    if(this.player1 == socket){
                        this.player1.send(JSON.stringify({
                            type: LOST,
                            payload: "You lost the game by Resignation"
                        }))

                        this.player2.send(JSON.stringify({
                            type: WIN,
                            payload: "You won the game by Resignation"
                        }))
                    }else{
                        this.player1.send(JSON.stringify({
                            type: WIN,
                            payload: "You won the game"
                        }))

                        this.player2.send(JSON.stringify({
                            type: LOST,
                            payload: "You lost the game"
                        }))
                    }
                    break;
            }
        })
    }

}