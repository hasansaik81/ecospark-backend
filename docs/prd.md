# EcoSpark Hub — Backend Implementation Plan

A community portal where members share sustainability ideas, admins moderate them, and paid ideas are gated behind Stripe payments. Built with **Express + TypeScript + Prisma (PostgreSQL) + JWT + Stripe**.

---

## User Review Required

> [!IMPORTANT]
> **Stripe Payment Flow**: The plan uses Stripe Checkout Sessions (redirect-based). If you prefer Stripe Payment Intents with a custom UI, please say so.

> [!IMPORTANT]
> **Optional Features to Include**: The PRD marks several features as optional. Please confirm which ones you want implemented:
> - Nested comments (Reddit-style)
> - Draft mode for ideas
> - Admin delete comments
> - Newsletter subscription
> - Watchlist / Favorites
> - User reviews/experiences with rating on idea detail

> [!WARNING]
> **Prisma Client Version**: Your project uses `@prisma/client ^7.8.0` with `provider = "prisma-client"` (new Prisma 7 generator). The generated client path is `../generated/prisma`. All imports must use this path.

---

## Open Questions

> [!IMPORTANT]
> 1. Should rejected ideas be editable/re-submittable by members, or permanently rejected?
> 2. Should paid idea access be per-idea (one-time purchase) or subscription-based?
> 3. Do you want **refresh tokens** alongside access tokens, or just a single short-lived JWT?
> 4. Should images be stored as URLs (Cloudinary/S3) or base64 in the DB? (URL recommended)

---

## Proposed Changes

### 1. Prisma Schema

#### [MODIFY] [schema.prisma](file:///f:/poject-repository/L2-batch-6=Practice/assignment%20and%20other/EcoSpark-backend-5/ecospark-backend/prisma/schema.prisma)

Complete schema with all models:

| Model | Purpose |
|-------|---------|
| `User` | Members & Admins with role, status, password |
| `Category` | Admin-defined categories (Energy, Waste, etc.) |
| `Idea` | Core content — title, problem, solution, images, status, isPaid, price |
| `Vote` | One vote per member per idea (upvote/downvote) |
| `Comment` | Nested comments with optional `parentId` |
| `Payment` | Stripe payment records linking User ↔ Idea |
| `Newsletter` | Email subscriptions |

**Enums:**
- `UserRole`: `ADMIN | MEMBER`
- `UserStatus`: `ACTIVE | INACTIVE | BANNED`
- `IdeaStatus`: `DRAFT | PENDING | UNDER_REVIEW | APPROVED | REJECTED`
- `VoteType`: `UPVOTE | DOWNVOTE`
- `PaymentStatus`: `PENDING | COMPLETED | FAILED | REFUNDED`

---

### 2. Auth Module

#### [MODIFY] `src/modules/Auth/` (already exists, currently empty logic)

| File | Purpose |
|------|---------|
| `auth.validation.ts` | Zod schemas for register/login |
| `auth.service.ts` | Register (hash pw), Login (compare pw, sign JWT), Refresh |
| `auth.controller.ts` | HTTP handlers |
| `auth.route.ts` | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout` |

**JWT payload**: `{ userId, email, role }`  
**Token delivery**: `Authorization: Bearer <token>` header + `httpOnly` cookie

---

### 3. Auth Middleware

#### [MODIFY] [auth.ts](file:///f:/poject-repository/L2-batch-6=Practice/assignment%20and%20other/EcoSpark-backend-5/ecospark-backend/src/middlewares/auth.ts)

Uncomment and complete the existing middleware:
- Reads token from `Authorization` header or `cookie`
- Verifies JWT
- Checks user `status === ACTIVE`
- Attaches `req.user = { userId, email, role }` to request
- Supports role-based access: `auth('ADMIN')`, `auth('MEMBER')`, `auth()` (any authenticated)

---

### 4. User Module

#### [NEW] `src/modules/User/`

| File | Purpose |
|------|---------|
| `user.validation.ts` | Update profile schema |
| `user.service.ts` | Get profile, update profile, change password |
| `user.controller.ts` | HTTP handlers |
| `user.route.ts` | `GET /api/users/me`, `PATCH /api/users/me`, `GET /api/users` (admin) |

**Admin routes:**
- `GET /api/users` — list all members
- `PATCH /api/users/:id/status` — activate/deactivate
- `PATCH /api/users/:id/role` — change role

---

### 5. Category Module

#### [NEW] `src/modules/Category/`

| File | Purpose |
|------|---------|
| `category.validation.ts` | Create/update schema |
| `category.service.ts` | CRUD |
| `category.controller.ts` | HTTP handlers |
| `category.route.ts` | `GET /api/categories` (public), `POST/PATCH/DELETE` (admin only) |

---

### 6. Idea Module

#### [NEW] `src/modules/Idea/`

| File | Purpose |
|------|---------|
| `idea.validation.ts` | Zod schemas for create/update |
| `idea.service.ts` | CRUD + status transitions + access control for paid ideas |
| `idea.controller.ts` | HTTP handlers |
| `idea.route.ts` | Routes below |

**Routes:**

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| `GET` | `/api/ideas` | Public | All approved ideas (paginated, filtered, sorted) |
| `GET` | `/api/ideas/:id` | Public/Auth | Idea detail (paid → check payment) |
| `POST` | `/api/ideas` | Member | Create idea (Draft or Pending) |
| `PATCH` | `/api/ideas/:id` | Member (owner, unpublished only) | Edit idea |
| `DELETE` | `/api/ideas/:id` | Member (owner, unpublished only) | Delete idea |
| `PATCH` | `/api/ideas/:id/submit` | Member | Move Draft → Pending/Under Review |
| `GET` | `/api/ideas/my` | Member | My ideas |
| `GET` | `/api/admin/ideas` | Admin | All ideas with any status |
| `PATCH` | `/api/admin/ideas/:id/approve` | Admin | Approve idea |
| `PATCH` | `/api/admin/ideas/:id/reject` | Admin | Reject with feedback |
| `DELETE` | `/api/admin/ideas/:id` | Admin | Delete any idea |

**Query params for `GET /api/ideas`:**
- `page`, `limit` (default 10)
- `sort`: `recent | topVoted | mostCommented`
- `category`, `isPaid` (free/paid filter)
- `search` (title/description keyword)
- `minVotes`

---

### 7. Vote Module

#### [NEW] `src/modules/Vote/`

Reddit-like system — one vote per member per idea, can change or remove.

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/ideas/:id/vote` | Cast/change vote (`{ type: "UPVOTE" \| "DOWNVOTE" }`) |
| `DELETE` | `/api/ideas/:id/vote` | Remove vote |

