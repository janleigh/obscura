# obscura

> Totally (not a ARG) a cryptographic puzzle game. Built with React, Express, and Bun ~~(fuck Node)~~. Managed by Turborepo.

## <samp>PROJECT STRUCTURE</samp>

This is a monorepo containing:

- **apps/client** - React frontend application powered by Vite and Tailwind CSS
- **apps/server** - Express.js backend API with SQLite database
- **packages/shared** - Shared code and utilities between client and server

## <samp>TECH STACK<samp>

### Frontend (Client)
- **React** - UI library
- **Vite (Rolldown)** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework

### Backend (Server)
- **Express** - Web framework
- **Better SQLite3** - Database
- **bcrypt** - Password hashing
- **dotenv** - Environment configuration

### Development Tools
- **Turborepo** - Monorepo build system
- **Bun** - JavaScript runtime and package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Auto-restart server on changes

## <samp>GETTING STARTED</samp>

### Prerequisites

- [Bun](https://bun.sh/) v1.2.0 or later

### Installation

```bash
# Install dependencies
bun install
```

### Development

Run both client and server in development mode:

```bash
bun run dev
```

This will start:
- Client at `http://localhost:5173`
- Server at `http://localhost:3000`

### Individual App Development

```bash
# Client only
cd apps/client
bun run dev

# Server only
cd apps/server
bun run dev
```

## <samp>CLI COMMANDS</samp>

### Root Level

- `bun run dev` - Start all apps in development mode
- `bun run build` - Build all apps for production
- `bun run start` - Start all apps in production mode
- `bun run lint` - Run ESLint on all files
- `bun run lint:fix` - Fix ESLint errors automatically
- `bun run format` - Format code with Prettier

### Client

- `bun run dev` - Start Vite dev server with HMR
- `bun run build` - Build for production
- `bun run preview` - Preview production build locally

### Server

- `bun run dev` - Start server with nodemon (auto-restart)
- `bun run start` - Start server in production mode
- `bun run watch` - Start in production mode with auto-restart

## <samp>LINKS</samp>

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Express Documentation](https://expressjs.com)
- [Turborepo Documentation](https://turbo.build)
- [Bun Documentation](https://bun.sh)
