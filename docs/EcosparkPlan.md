POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh

GET    /api/ideas                    (public - approved only)
GET    /api/ideas/:id                (check paid access)
POST   /api/ideas                    (member - create draft)
PATCH  /api/ideas/:id                (member - edit own unpublished)
DELETE /api/ideas/:id                (member - delete own unpublished)
POST   /api/ideas/:id/submit         (member - submit for review)

GET    /api/categories
POST   /api/categories               (admin only)
PATCH  /api/categories/:id           (admin only)
DELETE /api/categories/:id           (admin only)

POST   /api/votes                    (member - upvote/downvote)
DELETE /api/votes/:id                (member - remove vote)

POST   /api/comments                 (member)
GET    /api/ideas/:id/comments       (nested structure)
PATCH  /api/comments/:id             (member)
DELETE /api/comments/:id             (member/admin)

POST   /api/payments/create-intent   (stripe)
POST   /api/payments/confirm         (webhook)

POST   /api/newsletter/subscribe

GET    /api/admin/ideas              (admin - all statuses)
PATCH  /api/admin/ideas/:id/approve  (admin)
PATCH  /api/admin/ideas/:id/reject   (admin)
GET    /api/admin/members            (admin)
PATCH  /api/admin/members/:id        (admin)
DELETE /api/admin/comments/:id       (admin)




Phase 1: Project Setup & Core Infrastructure ⚙️
1.1 Database Schema (Prisma)
 User Model: id, email, password, name, role (MEMBER/ADMIN), status (active/inactive), createdAt
 Idea Model: id, title, description, problemStatement, proposedSolution, images[], authorId, categoryId, status (DRAFT/PENDING/APPROVED/REJECTED), isPaid, price, createdAt, updatedAt
 Category Model: id, name (Energy, Waste, Transportation), description
 Vote Model: id, userId, ideaId, type (UPVOTE/DOWNVOTE), createdAt
 Comment Model: id, userId, ideaId, parentCommentId (for nesting), content, createdAt, updatedAt
 Payment Model: id, userId, ideaId, amount, status, stripeTransactionId, createdAt
 IdeaAccess Model: userId, ideaId (tracks who paid for paid ideas)
 Newsletter Model: id, email, subscribedAt
 AdminFeedback Model: id, ideaId, reason, createdAt (for rejected ideas)
1.2 Environment & Configuration
 Setup .env variables (Database URL, JWT Secret, Stripe keys, Port)
 Configure TypeScript strict mode
 Setup middleware stack structure.






 Phase 2: Authentication Module 🔐
2.1 User Authentication
 Create auth.service.ts: signup, login, password hashing (bcrypt)
 Create auth.controller.ts: register, login endpoints
 Create auth.validation.ts: Zod schemas for validation
 Create JWT token generation & refresh logic
 Create auth.middleware.ts: verify JWT token
2.2 Authorization
 Role-based middleware (MEMBER vs ADMIN)
 Protect routes based on user role
 Handle unauthenticated vs authenticated users


 Phase 3: Idea Management Module 💡
3.1 Idea CRUD Operations
 Create Idea: Members create draft ideas
 Edit Idea: Members can edit only unpublished ideas
 Delete Idea: Members can delete only their unpublished ideas
 Submit for Review: Move idea from DRAFT → PENDING
 Retrieve Ideas:
Public endpoint (approved ideas only, respect paid access)
Member endpoint (own ideas + approved public ideas)
Admin endpoint (all ideas with all statuses)
3.2 Idea Validation
 Validate required fields (title, description, problemStatement, proposedSolution)
 Validate image uploads
 Ensure category exists
 Check user ownership before edit/delete
3.3 Pagination & Search
 Implement paginated queries (10-12 per page)
 Search by title/keyword/description
 Filter by category, payment status,vote range.



 Phase 4: Category Management Module 🏷️
4.1 Admin Operations
 Create category
 List all categories
 Update category
 Delete category (cascade or handle ideas)
4.2 Member Operations
 List categories (for dropdown when creating ideas)
 Filter ideas by category.



 Phase 5: Voting System Module ⬆️⬇️
