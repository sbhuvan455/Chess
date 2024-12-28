// "use client"
// import { useSocket } from '@/hooks/useSocket'
// import { DRAW, INIT_GAME, LOST, MESSAGE_TYPE, MOVE, WIN } from '@/types';
// import { Chess, Square } from 'chess.js';
// import React, { useEffect, useState } from 'react'
// import { WHITE, BLACK } from 'chess.js';
// import Image from 'next/image';

// function Game() {

//     const socket = useSocket();
//     const [board, setBoard] = useState(new Chess());
//     const [boardPosition, setBoardPosition] = useState(board.board());
//     const [color, setColor] = useState(WHITE);
//     const [gameStarted, setGameStarted] = useState<boolean>(false);
//     const [availableSquares, setAvailableSquares] = useState<string[]>([]);
//     const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

//     useEffect(() => {

//         console.log("I am inside useEffect hook")
//         if(socket){
//             socket.onmessage = (event) => {
//                 // const data = JSON.parse(message.toString());
//                 console.log("I am attaching to socket event");
//                 console.log("The event is: ", event);

//                 const message = JSON.parse(event.data) as MESSAGE_TYPE;

//                 switch(message.type){
//                     case INIT_GAME:
//                         // Set the board
//                         setBoard(new Chess());
//                         console.log(message.payload.message);

//                         // Set the color
//                         if(message.payload.color === WHITE){
//                             console.log("Setting color to white");
//                             setColor(WHITE);
//                         }else{
//                             console.log("Setting color to black");
//                             setColor(BLACK);
//                         }

//                         break;
//                     case MOVE:
//                         // Update the board using fen
//                         board.move({
//                             from: message.payload.from,
//                             to: message.payload.to
//                         })

//                         setBoardPosition(board.board());
//                         break;
//                     case WIN:
//                         console.log(message.payload);
//                         break;
//                     case LOST:
//                         console.log(message.payload);
//                         break;
//                     case DRAW:
//                         console.log(message.payload);
//                         break;
//                     default:
//                         break;
//                 }
//             }
//         }
//     }, [socket]) 

//     console.log(`The color is: ${color}`);

//     const currentPosition = color === 'w' ? boardPosition : boardPosition.reverse();

//     // console.log("The current position is here: ", currentPosition);

//     const availableMoves = (col: any, squarePosition: string) => {

//         if(!selectedSquare || col?.color != color){
//             console.log("The condition is satisfied and returning from here.");
//             setAvailableSquares([]);
//             setSelectedSquare(null);

//             return;
//         }

//         if(selectedSquare && col?.color != color){

//             // console.log("Selected square is: ", selectedSquare);
//             // console.log("Target square is: ", squarePosition);

//             console.log("Making a move to the selected square", squarePosition);

//             socket?.send(
//                 JSON.stringify({
//                     type: MOVE,
//                     payload: {
//                         from: selectedSquare,
//                         to: squarePosition
//                     }
//                 })
//             )

//             setAvailableSquares([]);
//             setSelectedSquare(null);
//         }else{
//             const possibleMoves = col?.square ? board.moves({ square: col?.square }) : [];
//             // console.log(`Possible moves for ${col?.square} are: `, possibleMoves)
//             setAvailableSquares(possibleMoves);
//             setSelectedSquare(col?.square);
//         }

//         console.log("availble squares: ", availableSquares);
//         console.log("selected square: ", selectedSquare);
//     }

//     if (!socket) return <div>Connecting...</div>

//     if(!gameStarted){
//         return (
//             <div className='min-h-screen flex items-center justify-center bg-gray-100'>
//                 <div className='w-[50vw] text-center'>
//                     <button className='w-44 h-16 bg-green-400 text-3xl font-bold rounded-md' onClick={() => {
//                         socket.send(JSON.stringify({ type: INIT_GAME, payload: "Start game" }));
//                         setGameStarted(true);
//                     }}>Start Game</button>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div className='min-h-screen flex items-center justify-center bg-gray-100'>
//             <div className='w-[50vw] text-center'>
//                 {
//                     currentPosition.map((row, rowIndex) => {
//                         return (
//                             <div key={rowIndex} className='flex'>
//                             {
//                                 row.map((col, colIndex) => {

//                                     const squarePosition = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`;
//                                     const highlighted = availableSquares.includes(squarePosition);

//                                     return (
//                                         <div key={colIndex} onClick={() => availableMoves(col, squarePosition)} className={`w-14 h-14 flex items-center justify-center ${highlighted ? 'bg-yellow-200' : rowIndex % 2 === 0 ? colIndex % 2 == 0 ? 'bg-white' : 'bg-green-300' : colIndex % 2 === 0 ? 'bg-green-300' : 'bg-white'} ${col?.color === 'b' ? 'text-black' : 'text-white'}`}>
//                                         {col?.type ? <Image src={`/chess-pieces/${col.color}-${col.type}.png`} alt={`${col.color}-${col.type}`} width={50} height={50} /> : ""}
//                                         </div>
//                                     )

