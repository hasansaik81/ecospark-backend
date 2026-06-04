

// import { NextFunction, Request, Response } from "express";
// import { Prisma } from "../../generated/prisma/client";
// import { envVars } from "../config/env";
// import { TErrorResponse } from "../interface/error";


// function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
//     let statusCode = 500; 
//     let message = err.message || "Internal Server Error";
//     let error = err;

//     // Prisma Validation Errors
//     if (err instanceof Prisma.PrismaClientValidationError) {
//         statusCode = 400;
//         message = "Missing field or incorrect field type.";
//     }
//     // Prisma Known Request Errors (P2002, P2025 etc)
//     else if (err instanceof Prisma.PrismaClientKnownRequestError) {
//         statusCode = 400;
//         if (err.code === "P2025") message = "Record not found.";
//         else if (err.code === "P2002") message = "Duplicate key error.";
//         else if (err.code === "P2003") message = "Foreign key constraint failed.";
//     }
//     // JWT specific errors
//     else if (err.name === 'JsonWebTokenError') {
//         statusCode = 401;
//         message = "Invalid token format (JWT Malformed). Ensure you send 'Bearer <token>'.";
//     }
//     // Prisma Initialization Errors
//     else if (err instanceof Prisma.PrismaClientInitializationError) {
//         statusCode = 500;
//         if (err.errorCode === "P1001") message = "Cannot connect to the database.";
//     }


//         const errorResponse: TErrorResponse = {
//         success: false,
//         message: message,
//         errorSources,
//         error: envVars.NODE_ENV === 'development' ? err : undefined,
//         stack: envVars.NODE_ENV === 'development' ? stack : undefined,
//     }




//     res.status(statusCode).json({
//         success: false,
//         message,
//         error: {
//             name: err.name,
//             message: err.message
//         }
//     });





// }




import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma";
import config from "../config";
import { TErrorResponse } from "../interface/error";

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // 👇 DEV LOG ADDED (your requirement)
    if (config.NODE_ENV === "development") {
        console.log("Error from Global Error Handler:", err);
    }

    let statusCode = 500;
    let message = err.message || "Internal Server Error";

    // Prisma Validation Error
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = "Missing field or incorrect field type.";
    }

    // Prisma Known Errors
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        statusCode = 400;

        if (err.code === "P2025") message = "Record not found.";
        else if (err.code === "P2002") message = "Duplicate key error.";
        else if (err.code === "P2003") message = "Foreign key constraint failed.";
    }

    // JWT Error
    else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token format (JWT Malformed).";
    }

    // Prisma Init Error
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = 500;

        if (err.errorCode === "P1001") {
            message = "Cannot connect to the database.";
        }
    }

    const errorResponse: TErrorResponse = {
        success: false,
        message,
        errorSources: [
            {
                path: "",
                message,
            },
        ],
        error: config.NODE_ENV === "development" ? err : undefined,
        stack: config.NODE_ENV === "development" ? err.stack : undefined,
    };

    return res.status(statusCode).json(errorResponse);
}