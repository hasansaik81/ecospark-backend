import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { CategoryRoutes } from "../modules/Category/category.route";
import { UserRoutes } from "../modules/User/user.route";
import { IdeaRoutes } from "../modules/Idea/idea.route";

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
    }
]

routerManger.forEach((r) => router.use(r.path, r.route));
export default router