//                                 })
//                             }
//                             </div>
//                         )
//                     })
//                 }
//                 </div>
//         </div>
//     )
// }

// export default Game
"use client";

import { useSocket } from '@/hooks/useSocket';
import { DRAW, INIT_GAME, LOST, MESSAGE_TYPE, MOVE, WIN } from '@/types';
import { Chess, Square } from 'chess.js';
import React, { useEffect, useState } from 'react';
import { WHITE, BLACK } from 'chess.js';
import Image from 'next/image';

function Game() {
    const socket = useSocket();
    const [board, setBoard] = useState(new Chess());
    const [color, setColor] = useState(WHITE);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [availableSquares, setAvailableSquares] = useState<string[]>([]);
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const message = JSON.parse(event.data) as MESSAGE_TYPE;

                switch (message.type) {
                    case INIT_GAME:
                        setBoard(new Chess());
                        setColor(message.payload.color === WHITE ? WHITE : BLACK);
                        break;

                    case MOVE:
                        const { after } = message.payload;
                        setBoard(new Chess(after));
                        break;

                    case WIN:
                        alert(`You win! ${message.payload.reason}`);
                        break;

                    case LOST:
                        alert(`You lost! ${message.payload.reason}`);
                        break;

                    case DRAW:
                        alert("The game is a draw!");
                        break;

                    default:
                        console.warn("Unknown message type:", message.type);
                }
            };
        }

        return () => {
            if (socket) {
                socket.onmessage = null;
            }
        };
    }, [socket]);

    const handleMove = (squarePosition: string) => {
        const piece = board.get(squarePosition as Square);

        // Allow movement only if the piece matches the player's color
        if (selectedSquare && availableSquares.includes(squarePosition)) {
            socket?.send(
                JSON.stringify({
                    type: MOVE,
                    payload: {
                        from: selectedSquare,
                        to: squarePosition,
                    },
                })
            );
            setAvailableSquares([]);
            setSelectedSquare(null);
        } else if (piece && piece.color === color) {
            const moves = board.moves({ square: squarePosition as Square, verbose: true });
            const targets = moves.map((move) => move.to);
            setAvailableSquares(targets);
            setSelectedSquare(squarePosition as Square);
        } else {
            setAvailableSquares([]);
            setSelectedSquare(null);
        }
    };

    if (!socket) return <div>Connecting...</div>;

    if (!gameStarted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-[50vw] text-center">
                    <button
                        className="w-44 h-16 bg-green-400 text-3xl font-bold rounded-md"
                        onClick={() => {
                            socket.send(JSON.stringify({ type: INIT_GAME }));
                            setGameStarted(true);
                        }}
                    >
                        Start Game
                    </button>
                </div>
            </div>
        );
    }

    const boardPosition = color === WHITE ? board.board() : board.board().reverse();
    const ranks = color === WHITE 
        ? [...Array(8)].map((_, i) => 8 - i)  // White's perspective: [8, 7, ..., 1]
        : [...Array(8)].map((_, i) => i + 1); // Black's perspective: [1, 2, ..., 8]

    const files = color === WHITE 
        ? [...Array(8)].map((_, i) => String.fromCharCode(97 + i))  // White's perspective: ['a', 'b', ..., 'h']
        : [...Array(8)].map((_, i) => String.fromCharCode(104 - i)); // Black's perspective: ['h', 'g', ..., 'a']

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="relative w-[50vw] text-center">
                <div className="absolute -left-8 top-0 h-full flex flex-col justify-around">
                    {ranks.map((rank) => (
                        <div key={rank} className="h-14 flex items-center justify-center text-lg font-bold">
                            {rank}
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-0 -mb-8 w-full flex justify-around">
                    {files.map((file) => (
                        <div key={file} className="w-14 text-lg font-bold">
                            {file}
                        </div>
                    ))}
                </div>
                {boardPosition.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                        {row.map((col, colIndex) => {
                            const squarePosition =
                                color === WHITE
                                    ? `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`
                                    : `${String.fromCharCode(97 + (colIndex))}${rowIndex + 1}`;
                            const isHighlighted = availableSquares.includes(squarePosition);

                            return (
                                <div
                                    key={colIndex}
                                    onClick={() => handleMove(squarePosition)}
                                    className={`w-14 h-14 flex items-center justify-center ${
                                        isHighlighted ? "bg-yellow-200" : ""
                                    } ${
                                        (rowIndex + colIndex) % 2 === 0 ? "bg-green-300" : "bg-white"
                                    }`}
                                >
                                    {col?.type && (
                                        <Image
                                            src={`/chess-pieces/${col.color}-${col.type}.png`}
                                            alt={`${col.color}-${col.type}`}
                                            width={50}
                                            height={50}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Game;
