"use client"

import { useSocket } from '@/hooks/useSocket'
import { INIT_GAME } from '@/types';
import { useRouter } from 'next/navigation';
import React from 'react'

// import Chessboard from '@chrisoakman/chessboardjs'

function page() {

  // const socket: WebSocket | null = useSocket();
  const router = useRouter();

  const startGame = () => {
    // socket?.send(JSON.stringify({ type: INIT_GAME, payload: "Start game" }));

    router.push('/game')
  }

  return (
    <div className='flex items-center justify-center h-screen gap-10'>
      <img src="chessboard.png" alt="chessboard" className='h-1/2'/>
      <button className='w-44 h-16 bg-green-400 text-3xl font-bold rounded-md' onClick={startGame}>Play</button>
    </div>
  )
}

export default page
