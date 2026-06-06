import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { CategoryRoutes } from "../modules/Category/category.route";
import { UserRoutes } from "../modules/User/user.route";
import { IdeaRoutes } from "../modules/Idea/idea.route";
import { VoteRoutes } from "../modules/Vote/vote.route";
import { CommentRoutes } from "../modules/Comment/comment.route";
import { PaymentRoutes } from "../modules/Payment/payment.route";
import { NewsletterRoutes } from "../modules/Newsletter/newsletter.route";

const router = Router();

const routerManger = [
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/categories",
        route: CategoryRoutes,
    },
    {
        path: "/users",
        route: UserRoutes,
    },
    {
        path: "/ideas",
        route: IdeaRoutes,
    },
    {
        path: "/ideas",
        route: VoteRoutes,
    },
    {
        path: "/payment",
        route: PaymentRoutes,
    },
    {
        path: "/newsletter",
        route: NewsletterRoutes,
    },
    {
        path: "/",
        route: CommentRoutes,
    },
];

routerManger.forEach((r) => router.use(r.path, r.route));
export default router