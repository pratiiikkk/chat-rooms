## 🔗 Related Projects

This frontend works with the [Chat App Backend](https://github.com/pratiiikkk/chat-rooms-backend) which provides the WebSocket server and real-time messaging functionality.

# Real-Time Chat Application Frontend

A modern real-time chat application built with Next.js that allows users to create private chat rooms and communicate instantly across multiple devices.

## 🌟 Features

- ✨ **Instant Room Creation** - Create private chat rooms instantly
- 🔗 **Room Sharing** - Join existing rooms with room ID
- 💬 **Real-time Messaging** - Instant message delivery via WebSocket
- 👥 **User Presence** - See who's online in real-time
- 📱 **Responsive Design** - Works seamlessly on all devices


## 🛠 Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful and accessible UI components

- WebSocket - Real-time communication

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd chat-rooms
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

4. **Start the development server:**

```bash
npm run dev
# or
yarn dev
```

5. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.



## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL | `ws://localhost:8080` |

## 🤝 Usage

1. **Create a Room:**
   - Click "Create Room" on the homepage
   - Share the generated room ID with others

2. **Join a Room:**
   - Enter a room ID and click "Join Room"
   - Start chatting instantly

3. **Real-time Features:**
   - See typing indicators
   - View user presence
   - Receive messages instantly



## 📝 License

This project is private and not licensed for public use.


