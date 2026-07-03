import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import sendResponse from '../../utils/sendResponse';
import config from '../../config';
import { IdeaService } from './idea.service';
import { TCreateIdea, TIdeaQuery } from './idea.interface';


import { uploadFileToCloudinary } from '../../config/cloudinary.config';


// const parseUserFromAuthHeader = (req: Request) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return {};
//     }

//     const token = authHeader.slice(7);
//     try {
//         return jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
//     } catch {
//         return {};
//     }
// };



export const parseUserFromAuthHeader = (
  req: Request
): JwtPayload | null => {
  try {
    const authHeader = req.headers.authorization;

    // Authorization header না থাকলে
    if (!authHeader) {
      return null;
    }

    // Bearer token কিনা চেক
    if (!authHeader.startsWith("Bearer ")) {
      return null;
    }

    // Bearer বাদ দিয়ে token বের করা
    const token = authHeader.split(" ")[1];

    if (!token) {
      return null;
    }

    // Token verify
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    return decoded;
  } catch (error) {
    return null;
  }
};



const createIdea = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;

    const result = await IdeaService.createIdea(req.body, userId as string);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Idea created successfully',
        data: result,
    });
});

// const createIdea = catchAsync(async (req: Request, res: Response) => {
//   const { id: userId } = req.user as JwtPayload;

//   const result = await IdeaService.createIdea(req.body, userId);

//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: 'Idea created successfully',
//     data: result,
//   });
// });


// src/controllers/idea.controller.ts

// ##########################################################################################

// const createIdea = catchAsync(async (req: Request, res: Response) => {
//   const { id: userId } = req.user as JwtPayload;

//   let images: string[] = [];

//   if (req.files && Array.isArray(req.files)) {
//     const uploaded = await Promise.all(
//       req.files.map(async (file: Express.Multer.File) => {
//         const result = await uploadFileToCloudinary(
//           file.buffer,
//           file.originalname
//         );

//         return result.secure_url;
//       })
//     );

//     images = uploaded;
//   }
//   console.log("Body:", req.body);
//   console.log("Files:", req.files);
//   console.log("File:", req.file);
//   const payload = {
//     title: req.body.title,
//     problemStatement: req.body.problemStatement,
//     proposedSolution: req.body.proposedSolution,
//     description: req.body.description,
//     categoryId: req.body.categoryId,
//     paymentStatus: req.body.paymentStatus,
//     price: req.body.price ? Number(req.body.price) : null,
//     images,
//   };

//   const result = await IdeaService.createIdea(payload, userId);

//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: "Idea created successfully",
//     data: result,
//   });
// });

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 


// const createIdea = catchAsync(async (req: Request, res: Response) => {
//   const { id: userId } = req.user as JwtPayload;

//   let images: string[] = [];

//   console.log("--- Request Data Check ---");
//   console.log("Body:", req.body);
//   console.log("Files (Array):", req.files);
//   console.log("File (Single):", req.file);

//   // 📝 মোড ১: যদি একাধিক ফাইল (Array) হিসেবে req.files আসে
//   if (req.files && Array.isArray(req.files) && req.files.length > 0) {
//     const uploaded = await Promise.all(
//       req.files.map(async (file: Express.Multer.File) => {
//         const result = await uploadFileToCloudinary(
//           file.buffer,
//           file.originalname
//         );
//         return result.secure_url;
//       })
//     );
//     images = uploaded;
//   }
//   // 📝 মোড ২: যদি সিঙ্গেল ফাইল (Object) হিসেবে req.file আসে
//   else if (req.file) {
//     const result = await uploadFileToCloudinary(
//       req.file.buffer,
//       req.file.originalname
//     );
//     images = [result.secure_url];
//   }

//   const payload = {
//     title: req.body.title,
//     problemStatement: req.body.problemStatement,
//     proposedSolution: req.body.proposedSolution,
//     description: req.body.description,
//     categoryId: req.body.categoryId,
//     paymentStatus: req.body.paymentStatus,
//     price: req.body.price ? Number(req.body.price) : null,
//     images, // ক্লাউডিনারির সিকিউর লিংক এখানে বসে যাবে
//   };

//   const result = await IdeaService.createIdea(payload, userId);

//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: "Idea created successfully",
//     data: result,
//   });
// });

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 

// const createIdea = catchAsync(async (req: Request, res: Response) => {
//   const { id: userId } = req.user as JwtPayload;

//   console.log("📸 req.file:", req.file);
//   console.log("📝 req.body:", req.body);

//   let images: string[] = [];

//   if (req.file) {
//     images.push(req.file.path); // Cloudinary URL
//   }

