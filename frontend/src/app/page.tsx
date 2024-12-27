import React from 'react'
// import { useRouter } from 'next/navigation'
// import Chessboard from '@chrisoakman/chessboardjs'
import Link from 'next/link'

function page() {

  // const router = useRouter()

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <Link href='/chessboard' className='w-44 h-16 bg-green-400 text-3xl font-bold mx-auto text-center flex justify-center rounded-md items-center'>Play</Link>
    </div>
  )
}

export default page
