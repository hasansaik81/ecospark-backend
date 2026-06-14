# 🌿 EcoSpark Hub — Backend API

A community portal where members share sustainability ideas, admins moderate them, and paid ideas are gated behind **Stripe** payments. Built with a production-grade **Express + TypeScript + Prisma (PostgreSQL)** stack.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Modules & Endpoints](#api-modules--endpoints)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Authentication](#authentication)
- [Payment Flow (Stripe)](#payment-flow-stripe)
- [Role & Access Control](#role--access-control)

---

## Overview

EcoSpark Hub is a sustainability idea-sharing platform with:

- 🔐 **JWT Authentication** — register, login, role-based access
- 💡 **Idea Management** — members submit ideas (Draft → Pending → Approved/Rejected)
- 🗳️ **Voting System** — Reddit-style upvote/downvote per idea
- 💬 **Nested Comments** — Reddit-style threaded discussion
- 💳 **Stripe Payments** — paid idea access via Stripe Checkout Sessions
- 📰 **Newsletter** — email subscription management
- 🛡️ **Admin Dashboard** — manage users, ideas, categories

---

## Tech Stack

| Layer          | Technology                                   |
|----------------|----------------------------------------------|
| Runtime        | Node.js                                      |
| Language       | TypeScript `^6.0.3`                          |
| Framework      | Express `^5.2.1`                             |
| ORM            | Prisma `^7.8.0` (PostgreSQL)                 |
| Auth           | JSON Web Tokens (`jsonwebtoken ^9.0.3`)      |
| Password Hash  | bcrypt `^6.0.0`                              |
| Validation     | Zod `^4.4.3`                                 |
| Payments       | Stripe `^22.2.0`                             |
| File Uploads   | Multer + Cloudinary                          |
| Cookies        | cookie-parser                                |
| Dev Server     | ts-node-dev                                  |

---

## Project Structure

```
ecospark-backend/
├── prisma/
│   └── schema.prisma           # Database schema
├── src/
│   ├── app.ts                  # Express app setup
│   ├── server.ts               # Server entry point
│   ├── config/                 # App & Stripe config
│   ├── errors/                 # Custom error classes
│   ├── interface/              # TypeScript type extensions
│   ├── lib/                    # Prisma client instance
│   ├── middlewares/            # Auth, error handlers
│   ├── routes/                 # Root route aggregator
│   ├── seed/                   # DB seed scripts
│   ├── utils/                  # Shared helpers
│   └── modules/
│       ├── Auth/               # Register, Login, Logout
│       ├── User/               # Profile, Admin user mgmt
│       ├── Category/           # Idea categories (CRUD)
│       ├── Idea/               # Core ideas + admin moderation
│       ├── Vote/               # Upvote / Downvote
│       ├── Comment/            # Nested comments
│       ├── Payment/            # Stripe checkout & webhooks
│       ├── Newsletter/         # Email subscriptions
│       └── Dashboard/          # Admin & member dashboards
├── docs/
│   └── prd.md                  # Product Requirements Document
├── .env                        # Environment variables (not committed)
├── package.json
└── tsconfig.json
```

---

## API Modules & Endpoints

### 🔐 Auth — `/api/auth`

| Method | Endpoint             | Access  | Description           |
|--------|----------------------|---------|-----------------------|
| POST   | `/api/auth/register` | Public  | Register a new member |
| POST   | `/api/auth/login`    | Public  | Login & get JWT token |
| POST   | `/api/auth/logout`   | Auth    | Logout (clear cookie) |

---

### 👤 User — `/api/users`

| Method | Endpoint                    | Access | Description                     |
|--------|-----------------------------|--------|---------------------------------|
| GET    | `/api/users/me`             | Member | Get own profile                 |
| PATCH  | `/api/users/me`             | Member | Update own profile              |
| GET    | `/api/users`                | Admin  | List all users                  |
| PATCH  | `/api/users/:id/status`     | Admin  | Activate / Deactivate a user    |
| PATCH  | `/api/users/:id/role`       | Admin  | Change user role                |

---

### 🏷️ Category — `/api/categories`

| Method | Endpoint                 | Access | Description             |
|--------|--------------------------|--------|-------------------------|
| GET    | `/api/categories`        | Public | Get all categories      |
| POST   | `/api/categories`        | Admin  | Create a new category   |
| PATCH  | `/api/categories/:id`    | Admin  | Update a category       |
| DELETE | `/api/categories/:id`    | Admin  | Delete a category       |

---

### 💡 Idea — `/api/ideas` & `/api/admin/ideas`

| Method | Endpoint                          | Access        | Description                                   |
|--------|-----------------------------------|---------------|-----------------------------------------------|
| GET    | `/api/ideas`                      | Public        | List all approved ideas (paginated, filtered) |
| GET    | `/api/ideas/:id`                  | Public / Auth | Idea detail (paid → requires payment)         |
| POST   | `/api/ideas`                      | Member        | Create idea (Draft or Pending)                |
| PATCH  | `/api/ideas/:id`                  | Member/Owner  | Edit own unpublished idea                     |
| DELETE | `/api/ideas/:id`                  | Member/Owner  | Delete own unpublished idea                   |
| PATCH  | `/api/ideas/:id/submit`           | Member        | Move Draft → Pending / Under Review           |
| GET    | `/api/ideas/my`                   | Member        | Get my ideas                                  |
| GET    | `/api/admin/ideas`                | Admin         | All ideas (any status)                        |
| PATCH  | `/api/admin/ideas/:id/approve`    | Admin         | Approve an idea                               |
| PATCH  | `/api/admin/ideas/:id/reject`     | Admin         | Reject an idea with feedback                  |
| DELETE | `/api/admin/ideas/:id`            | Admin         | Delete any idea                               |

**Query parameters for `GET /api/ideas`:**

| Param      | Description                                          |
|------------|------------------------------------------------------|
| `page`     | Page number (default: `1`)                           |
| `limit`    | Items per page (default: `10`)                       |
| `sort`     | `recent` \| `topVoted` \| `mostCommented`            |
| `category` | Filter by category ID                                |
| `isPaid`   | `true` \| `false` — filter free or paid ideas        |
| `search`   | Keyword search in title / description                |
| `minVotes` | Minimum vote count filter                            |

---

### 🗳️ Vote — `/api/ideas/:id/vote`

| Method | Endpoint                  | Access | Description                                |
|--------|---------------------------|--------|--------------------------------------------|
| POST   | `/api/ideas/:id/vote`     | Member | Cast or change vote (`UPVOTE`/`DOWNVOTE`)  |
| DELETE | `/api/ideas/:id/vote`     | Member | Remove vote                                |

---

### 💬 Comment — `/api/ideas/:id/comments`

| Method | Endpoint                      | Access        | Description                          |
|--------|-------------------------------|---------------|--------------------------------------|
| GET    | `/api/ideas/:id/comments`     | Public        | Get nested comment tree for an idea  |
| POST   | `/api/ideas/:id/comments`     | Member        | Add a comment or reply               |
| DELETE | `/api/comments/:id`           | Member/Admin  | Delete own comment (or any, admin)   |

---

### 💳 Payment — `/api/payment`

| Method | Endpoint                           | Access | Description                              |
|--------|------------------------------------|--------|------------------------------------------|
| POST   | `/api/payment/checkout/:ideaId`    | Member | Create Stripe Checkout Session           |
| POST   | `/api/payment/webhook`             | Stripe | Stripe webhook → mark payment complete   |
| GET    | `/api/payment/verify/:ideaId`      | Member | Check if current user paid for an idea   |

---

### 📰 Newsletter — `/api/newsletter`

| Method | Endpoint                        | Access | Description        |
|--------|---------------------------------|--------|--------------------|
| POST   | `/api/newsletter/subscribe`     | Public | Subscribe email    |
| DELETE | `/api/newsletter/unsubscribe`   | Public | Unsubscribe email  |

---

### 📊 Dashboard — `/api/dashboard`

| Method | Endpoint             | Access | Description                    |
|--------|----------------------|--------|--------------------------------|
| GET    | `/api/dashboard`     | Admin  | Admin stats & overview         |
| GET    | `/api/dashboard/me`  | Member | Member personal dashboard data |

---

## Database Schema

### Models

| Model        | Purpose                                                   |
|--------------|-----------------------------------------------------------|
| `User`       | Members & Admins — role, status, hashed password          |
| `Category`   | Admin-defined tags (Energy, Waste, Transport, etc.)       |
| `Idea`       | Core content — title, problem, solution, images, pricing  |
| `Vote`       | One vote per member per idea (upvote/downvote)            |
| `Comment`    | Nested comments via `parentId` self-relation              |
| `Payment`    | Stripe payment records linking `User ↔ Idea`              |
| `Newsletter` | Email subscriptions                                       |

### Enums

| Enum            | Values                                            |
|-----------------|---------------------------------------------------|
| `UserRole`      | `ADMIN` \| `MEMBER`                               |
| `UserStatus`    | `ACTIVE` \| `INACTIVE` \| `BANNED`                |
| `IdeaStatus`    | `DRAFT` \| `PENDING` \| `UNDER_REVIEW` \| `APPROVED` \| `REJECTED` |
| `VoteType`      | `UPVOTE` \| `DOWNVOTE`                            |
| `PaymentStatus` | `PENDING` \| `COMPLETED` \| `FAILED` \| `REFUNDED` |

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ecospark_db"

# JWT
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRES_IN=1d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUCCESS_URL=http://localhost:3000/payment/success
STRIPE_CANCEL_URL=http://localhost:3000/payment/cancel

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Cookie
COOKIE_SECRET=your_cookie_secret
```

> ⚠️ **Never commit `.env` to version control.**

---

## Getting Started

### Prerequisites

- Node.js `>=18`
- PostgreSQL database
- Stripe account (for payment features)
- Cloudinary account (for image uploads)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd ecospark-backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 4. Run Prisma migrations
npx prisma migrate dev --name init

# 5. Generate Prisma client
npx prisma generate

# 6. Seed the database (admin user + default categories)
npm run seed:admin

# 7. Start the development server
npm run dev
```

The server will start at `http://localhost:5000`.

---

## Scripts

| Script          | Command             | Description                          |
|-----------------|---------------------|--------------------------------------|
| Development     | `npm run dev`       | Start with hot-reload (ts-node-dev)  |
| Production      | `npm start`         | Run compiled `dist/server.js`        |
| Build           | `npm run build`     | Compile TypeScript → `dist/`         |
| Lint            | `npm run lint`      | Run ESLint on `src/**/*.ts`          |
| Lint Fix        | `npm run lint:fix`  | Auto-fix ESLint errors               |
| Format          | `npm run format`    | Run Prettier on all files            |
| Seed Admin      | `npm run seed:admin`| Seed default admin + categories      |

---

## Authentication

This API uses **JWT (JSON Web Tokens)** for authentication.

- **Token delivery**: `Authorization: Bearer <token>` header **or** `httpOnly` cookie
- **JWT payload**: `{ userId, email, role }`
- **Protected routes**: Pass the token in the `Authorization` header

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Standard Response Format

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": { ... }
}
```

---

## Payment Flow (Stripe)

EcoSpark uses **Stripe Checkout Sessions** (redirect-based) for paid idea access.

```
1. User requests  GET /api/ideas/:id
         │
         ▼
2. idea.isPaid === true ?
         │
    YES  ▼
3. Check Payment table for COMPLETED payment by this user
         │
   NOT FOUND ▼
4. Return 402 Payment Required + Stripe Checkout URL
         │
         ▼
5. User redirects to Stripe → completes payment
         │
         ▼
6. Stripe fires webhook → POST /api/payment/webhook
         │
         ▼
7. Payment marked COMPLETED in DB
         │
         ▼
8. User can now access full idea content ✅
```

### Stripe Webhook Setup (Local)

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:5000/api/payment/webhook
```

---

## Role & Access Control

| Role     | Capabilities                                                      |
|----------|-------------------------------------------------------------------|
| `PUBLIC` | Browse approved ideas, view categories, read comments            |
| `MEMBER` | All public + submit ideas, vote, comment, purchase paid ideas     |
| `ADMIN`  | All member actions + moderate ideas, manage users & categories   |

### Idea Status Lifecycle

```
DRAFT  ──► PENDING ──► UNDER_REVIEW ──► APPROVED
                                    └──► REJECTED
```

- **Member** submits → moves `DRAFT` to `PENDING`
- **Admin** reviews → moves to `APPROVED` or `REJECTED` (with feedback)
- Only **unpublished** ideas (Draft) can be edited or deleted by the owner

---

## 📄 License

ISC © EcoSpark Hub
