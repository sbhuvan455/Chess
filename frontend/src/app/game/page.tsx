"use client"
import { useSocket } from '@/hooks/useSocket'
import { DRAW, INIT_GAME, LOST, MESSAGE_TYPE, MOVE, WIN } from '@/types';
import { Chess } from 'chess.js';
import React, { useEffect, useState } from 'react'
import { WHITE, BLACK } from 'chess.js';

function Game() {

    const socket = useSocket();
    const [board, setBoard] = useState(new Chess());
    const [color, setColor] = useState(WHITE);

    useEffect(() => {
        if(socket){
            socket.onmessage = (event) => {
                // const data = JSON.parse(message.toString());
                console.log("The event is: ", event);

                const message = JSON.parse(event.data) as MESSAGE_TYPE;

                switch(message.type){
                    case INIT_GAME:
                        // Set the board
                        setBoard(new Chess());

                        // Set the color
                        if(message.payload.color === WHITE){
                            setColor(WHITE);
                        }else{
                            setColor(BLACK);
                        }

                        break;
                    case MOVE:
                        // Update the board using fen
                        setBoard(message.payload.board);
                        break;
                    case WIN:
                        console.log(message.payload);
                        break;
                    case LOST:
                        console.log(message.payload);
                        break;
                    case DRAW:
                        console.log(message.payload);
                        break;
                    default:
                        break;
                }
            }
        }
    }, [socket])

    if (!socket) return <div>Connecting...</div>

    return (
        <div>
            Hello
        </div>
    )
}

export default Game
