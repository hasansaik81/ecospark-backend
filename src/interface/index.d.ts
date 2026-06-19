import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
// req.user = decoded;



// import { TJwtUser } from '../modules/auth/auth.interface';

// declare global {
//     namespace Express {
//         interface Request {
//             user?: TJwtUser;
//         }
//     }
// }

// export {};