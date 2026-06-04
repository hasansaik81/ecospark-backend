# **EcoSpark Hub Assignment Requirements**

## **Project Overview**

Develop an online community portal where community members can share sustainably oriented ideas (e.g. reducing plastic consumption or launching a solar power project) in order to help the environment. Admins monitor the submissions, provide feedback, and make sure the best ideas are made available to all portal members for their consideration.

* * *

## **Functional Requirements**

### **User Roles**

*   **Members**:
    *   Register and log in to the portal.
    *   Create, edit, and delete their own Ideas.
    *   Categorize ideas predefined by Admin (e.g., Energy, Waste, Transportation).
    *   Share positive or negative experiences in comments. (Optional)
    *   Vote (up-vote/down-vote) or remove vote (Ref: Reddit like system).
    *   Comment on ideas and reply to others comments.(Hints: Nested comment).(Optional)
    *   **Paid Ideas**:
        *   When a member marks an idea as "Paid". In order for other members to view these "ideas", they must pay first. Members who are not authenticated must register or log in before purchasing this idea.
        *   If an idea is free, then everyone can view it (Unauthenticated or Authenticated).

  

*   **Admin**:
    *   Can approve/reject ideas, if reject ideas need to give feedback (e.g., "Lacks feasibility study").
    *   Assign statuses: _Under Review_, _Approved, rejected._
    *   Delete inappropriate comments.(Optional)
    *   Highlight high-impact projects on a public route based on up-vote (optional).

### **Features**

*   **Authentication**:
    *   Member signup/login using email and password.
    *   Password hashing for security.
    *   JWT-based authentication for session management.
    *   Form validation and loading states for better user experience and secure data handling.
      
  **You may use tools like Passport.js, BetterAuth, or clustering techniques to manage authentication and scalability.**

*   **Idea Management (Only Login Member Can Do):**
    *   Member can create ideas with:
        *   Title, problem statement, proposed solution, description and images e.t.c.
    *   **Draft mode**: Members write and draft ideas without publishing.(Optional)
    *   **Submit Ideas for review**: Move idea from “Draft” to “Pending”.
    *   **Admin action**:
        *   **Under Review→** When members submit their "Ideas" initial status will be under review
        *   **Approve** → idea becomes publicly visible
        *   **Reject** → idea returns to members with feedback.
    *   Members can edit/delete their ideas **only if unpublished**.

*   **Admin**:
    *   View all ideas with: **Approved**, **Rejected.**
    *   Reject ideas with a feedback reason (Feedback visible only to the submitter). (Optional)

*   **Category System**:
    *   Predefined categories by admins (Energy, Waste, Transportation).
    *   Members must select a category when submitting ideas.

*   **Voting and Commenting (Only for Login Member) :**
    *   Members can up-vote or down-vote→one vote per member (Ref: Like Reddit voting system)
    *   Members can remove their vote.
    *   **Comments (Optional) **:
        *   Nested comment for discussions. (Ref: Like Reddit comment system)
        *   Admins can delete any comment or irrelevant comment.

*   **Search and Filter**:
    *   Members can search "ideas" by keyword or filter by name, category.

*   **Responsive Design**:
    *   The portal must be fully responsive and accessible on desktop and mobile devices.

* * *

## **Pages**

**Logo:** Prominently display the Portal logo. 

**Navigation Bar:**

*       *   Home
    *   **Ideas:** All Listed Sustainability Ideas
    *   Dashboard (Will redirect to a specific user dashboard based on their role)
    *   About Us
    *   Blog
    *   Login/Register (if the user is not logged in)
    *   My Profile (if logged in)
    *   You can add other nav options if necessary

## **Home Page**

**Hero Banner:** Cover image with catchy statement about the portal.

**Search Option:** Allow members to search for "ideas" by:

*       *   Name
    *   category

**Features Ideas Cards:** Each card should display:

*       *   Representative images
    *   Category
    *   Brief description
    *   A "View Idea" button link to the full "Ideas" Details page

**Testimonials:** Top 3 "Ideas" which based on vote count.

**Newsletter:** A subscription section where users can enter their email to receive updates about new ideas, top voted ideas, and important announcements from the platform.

## **Footer**

*       *   **Contact Information:** Email, phone, and social media links.
    *   **Copyright:** Standard copyright details.
    *   **Additional Links:** Terms of Use, Privacy Policy, etc.

* * *
##  All Ideas Page (Paginated Grid/Card Layout)

**Purpose:**  
Lists all approved ideas (both free and paid) in a clean, sortable, and filterable layout.

### **Layout & Features:**

- **Grid/Card Layout:** Each idea displayed as a card containing:
  - Idea title
  - Category (Energy, Waste, Transportation…)
  - Short description/summary
  - Representative image
  - Author name (optional)
  - Vote count (upvotes/downvotes)
  - “View Idea” button linking to Idea Details page
  - Paid badge (if applicable)

- **Pagination:**
  - Display 10–12 ideas per page
  - Navigate between pages with Next/Previous buttons or page numbers

- **Sorting Options:**
  - **Recent:** Latest submitted ideas first
  - **Top Voted:** Ideas with highest upvotes
  - **Most Commented:** Ideas with highest discussion activity

- **Filter Options:**
  - **Category:** Energy, Waste, Transportation, etc.
  - **Payment Status:** Free or Paid
  - **Vote Range:** Filter by minimum upvotes
  - **Author / Contributor:** Filter by members

- **Search Bar:**
  - Search ideas by title, keyword, or description

---

##  Idea Details Page

**Purpose:**  
Show complete content and allow interaction with a specific idea.

### **Layout & Features:**

- **Header Section:**
  - Idea title
  - Category badge
  - Author name
  - Date submitted
  - Paid/Free label

- **Main Content:**
  - Problem statement
  - Proposed solution
  - Detailed description
  - Supporting images
  - Optional video or PDF attachments (optional)

- **Interactive Section:**
  - **Voting System:** Upvote/Downvote and remove vote (like Reddit)
  - **Comments Section:** Nested replies for discussions (optional)
  - **Add to Watchlist / Favorites** (optional)
  - **Share Idea:** Social share buttons (optional)

- **Admin Actions (Visible only to Admins) (optional):** 
  - Approve/Reject idea
  - Edit or Delete idea
  - Add feedback for rejected ideas

- **User Reviews / Experiences (Optional):**
  - Logged-in members can share results or experiences applying the idea
  - Include rating (1–10) or effectiveness metric

---

## **Dashboard**

*   **Admin Dashboard:**
    *   Full control over member accounts and ideas listings.
    *   **Members Management:**
        *   View all member accounts.
        *   Activate/deactivate members.
        *   Edit members roles as necessary.
    *   **Ideas Management:**
        *   View, edit, or remove any ideas listing.
        *   Oversee listings posted by members.
        *   View all ideas with: **Under Review,** **Approved**, **Rejected.**
        *   Reject ideas with a feedback reason (Feedback visible only to the submitter).

*   **Member Dashboard:**
    *   Member can create ideas with:
        *   Title, problem statement, proposed solution, description and images.
    *   **Draft mode**: Members write and draft ideas without publishing.
    *   **Submit Ideas for review**: Move idea from “Draft” to “Pending”.
    *   **Admin action**:
        *   **Under Review→** When members submit their "Ideas" initial status will be under review
        *   **Approve** → Idea becomes publicly visible
        *   **Reject** → Idea returns to members with feedback.
    *   Members can edit/delete their ideas **only if unpublished**.

* * *

