// import { prisma } from "../../lib/prisma";
// import bcrypt from "bcryptjs";
// import jwt, { Secret } from "jsonwebtoken";



import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import config from "../../config";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";



// export const secret = "iadmcttoken";

const createUserIntoDb=async(payload:any)=>{
 const hashPassword=await bcrypt.hash(payload.password,8) 

const result =await prisma.user.create({
data:{...payload,password:hashPassword},
});
const {password, ...newResult}=result;
return  newResult
}


const loginUserIntoDb=async(payload:any)=>{
 const user=await prisma.user.findUnique({
    where:{
        email:payload.email
    },
 })
 if(!user){
    throw new Error ("User not found")
 } 
 const ispasswordMatched=await bcrypt.compare(
    payload.password,
    user.password,
 );
 if(!ispasswordMatched){
    throw new Error ("Invalid creadential!!");
 };

 const userData = {
    id: user.id,
    userId: user.id,
    name: user.name,
    role: user.role,
    status: user.status,
    email: user.email,
  };

  if (!config.jwt_access_secret || !config.jwt_refresh_secret) {
    throw new Error("JWT secrets not configured in environment");
  }

  const accessToken = jwt.sign(userData, config.jwt_access_secret, {
    expiresIn: config.jwt_access_expires_in as any,
  });

  const refreshToken = jwt.sign(userData, config.jwt_refresh_secret, {
    expiresIn: config.jwt_refresh_expires_in as any,
  });

  const { password, ...userWithoutPassword } = user;

  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };
}


const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token missing");
  }

  let decoded: JwtPayload;

  try {
    decoded = jwt.verify(
      token,
      config.jwt_refresh_secret as string
    ) as JwtPayload;
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }

  const userId = decoded.id ?? decoded.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.status !== "ACTIVE") {
    throw new AppError(httpStatus.FORBIDDEN, "User is not active");
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt_access_secret as string,
    {
      expiresIn: config.jwt_access_expires_in as any,
    }
  );

  return { accessToken };
};

const getMe = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
   //  include: {
   //    tutorProfile: true,
   //  },
  });
};

export const AuthService = {
    createUserIntoDb,
    loginUserIntoDb,
    refreshToken,
      getMe

    };


// ########################################################################################################


// import jwt, { JwtPayload } from "jsonwebtoken";
// import httpStatus from "http-status";
// import AppError from "../../errors/AppError";
// import config from "../../config";
// import bcrypt from "bcryptjs";
// import { prisma } from "../../lib/prisma";

// const createUserIntoDb = async (payload: any) => {
//   // সল্ট রাউন্ড ৮ থেকে পরিবর্তন করে ১০ করা হলো
//   const hashPassword = await bcrypt.hash(payload.password, 10);

//   const result = await prisma.user.create({
//     data: {
//       ...payload,
//       password: hashPassword,
//       status: payload.status || 'ACTIVE' // ডাটাবেজে ইউজার যেন ACTIVE হিসেবে তৈরি হয়
//     },
//   });

//   const { password, ...newResult } = result;
//   return newResult;
// };

// const loginUserIntoDb = async (payload: any) => {
//   const user = await prisma.user.findUnique({
//     where: {
//       email: payload.email
//     },
//   });

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "User not found");
//   }

//   // পাসওয়ার্ড ম্যাচিং চেক
//   const ispasswordMatched = await bcrypt.compare(
//     payload.password,
//     user.password,
//   );

//   if (!ispasswordMatched) {
//     throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credential!!");
//   }

//   // ইউজার সক্রিয় কিনা চেক
//   if (user.status !== "ACTIVE") {
//     throw new AppError(httpStatus.FORBIDDEN, "Your account is deactivated!");
//   }

//   const userData = {
//     id: user.id,
//     userId: user.id,
//     name: user.name,
//     role: user.role,
//     status: user.status,
//     email: user.email,
//   };

//   if (!config.jwt_access_secret || !config.jwt_refresh_secret) {
//     throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "JWT secrets not configured in environment");
//   }

//   const accessToken = jwt.sign(userData, config.jwt_access_secret as string, {
//     expiresIn: config.jwt_access_expires_in as any,
//   });

//   const refreshToken = jwt.sign(userData, config.jwt_refresh_secret as string, {
//     expiresIn: config.jwt_refresh_expires_in as any,
//   });

//   const { password, ...userWithoutPassword } = user;

//   return {
//     accessToken,
//     refreshToken,
//     user: userWithoutPassword,
//   };
// };

// const refreshToken = async (token: string) => {
//   if (!token) {
//     throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token missing");
//   }

//   let decoded: JwtPayload;
//   try {
//     decoded = jwt.verify(
//       token,
//       config.jwt_refresh_secret as string
//     ) as JwtPayload;
//   } catch (err) {
//     throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
//   }

//   const userId = decoded.id ?? decoded.userId;

//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//   });

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "User not found");
//   }

//   if (user.status !== "ACTIVE") {
//     throw new AppError(httpStatus.FORBIDDEN, "User is not active");
//   }

//   // অ্যাক্সেস টোকেনের ডাটা স্ট্রাকচার loginUserIntoDb এর মতো হুবহু সেম রাখা হলো
//   const accessToken = jwt.sign(
//     {
//       id: user.id,
//       userId: user.id,
//       name: user.name,
//       role: user.role,
//       status: user.status,
//       email: user.email,
//     },
//     config.jwt_access_secret as string,
//     {
//       expiresIn: config.jwt_access_expires_in as any,
//     }
//   );

//   return { accessToken };
// };

// const getMe = async (userId: string) => {
//   return prisma.user.findUnique({
//     where: { id: userId },
//   });
// };

// export const AuthService = {
//   createUserIntoDb,
//   loginUserIntoDb,
//   refreshToken,
//   getMe
// };