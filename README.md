# Multiplayer Chess Game

Welcome to the Multiplayer Chess Game! This is a real-time chess application where players can challenge each other to a classic game of chess, complete with intuitive UI and robust backend logic.

## Features

- **Real-Time Multiplayer:** Play chess with friends or other players in real-time, thanks to WebSockets.
- **Intuitive UI:** Clean and responsive user interface built with Next.js for seamless gameplay.
- **Robust Chess Logic:** Chess rules and game mechanics are implemented using the powerful [Chess.js](https://www.npmjs.com/package/chess.js/v/0.13.0?activeTab=readme) library.
- **Cross-Platform Support:** Enjoy the game on both desktop and mobile devices.

## Demo

<video controls src="https://github.com/user-attachments/assets/35823b37-d0f0-4f6c-ad19-8ab9cff77063" muted="muted" playsinline="playsinline"></video>
<video controls width='120' src="https://github.com/user-attachments/assets/c6f92297-bb85-42a3-91a7-1aea2bcae3f3" muted="muted" playsinline="playsinline"></video>

## Run Locally

### Clone The Repository

```
git clone https://github.com/sbhuvan455/Chess.git
```
### Install Dependencies
```
cd backend
yarn

cd ../frontend
yarn
```

### Start Backend
```
cd backend
tsc -b
yarn dev
```

### Start Frontend
```
cd frontend
yarn dev
```

Access the game at http://localhost:3000
