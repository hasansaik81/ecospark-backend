import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { CategoryRoutes } from "../modules/Category/category.route";

const router = Router();

const routerManger = [
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/categories",
        route: CategoryRoutes,
    }
]

routerManger.forEach((r) => router.use(r.path, r.route));
export default router