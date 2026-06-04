// import { ZodError, ZodIssue } from 'zod';
// import { TErrorSources, TGenericErrorResponse } from '../interface/error';

// const handleZodError = (err: ZodError): TGenericErrorResponse => {
//   const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
//     return {
//       path: issue?.path[issue.path.length - 1],
//       message: issue.message,
//     };
//   });

//   const statusCode = 400;

//   return {
//     statusCode,
//     message: 'Validation Error',
//     errorSources,
//   };
// };

// export default handleZodError;





// import { ZodError, ZodIssue } from "zod";
// import {
//   TErrorSources,
//   TGenericErrorResponse,
// } from "../interface/error";

// const handleZodError = (
//   err: ZodError
// ): TGenericErrorResponse => {

//   const errorSources: TErrorSources = err.issues.map(
//     (issue: ZodIssue) => {
//       return {
//         path: String(
//           issue.path[issue.path.length - 1]
//         ),
//         message: issue.message,
//       };
//     }
//   );

//   const statusCode = 400;

//   return {
//     statusCode,
//     message: "Validation Error",
//     errorSources,
//   };
// };

// export default handleZodError;






import { ZodError } from "zod";
import {
    TErrorSources,
    TGenericErrorResponse,
} from "../interface/error";

const handleZodError = (
    err: ZodError
): TGenericErrorResponse => {

    const errorSources: TErrorSources = err.issues.map(
        (issue) => ({
            path: String(
                issue.path[issue.path.length - 1]
            ),
            message: issue.message,
        })
    );

    return {
        statusCode: 400,
        message: "Validation Error",
        errorSources,
    };
};

export default handleZodError;