//   const payload = {
//     title: req.body.title,
//     description: req.body.description,
//     problemStatement: req.body.problemStatement || "",
//     proposedSolution: req.body.proposedSolution || "",
//     categoryId: req.body.categoryId,
//     paymentStatus: req.body.paymentStatus || "FREE",
//     price: req.body.price ? Number(req.body.price) : null,
//     images,
//   };

//   const result = await IdeaService.createIdea(payload, userId);

//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: "Idea created successfully",
//     data: result,
//   });
// });



// ###########################################################################################



// const createIdea = catchAsync(async (req: Request, res: Response) => {
//   const { id: userId } = req.user as JwtPayload;

//   let images: string[] = [];

//   if (req.files && Array.isArray(req.files)) {
//     const uploadedImages = await Promise.all(
//       req.files.map(async (file: Express.Multer.File) => {
//         const result = await uploadFileToCloudinary(
//           file.buffer,
//           file.originalname
//         );

//         return result.secure_url;
//       })
//     );

//     images = uploadedImages;
//   }

//   const payload = {
//     title: req.body.title,
//     problemStatement: req.body.problemStatement,
//     proposedSolution: req.body.proposedSolution,
//     description: req.body.description,
//     categoryId: req.body.categoryId,
//     paymentStatus: req.body.paymentStatus || "FREE",
//     price: req.body.price ? Number(req.body.price) : null,
//     images,
//   };

//   const result = await IdeaService.createIdea(payload, userId);

//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: "Idea created successfully",
//     data: result,
//   });
// });





const getAllIdeas = catchAsync(async (req: Request, res: Response) => {
  const query = pick(req.query as Record<string, string>, [
    'page',
    'limit',
    'sort',
    'category',
    'isPaid',
    'search',
    'minVotes',
  ]) as TIdeaQuery;

  const { meta, data } = await IdeaService.getAllIdeas(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ideas retrieved successfully',
    meta,
    data,
  });
});

// const getIdeaById = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params as { id: string };
//     const authUser = parseUserFromAuthHeader(req);
//     const result = await IdeaService.getIdeaById(
//         id,
//         authUser.userId as string | undefined,
//         authUser.role as string | undefined,
//     );

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Idea retrieved successfully',
//         data: result,
//     });
// });



// const getIdeaById = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params as { id: string };
//   const authUser = parseUserFromAuthHeader(req);

//   const userId = authUser?.userId;
//   const role = authUser?.role;

//   const result = await IdeaService.getIdeaById(id, userId, role);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Idea retrieved successfully',
//     data: result,
//   });
// });



export const getIdeaById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  //  auth user extract (if exists)
  const authUser = parseUserFromAuthHeader(req);

  const userId = authUser?.userId;
  const role = authUser?.role;

  //  service call
  const result = await IdeaService.getIdeaById(id, userId, role);

  //  response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Idea retrieved successfully",
    data: result,
  });
});



const updateIdea = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { userId } = req.user as JwtPayload;

  const result = await IdeaService.updateIdea(
    id,
    userId as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Idea updated successfully',
    data: result,
  });
});

const deleteIdea = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { userId } = req.user as JwtPayload;

  const result = await IdeaService.deleteIdea(id, userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Idea deleted successfully',
    data: result,
  });
});

const submitIdea = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { userId } = req.user as JwtPayload;

  const result = await IdeaService.submitIdea(id, userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Idea submitted for review successfully',
    data: result,
  });
});

const getMyIdeas = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;

  const result = await IdeaService.getMyIdeas(userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My ideas retrieved successfully',
    data: result,
  });
});

const getAllIdeasAdmin = catchAsync(async (req: Request, res: Response) => {
  const query = pick(req.query as Record<string, string>, [
    'page',
    'limit',
    'sort',
    'category',
    'isPaid',
    'search',
    'minVotes',
  ]) as TIdeaQuery;

  const { meta, data } = await IdeaService.getAllIdeasAdmin(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin idea list retrieved successfully',
    meta,
    data,
  });
});

const approveIdea = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const result = await IdeaService.approveIdea(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Idea approved successfully',
    data: result,
  });
});

const rejectIdea = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const result = await IdeaService.rejectIdea(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Idea rejected successfully',
    data: result,
  });
});

const adminDeleteIdea = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const result = await IdeaService.adminDeleteIdea(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Idea deleted successfully',
    data: result,
  });
});

export const IdeaController = {
  createIdea,
  getAllIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
  submitIdea,
  getMyIdeas,
  getAllIdeasAdmin,
  approveIdea,
  rejectIdea,
  adminDeleteIdea,
};




