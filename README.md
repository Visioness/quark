# Quark

A real-time messaging application with direct messages, group chats, and live online presence — built with React and Socket.IO.

## Tech Stack

### Client

- **React 19** with **Vite** — fast SPA development
- **React Router 7** — client-side routing
- **TanStack React Query** — server state management with optimistic updates
- **Socket.IO Client** — real-time WebSocket communication
- **Tailwind CSS 4** — utility-first styling
- **Lucide React** — icons

### Server

- **Express 5** — REST API
- **Socket.IO** — real-time event-driven communication
- **Prisma** with **PostgreSQL** — ORM and database
- **Passport.js** — local authentication strategy
- **JWT** — access & refresh token authentication
- **bcrypt** — password hashing

## Features

- **Authentication** — Sign up, log in, and JWT-based session management with automatic token refresh
- **Direct Messages** — One-on-one conversations created automatically when a friend request is accepted
- **Group Chats** — Create groups, invite members, manage roles (Owner / Admin / Member), and transfer ownership
- **Real-Time Messaging** — Instant message delivery via WebSockets with optimistic UI updates
- **Online Presence** — Live online/offline status indicators across all conversations
- **Unread Counts** — Per-conversation unread message badges that sync with the server
- **Typing Indicators** — See when other participants are typing
- **Friend System** — Send, accept, and reject friend requests; remove friends
- **User Profiles** — View and update profile information
- **Infinite Scroll** — Paginated message history with seamless loading
- **Responsive Design** — Sidebar navigation with collapsible member lists

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Visioness/quark.git
   cd quark
   ```

2. **Set up the server**

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the `server` directory:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/quark"
   SECRET="your-jwt-secret"
   REFRESH_SECRET="your-refresh-secret"
   CLIENT_URL="http://localhost:5173"
   PORT=3000
   ```

   Run database migrations:

   ```bash
   npx prisma migrate deploy
   ```

3. **Set up the client**
   ```bash
   cd ../client
   npm install
   ```

### Running

Start both the server and client in separate terminals:

```bash
# Terminal 1 — Server
cd server
npm run dev

# Terminal 2 — Client
cd client
npm run dev
```

The app will be available at `http://localhost:5173`.