5.1 Vote Operations
 Upvote: Member upvotes idea (one per user)
 Downvote: Member downvotes idea (one per user)
 Remove Vote: Member can remove their vote
 Vote Count: Aggregate upvotes/downvotes with each idea
5.2 Vote Logic
 Prevent double voting
 Allow vote switching (upvote → downvote)
 Calculate vote score (upvotes - downvotes or similar)




 Phase 6: Comment System Module 💬
6.1 Comment Operations
 Create Comment: Post on idea
 Reply to Comment: Nested replies
 Edit Comment: User can edit own comment
 Delete Comment: User/Admin can delete
 Retrieve Comments: Nested structure with replies
6.2 Comment Validation
 Validate content length
 Ensure user is authenticated
 Ensure idea exists.



 Phase 7: Payment & Paid Ideas Module 💳
7.1 Stripe Integration
 Initialize Stripe client
 Create payment intent for paid ideas
 Handle successful payments
 Store transaction records
7.2 Access Control
 Check if user has paid for idea
 Record purchase in IdeaAccess table
 Return 403 if unpaid user tries to view paid idea
 Allow idea creator to view their own paid idea
7.3 Payment History
 Track all payments per user
 Track revenue per idea.


 Phase 8: Admin Dashboard Module 👨‍💼
8.1 Idea Moderation
 View all ideas: Filter by status (PENDING, APPROVED, REJECTED)
 Approve idea: Change status to APPROVED
 Reject idea: Change status to REJECTED + save feedback
 Delete idea: Remove inappropriate ideas
 Edit ideas: Fix urgent issues
8.2 Member Management
 List all members
 View member details
 Activate/Deactivate member
 Edit member roles
 View member activity
8.3 Comment Moderation
 Delete inappropriate comments
 View comments by idea
8.4 Statistics Dashboard (Optional)
 Total members, ideas, approved ideas
 Top voted ideas
 Revenue from paid 
 



 Phase 9: Newsletter Module 📧
9.1 Subscription
 Newsletter subscription endpoint
 Validate email uniqueness
 Unsubscribe functionality
9.2 Email Sending (Future)
 Setup email service (Nodemailer, SendGrid)
 Send newsletters about new ideas
 Send top voted ideas updates




 POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh

GET    /api/ideas                    (public - approved only)
GET    /api/ideas/:id                (check paid access)
POST   /api/ideas                    (member - create draft)
PATCH  /api/ideas/:id                (member - edit own unpublished)
DELETE /api/ideas/:id                (member - delete own unpublished)
POST   /api/ideas/:id/submit         (member - submit for review)

GET    /api/categories
POST   /api/categories               (admin only)
PATCH  /api/categories/:id           (admin only)
DELETE /api/categories/:id           (admin only)

POST   /api/votes                    (member - upvote/downvote)
DELETE /api/votes/:id                (member - remove vote)

POST   /api/comments                 (member)
GET    /api/ideas/:id/comments       (nested structure)
PATCH  /api/comments/:id             (member)
DELETE /api/comments/:id             (member/admin)

POST   /api/payments/create-intent   (stripe)
POST   /api/payments/confirm         (webhook)

POST   /api/newsletter/subscribe

GET    /api/admin/ideas              (admin - all statuses)
PATCH  /api/admin/ideas/:id/approve  (admin)
PATCH  /api/admin/ideas/:id/reject   (admin)
GET    /api/admin/members            (admin)
PATCH  /api/admin/members/:id        (admin)
DELETE /api/admin/comments/:id       (admin)



Phase 12: Frontend Integration Points (For Frontend Dev)
 Authentication endpoints
 Idea search/filter/pagination
 Comment nested rendering
 Vote counting updates
 Payment checkout integration
 Admin dashboard data



 Implementation Priority 🎯
Tier 1 - Critical (Week 1-2)
Database schema & migrations
Auth module (signup/login/JWT)
Idea CRUD (basic)
Categories
Tier 2 - Core (Week 2-3)
Voting system
Idea filtering/search/pagination
Comments (basic, without nesting)
Error handling refinement
Tier 3 - Advanced (Week 3-4)
Payment/Paid ideas
Admin dashboard
Comment nesting
Newsletter
Tier 4 - Optional (Future)
Nested comments advanced features
Email notifications
Analytics dashboard
Image upload service