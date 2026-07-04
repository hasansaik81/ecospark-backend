





import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { CategoryRoutes } from "../modules/Category/category.route";
import { UserRoutes } from "../modules/User/user.route";
// import { IdeaRoutes } from "../modules/Idea/idea.route";
import { VoteRoutes } from "../modules/Vote/vote.route";
import { CommentRoutes } from "../modules/Comment/comment.route";
import { PaymentRoutes } from "../modules/Payment/payment.route";
import { NewsletterRoutes } from "../modules/Newsletter/newsletter.route";
import { DashboardRoutes } from "../modules/Dashboard/dashboard.route";
import { IdeaRoutes } from "../modules/Idea/idea.route";

const router = Router();


router.use("/auth", AuthRoutes);
router.use("/categories", CategoryRoutes);
router.use("/users", UserRoutes);


router.use("/ideas", IdeaRoutes);


router.use("/idea-comments", CommentRoutes);
router.use("/idea-votes", VoteRoutes);

router.use("/payment", PaymentRoutes);
router.use("/newsletter", NewsletterRoutes);
router.use("/dashboard", DashboardRoutes);

export default router;