// import { Request, Response } from 'express';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import httpStatus from 'http-status';
// import catchAsync from '../../utils/catchAsync';
// import pick from '../../utils/pick';
// import sendResponse from '../../utils/sendResponse';
// import config from '../../config';
// import { IdeaService } from './idea.service';
// import { TIdeaQuery } from './idea.interface';

// const parseUserFromAuthHeader = (req: Request) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return {};
//     }

//     // Bearer থাকলেও টোকেন এক্সট্র্যাক্ট করবে, না থাকলেও ডিরেক্ট টোকেন নিবে
//     let token = authHeader.trim();
//     if (authHeader.startsWith('Bearer ')) {
//         token = authHeader.slice(7).trim();
//     }

//     try {
//         return jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
//     } catch {
//         return {};
//     }
// };

// const createIdea = catchAsync(async (req: Request, res: Response) => {
//     const { userId } = req.user as JwtPayload;

//     // 📸 মাল্টার থেকে ক্লাউডিনারি ইমেজের লিঙ্ক কালেক্ট করা
//     let payload = { ...req.body };
//     if (req.file && req.file.path) {
//         payload.image = req.file.path; // ডাটাবেজের স্কিমা অনুযায়ী ফিল্ডের নাম (image / fileUrl) মিলিয়ে নেবেন
//     }

//     const result = await IdeaService.createIdea(payload, userId as string);

//     sendResponse(res, {
//         statusCode: httpStatus.CREATED,
//         success: true,
//         message: 'Idea created successfully',
//         data: result,
//     });
// });

// const getAllIdeas = catchAsync(async (req: Request, res: Response) => {
//     const query = pick(req.query as Record<string, string>, [
//         'page',
//         'limit',
//         'sort',
//         'category',
//         'isPaid',
//         'search',
//         'minVotes',
//     ]) as TIdeaQuery;

//     const { meta, data } = await IdeaService.getAllIdeas(query);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Ideas retrieved successfully',
//         meta,
//         data,
//     });
// });

// const getIdeaById = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params as { id: string };
//     const authUser = parseUserFromAuthHeader(req);
//     const result = await IdeaService.getIdeaById(
//         id,
//         authUser.userId as string | undefined,
//         authUser.role as string | undefined,
//     );

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Idea retrieved successfully',
//         data: result,
//     });
// });

// const updateIdea = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params as { id: string };
//     const { userId } = req.user as JwtPayload;

//     // 📸 আপডেট করার সময়ও যদি নতুন ইমেজ পাঠানো হয়
//     let payload = { ...req.body };
//     if (req.file && req.file.path) {
//         payload.image = req.file.path;
//     }

//     const result = await IdeaService.updateIdea(
//         id,
//         userId as string,
//         payload,
//     );

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Idea updated successfully',
//         data: result,
//     });
// });

// const deleteIdea = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params as { id: string };
//     const { userId } = req.user as JwtPayload;

//     const result = await IdeaService.deleteIdea(id, userId as string);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Idea deleted successfully',
//         data: result,
//     });
// });

// const submitIdea = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params as { id: string };
//     const { userId } = req.user as JwtPayload;

//     const result = await IdeaService.submitIdea(id, userId as string);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Idea submitted for review successfully',
//         data: result,
//     });
// });

// const getMyIdeas = catchAsync(async (req: Request, res: Response) => {
//     const { userId } = req.user as JwtPayload;

//     const result = await IdeaService.getMyIdeas(userId as string);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'My ideas retrieved successfully',
//         data: result,
//     });
// });

// const getAllIdeasAdmin = catchAsync(async (req: Request, res: Response) => {
//     const query = pick(req.query as Record<string, string>, [
//         'page',
//         'limit',
//         'sort',
//         'category',
//         'isPaid',
//         'search',
//         'minVotes',
//     ]) as TIdeaQuery;

//     const { meta, data } = await IdeaService.getAllIdeasAdmin(query);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Admin idea list retrieved successfully',
//         meta,
//         data,
//     });
// });

// const approveIdea = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params as { id: string };
//     const result = await IdeaService.approveIdea(id);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Idea approved successfully',
//         data: result,
//     });
// });

// const rejectIdea = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params as { id: string };
//     const result = await IdeaService.rejectIdea(id, req.body);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Idea rejected successfully',
//         data: result,
//     });
// });

// const adminDeleteIdea = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params as { id: string };
//     const result = await IdeaService.adminDeleteIdea(id);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Idea deleted successfully',
//         data: result,
//     });
// });

// export const IdeaController = {
//     createIdea,
//     getAllIdeas,
//     getIdeaById,
//     updateIdea,
//     deleteIdea,
//     submitIdea,
//     getMyIdeas,
//     getAllIdeasAdmin,
//     approveIdea,
//     rejectIdea,
//     adminDeleteIdea,
// };