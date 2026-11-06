# Production-Grade Full-Stack Todo Application

An enterprise-ready Todo task management platform built with a decoupled microservice architecture:
- **Frontend**: [Next.js (App Router)](https://nextjs.org/) + TypeScript + Tailwind CSS
- **Backend**: Node.js + [Express](https://expressjs.com/) + [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Deployment**: Docker Compose & Kubernetes-ready (`output: standalone`, health probes, graceful shutdown)

---

## Architecture Overview

```text
kubeDeployment/
├── backend/                             # Express REST API
│   ├── src/
│   │   ├── config/                      # Database connection lifecycle
│   │   ├── controllers/                 # Business logic & request validation
│   │   ├── middlewares/                 # Security, 404, global error handling
│   │   ├── models/                      # Mongoose schemas & indexes
│   │   ├── routes/                      # Route declarations
│   │   ├── utils/                       # ApiResponse & AsyncHandler wrappers
│   │   ├── app.js                       # Express app configuration & /health probe
│   │   └── server.js                    # Process signals & graceful shutdown
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                            # Next.js App Router (Production Architecture)
│   ├── src/
│   │   ├── app/                         # App Router root pages
│   │   │   ├── layout.tsx               # Root layout & global metadata
│   │   │   ├── page.tsx                 # Server Component (RSC) initial data fetch
│   │   │   ├── loading.tsx              # Streaming skeleton loader
│   │   │   ├── error.tsx                # Error boundary with recovery
│   │   │   └── not-found.tsx            # Custom 404 handler
│   │   ├── features/                    # Domain / Feature-Driven Architecture
│   │   │   └── todos/
│   │   │       ├── components/          # Dashboard, List, Item, Form, Filters, Stats
│   │   │       ├── schemas/             # Zod validation schemas
│   │   │       ├── services/            # Isomorphic API service
│   │   │       └── types/               # TypeScript interfaces
│   │   ├── components/                  # Shared Design System
│   │   │   ├── ui/                      # Atoms: Button, Input, Badge, Modal
│   │   │   ├── feedback/                # EmptyState, AlertBanner
│   │   │   └── layout/                  # Header, Footer
│   │   ├── lib/                         # API client, cn() helper, env configuration
│   │   └── types/                       # API response contract
│   ├── Dockerfile                       # Multi-stage standalone runner (~120MB)
│   └── package.json
│
└── docker-compose.yml                   # Local cluster orchestration
```

---

## Quick Start

### 1. Run Everything via Docker Compose
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api/todos`
- Health Check: `http://localhost:5000/health`

---

### 2. Manual Development Setup

#### Start Backend:
```bash
cd backend
npm install
npm run dev
```

#### Start Frontend:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
