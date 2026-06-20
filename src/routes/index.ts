// import { Router } from "express";
// import { AuthRoutes } from "../modules/Auth/auth.route";
// import { CategoryRoutes } from "../modules/Category/category.route";
// import { UserRoutes } from "../modules/User/user.route";
// import { IdeaRoutes } from "../modules/Idea/idea.route";
// import { VoteRoutes } from "../modules/Vote/vote.route";
// import { CommentRoutes } from "../modules/Comment/comment.route";
// import { PaymentRoutes } from "../modules/Payment/payment.route";
// import { NewsletterRoutes } from "../modules/Newsletter/newsletter.route";
// import { DashboardRoutes } from "../modules/Dashboard/dashboard.route";

// const router = Router();

// const routerManger = [

//     //  {
//     //     path: "/",
//     //     route: CommentRoutes,
//     // },

//     {
//         path: "/auth",
//         route: AuthRoutes,
//     },
//     {
//         path: "/categories",
//         route: CategoryRoutes,
//     },
//     {
//         path: "/users",
//         route: UserRoutes,
//     },
//     {
//         path: "/ideas",
//         route: IdeaRoutes,
//     },
      
//       {
//         path: "/ideas",
//         route: CommentRoutes,
//     },

//     {
//         path: "/ideas",
//         route: VoteRoutes,
//     },
//     {
//         path: "/payment",
//         route: PaymentRoutes,
//     },
//     {
//         path: "/newsletter",
//         route: NewsletterRoutes,
//     },
   

//     {
//         path: "/dashboard",
//         route: DashboardRoutes,
//     },
// ];

// routerManger.forEach((r) => router.use(r.path, r.route));
// export default router





import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { CategoryRoutes } from "../modules/Category/category.route";
import { UserRoutes } from "../modules/User/user.route";
import { IdeaRoutes } from "../modules/Idea/idea.route";
import { VoteRoutes } from "../modules/Vote/vote.route";
import { CommentRoutes } from "../modules/Comment/comment.route";
import { PaymentRoutes } from "../modules/Payment/payment.route";
import { NewsletterRoutes } from "../modules/Newsletter/newsletter.route";
import { DashboardRoutes } from "../modules/Dashboard/dashboard.route";

const router = Router();

// 💡 লুপ বা অ্যারে ছাড়া সরাসরি ডিফাইন করা হলো যেন ১% ওভারল্যাপের সুযোগও না থাকে
router.use("/auth", AuthRoutes);
router.use("/categories", CategoryRoutes);
router.use("/users", UserRoutes);

// ✅ আপনার মেইন আইডিয়া রাউট
router.use("/ideas", IdeaRoutes); 

// 🛠️ সাব-রাউটগুলোর পাথ সম্পূর্ণ আলাদা এবং নিখুঁত করা হলো
router.use("/idea-comments", CommentRoutes);
router.use("/idea-votes", VoteRoutes);

router.use("/payment", PaymentRoutes);
router.use("/newsletter", NewsletterRoutes);
router.use("/dashboard", DashboardRoutes);

export default router;