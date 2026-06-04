import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";




const router = Router();

const routerManger = [
    {
        path: "/auth",
        route: AuthRoutes,
    }

]

routerManger.forEach((r) => router.use(r.path, r.route));
export default router