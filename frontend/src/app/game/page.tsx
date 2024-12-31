
"use client";

import { useSocket } from '@/hooks/useSocket';
import { ChessMove, DRAW, INIT_GAME, LOST, MESSAGE_TYPE, MOVE, Payload_Type, Result, WIN } from '@/types';
import { Chess, Square } from 'chess.js';
import React, { useEffect, useState } from 'react';
import { Loader2, Flag } from 'lucide-react';
import { WHITE, BLACK } from 'chess.js';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import Image from 'next/image';

function Game() {
    const socket = useSocket();
    const [board, setBoard] = useState(new Chess());
    const [color, setColor] = useState(WHITE);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [availableSquares, setAvailableSquares] = useState<string[]>([]);
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
    const [moves, setMoves] = useState<ChessMove[]>([]);
    const [result, setResult] = useState<Result | null>(null);
    // const [draggedSquare, setDraggedSquare] = useState<Square | null>(null);

    const toast = useToast();

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const message = JSON.parse(event.data) as MESSAGE_TYPE;

                switch (message.type) {
                    case INIT_GAME:
                        setBoard(new Chess());
                        // @ts-expect-error: The message.payload.color may not match the expected type
                        setColor(message.payload.color === WHITE ? WHITE : BLACK);
                        setGameStarted(true);
                        setIsWaiting(false);
                        break;

                    case MOVE:
                        const { after, from, to } = message.payload as Payload_Type;
                        const moveNumber = message.moveNumber
                        setBoard(new Chess(after));

                        setMoves((prevMoves) => [
                            ...prevMoves, 
                            { moveNumber, from, to } as ChessMove
                        ]);

                        break;

                    case WIN:
                        // alert(`You win! ${message.payload}`);
                        setResult({ result: "win", message: message.payload as string });
                        toast.toast({
                            title: "You win! 🏆",
                            description: message.payload as string,
                        });
                        break;

                    case LOST:
                        // alert(`You lost! ${message.payload}`);
                        setResult({ result: "lost", message: message.payload as string });
                        toast.toast({
                            title: "You lost! 😢",
                            description: message.payload as string,
                        });
                        break;

                    case DRAW:
                        // alert("The game is a draw!");
                        setResult({ result: "draw", message: message.payload as string });
                        toast.toast({
                            title: "The game is a draw! 🤝",
                            description: message.payload as string,
                        });
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

    const handleOnDrop = (e: React.DragEvent<HTMLDivElement>, squarePosition: string) => {
        e.preventDefault();
        // setDraggedSquare(null);
        const fromSquare = e.dataTransfer.getData("squarePosition");
    
        if (availableSquares.includes(squarePosition)) {
            socket?.send(
                JSON.stringify({
                    type: MOVE,
                    payload: {
                        from: fromSquare,
                        to: squarePosition,
                    },
                })
            );
            setAvailableSquares([]);
            setSelectedSquare(null);
        }
    };
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, squarePosition: string) => {
        const piece = board.get(squarePosition as Square);
        // setDraggedSquare(squarePosition as Square);
    
        if (piece && piece.color === color) {
            e.dataTransfer.setData("squarePosition", squarePosition);
            const moves = board.moves({ square: squarePosition as Square, verbose: true });
            const targets = moves.map((move) => move.to);
            setAvailableSquares(targets);
            setSelectedSquare(squarePosition as Square);
        }
    };
    
    

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleResign = () => {
        socket?.send(JSON.stringify({
            type: "resign",
            payload: {}
        }));
    }
    

    if (!socket) return <div>Connecting...</div>;

    if (!gameStarted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-[50vw] text-center">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-4 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => {
                            socket.send(JSON.stringify({ type: INIT_GAME }));
                            setGameStarted(true);
                            setIsWaiting(true);
                        }}
                    >
                        Start Game
                    </button>
                </div>
            </div>
        );
    }

    if (isWaiting) {
        return (
            <div className="text-center">
                <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mx-auto mb-4" />
                <p className="text-xl text-gray-700">Waiting for an opponent...</p>
                <p className="text-sm text-gray-500 mt-2">This won&apos;t take long!</p>
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
        <div className="min-h-screen bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 md:p-8">
            <Toaster />
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="relative">
                    <div className="border-8 border-amber-100 rounded-md overflow-hidden">
                    <div className="grid grid-cols-8 gap-0">

                        {boardPosition.map((row, rowIndex) => (
                            row.map((col, colIndex) => {
                                const squarePosition = color === WHITE
                                ? `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`
                                : `${String.fromCharCode(97 + colIndex)}${rowIndex + 1}`;
                                const isHighlighted = availableSquares.includes(squarePosition);

                                const resultHighlight = (result?.result === "win" || result?.result === "lost") && col?.type === 'k' 
                                                        ? result.result === "win" 
                                                            ? col.color === color 
                                                                ? <span>👑</span> 
                                                                : <span>🙁</span> 
                                                            : col.color === color 
                                                                ? <span>🙁</span>
                                                                : <span>👑</span>
                                                        : null;
            
                                return (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    onClick={() => handleMove(squarePosition)}
                                    className={`relative aspect-square flex items-center justify-center ${isHighlighted ? "ring-4 ring-yellow-300 z-10" : ""} ${(rowIndex + colIndex) % 2 !== 0 ? "bg-green-600" : "bg-amber-100"}
                                                cursor-pointer transition-all duration-200 hover:opacity-80`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, squarePosition)}
                                    onDrop={(e) => handleOnDrop(e, squarePosition)}
                                    onDragOver={handleDragOver}
                                >
                                    {col?.type && (
                                    <Image
                                        src={`/chess-pieces/${col.color}-${col.type}.png`}
                                        alt={`${col.color}-${col.type}`}
                                        width={50}
                                        height={50}
                                        className="w-3/4 h-3/4 object-contain"
                                    />
                                    )}
                                    {resultHighlight && (
                                        <div className="absolute top-0 right-0 text-xl">{resultHighlight}</div>
                                    )}
                                </div>
                                );
                            })
                        ))}
                    </div>
                    </div>
                    <div className="absolute -left-8 top-0 h-full flex flex-col justify-around">
                        {ranks.map((rank) => (
                            <div key={rank} className="h-full flex items-center justify-center text-amber-100 text-sm font-bold">
                            {rank}
                            </div>
                        ))}
                    </div>
                    <div className="absolute -bottom-8 left-0 w-full flex justify-around">
                        {files.map((file) => (
                            <div key={file} className="w-full text-center text-amber-100 text-sm font-bold">
                            {file}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="text-center bg-zinc-700 text-zinc-200 p-4 rounded-lg w-full md:w-72 h-96 overflow-y-auto">
                    <h2 className="text-lg font-bold mb-4 text-amber-100">Move History</h2>
                    <div className="space-y-2">
                        {moves.length > 0 ? (
                            moves.map((move, index) => (
                            <div key={index} className="grid grid-cols-[2rem_1fr_1fr] gap-2 items-center text-sm bg-zinc-600 p-2 rounded">
                                <span className="text-zinc-400">{move.moveNumber}.</span>
                                <span className="font-mono">{move.from}</span>
                                <span className="font-mono">{move.to}</span>
                            </div>
                            ))
                        ) : (
                            <p className="text-zinc-400 text-sm italic">No moves yet</p>
                        )}
                    </div>
                    <button
                        onClick={handleResign}
                        className="text-white flex items-center justify-center gap-1 text-center py-2 px-4 rounded transition duration-200 hover:text-red-500"
                    >
                        <Flag size={15}/>Resign
                    </button>
                    <div className="mt-8 w-full flex justify-center">
                </div>
                </div>
                </div>
            </div>
        </div>
    );
}

export default Game;
