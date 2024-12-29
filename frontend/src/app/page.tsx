import Link from 'next/link'
import Image from 'next/image'

function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Multiplayer Chess Game</h1>
        <Image
          src="/chessboard.png"
          alt="Chessboard"
          width={300}
          height={300}
          className="mx-auto mb-8"
        />
        <Link 
          href="/game" 
          className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-4 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Play Now
        </Link>
      </div>
    </div>
  )
}

export default Page