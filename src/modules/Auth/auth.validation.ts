
// // const registerValidationSchema = z.object({
// //     name: z
// //         .string({ message: 'Name is required' })
// //         .min(2, 'Name must be at least 2 characters')
// //         .max(60, 'Name must be at most 60 characters'),
// //     email: z
// //         .string({ message: 'Email is required' })
// //         .email('Invalid email address'),
// //     password: z
// //         .string({ message: 'Password is required' })
// //         .min(6, 'Password must be at least 6 characters')
// //         .max(100, 'Password must be at most 100 characters'),
// //     profileImage: z
// //         .string()
// //         .url('Profile image must be a valid URL')
// //         .optional(),
// // });


// import { z } from 'zod';

// const registerValidationSchema = z.object({
//   body: z.object({
//     name: z.string({ message: 'Name is required' })
//       .min(2, 'Name must be at least 2 characters')
//       .max(60, 'Name must be at most 60 characters'),

//     email: z.string({ message: 'Email is required' })
//       .email('Invalid email address'),

//     password: z.string({ message: 'Password is required' })
//       .min(6, 'Password must be at least 6 characters')
//       .max(100, 'Password must be at most 100 characters'),

//     profileImage: z.string().url().optional(),
//   }),
// });



// export const loginValidationSchema = z.object({
//   body: z.object({
//     // 💡 এখানে z.string() এর ভেতর কিছু না লিখে পরে .min(1, "...") ব্যবহার করা হয়েছে
//     email: z
//       .string()
//       .min(1, { message: "Email is required" }) // খালি থাকলে এই মেসেজ দেখাবে
//       .email("Invalid email address"),
      
//     password: z
//       .string()
//       .min(1, { message: "Password is required" }) // খালি থাকলে এই মেসেज দেখাবে
//       .min(6, "Password must be at least 6 characters"),
//   }),
// });

// const refreshTokenValidationSchema = z.object({
//     cookies: z.object({
//         refreshToken: z.string({
//             message: 'Refresh token is required',
//         }),
//     }),
// });

// export const authValidationSchema = {
//     register: registerValidationSchema,
//     login: loginValidationSchema,
//     refresh: refreshTokenValidationSchema,
// };






// LOGIN
import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" })
      .trim()
      .toLowerCase(),

    password: z
      .string()
      .min(1, { message: "Password is required" }),
  }),
});

// REGISTER
export const registerUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .min(2, { message: "Name too short" })
      .trim(),

    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" })
      .trim()
      .toLowerCase(),

    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),

    img: z.string().url().optional(),
  }),
});

// REFRESH TOKEN
export const refreshTokenValidationSchema = z.object({
  cookies: z
    .object({
      refreshToken: z
        .string()
        .min(1, { message: "Refresh token is required" }),
    })
    .optional(),
});

export const authValidationSchema = {
  register: registerUserValidationSchema,
  login: loginValidationSchema,
  refresh: refreshTokenValidationSchema,
};