---

### 8. Comment Module (Optional — Nested)

#### [NEW] `src/modules/Comment/`

Nested Reddit-style comments via `parentId` self-relation.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/ideas/:id/comments` | Get comments tree |
| `POST` | `/api/ideas/:id/comments` | Add comment/reply |
| `DELETE` | `/api/comments/:id` | Delete own comment (Member) or any (Admin) |

---

### 9. Payment Module (Stripe)

#### [MODIFY] [stripe.config.ts](file:///f:/poject-repository/L2-batch-6=Practice/assignment%20and%20other/EcoSpark-backend-5/ecospark-backend/src/config/stripe.config.ts)

Initialize Stripe with secret key from `.env`.

#### [NEW] `src/modules/Payment/`

| File | Purpose |
|------|---------|
| `payment.service.ts` | Create Stripe Checkout Session, handle webhook, verify access |
| `payment.controller.ts` | HTTP handlers |
| `payment.route.ts` | Routes below |

**Routes:**

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/payment/checkout/:ideaId` | Create Stripe Checkout Session |
| `POST` | `/api/payment/webhook` | Stripe webhook → mark payment complete |
| `GET` | `/api/payment/verify/:ideaId` | Check if current user has paid for idea |

**Access logic for paid ideas:**
1. User hits `GET /api/ideas/:id`
2. If `idea.isPaid === true` → check `Payment` table for a `COMPLETED` payment by this user
3. If no payment found → return `402 Payment Required` with Stripe checkout URL

---

### 10. Newsletter Module

#### [NEW] `src/modules/Newsletter/`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/newsletter/subscribe` | Subscribe email |
| `DELETE` | `/api/newsletter/unsubscribe` | Unsubscribe |

---

### 11. Shared Utilities & Interfaces

#### [NEW] Files

| File | Purpose |
|------|---------|
| `src/utils/catchAsync.ts` | Wrap async route handlers |
| `src/utils/sendResponse.ts` | Standardized JSON response helper |
| `src/utils/pick.ts` | Pick allowed query fields |
| `src/utils/pagination.ts` | Build Prisma `skip`/`take` from page/limit |
| `src/interface/index.d.ts` | Extend Express `Request` with `user` property |
| `src/interface/error.ts` | Error interface (already exists) |

---

### 12. Route Registration

#### [MODIFY] `src/routes/index.ts`

Register all module routes under `/api` prefix.

---

### 13. Seed Data

#### [MODIFY/NEW] `src/seed/`

Seed script to create:
- 1 Admin user
- Default categories: Energy, Waste, Transportation, Water, Agriculture

---

## Verification Plan

### Build Check
```bash
npx tsc --noEmit
```

### Prisma Migration
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Manual API Testing (via curl / Postman)

| Scenario | Endpoint |
|----------|---------|
| Register + Login | `POST /api/auth/register`, `POST /api/auth/login` |
| Create idea (Draft) | `POST /api/ideas` |
| Submit for review | `PATCH /api/ideas/:id/submit` |
| Admin approve | `PATCH /api/admin/ideas/:id/approve` |
| Vote on idea | `POST /api/ideas/:id/vote` |
| Paid idea access | `GET /api/ideas/:id` (without payment → 402) |
| Stripe checkout | `POST /api/payment/checkout/:ideaId` |
| Admin manage users | `PATCH /api/users/:id/status` |
