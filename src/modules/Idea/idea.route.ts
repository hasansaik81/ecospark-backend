




// import express from 'express';
// import auth from '../../middlewares/auth';
// import validateRequest from '../../middlewares/validateRequest';
// // import { multerUpload } from '../../config/multer.config';
// import { IdeaController } from './idea.controller';
// import { ideaValidationSchema } from './idea.validation';
// import { multerUpload } from '../../config/multer.config';
// // import express from "express";
// // import { upload } from "../middlewares/multer"; // your multer config
// // import { upload } from "../../middlewares/multer";


// const router = express.Router();

// // // ১. পাবলিক আইডিয়া লিস্টিং রুট (GET / এবং GET /public দুটোই কাজ করবে)
// // // router.get(
// // //     '/',
// // //     IdeaController.getAllIdeas,
// // // );

// // router.get(
// //     '/public',
// //     IdeaController.getAllIdeas,
// // );

// // // ২. ক্রিয়েট আইডিয়া রাউট (মাল্টার সহ জড ভ্যালিডেশন অ্যাক্টিভেট করা হলো)
// // // router.post(
// // //     '/',
// // //     auth('MEMBER'),
// // //     multerUpload.single('file'), // 👈 প্রথমে ফাইল ও টেক্সট ফিল্ড পার্স হবে
// // //     validateRequest(ideaValidationSchema.createIdea), // 👈 এখন req.body রেডি, ভ্যালিডেশন কাজ করবে!
// // //     IdeaController.createIdea,
// // // );

// // // আপনার রাউট ফাইল (যেমন: ideas.route.ts)
// // // router.post(
// // //     '/',
// // //     auth('MEMBER', 'ADMIN'), // 👈 নিশ্চিত করুন এখানে 'MEMBER' এবং 'ADMIN' দুটোই দেওয়া আছে
// // //     multerUpload.single('file'),
// // //     validateRequest(ideaValidationSchema.createIdea),
// // //     IdeaController.createIdea
// // // );


// // router.post(
// //   "/ideas",
// //   auth("MEMBER", "ADMIN"),
// //   multerUpload.single("image"), // 👈 ফিল্ড নাম "image"
// //   IdeaController.createIdea
// // );


// // // src/routes/idea.routes.ts
// // router.post(
// //   "/ideas",
// //   auth("MEMBER", "ADMIN"),
// //   multerUpload.array("images", 5), // 👈 ৫টি পর্যন্ত ফাইল
// //   IdeaController.createIdea
// // );

// // // ##################################################


// // // ৩. মেম্বার স্পেসিফিক আইডিয়া রুটসমূহ
// // router.get('/my', auth('MEMBER'), IdeaController.getMyIdeas);

// // router.patch(
// //     '/:id',
// //     auth('MEMBER'),
// //     validateRequest(ideaValidationSchema.updateIdea),
// //     IdeaController.updateIdea,
// // );

// // router.patch(
// //     '/:id/submit',
// //     auth('MEMBER'),
// //     validateRequest(ideaValidationSchema.submitIdea),
// //     IdeaController.submitIdea,
// // );

// // router.delete('/:id', auth('MEMBER'), IdeaController.deleteIdea);

// // // ৪. অ্যাডমিন আইডিয়া ম্যানেজমেন্ট রুটসমূহ
// // router.get('/admin/ideas', auth('ADMIN'), IdeaController.getAllIdeasAdmin);
// // router.patch('/admin/ideas/:id/approve', auth('ADMIN'), IdeaController.approveIdea);
// // router.patch(
// //     '/admin/ideas/:id/reject',
// //     auth('ADMIN'),
// //     validateRequest(ideaValidationSchema.rejectIdea),
// //     IdeaController.rejectIdea,
// // );

// // router.delete('/admin/ideas/:id', auth('ADMIN'), IdeaController.adminDeleteIdea);

// // // ৫. পাবলিক আইডিয়া ডিটেইল রুট (অবশ্যই সবার শেষে থাকবে)
// // router.get('/:id', IdeaController.getIdeaById);

// // export const IdeaRoutes = router;




// router.get("/public", IdeaController.getAllIdeas);
// router.get("/", IdeaController.getAllIdeas);

// // router.post(
// //     "/",
// //     auth("MEMBER", "ADMIN"),
// //     multerUpload.single("image"),
// //     IdeaController.createIdea
// // );


// // router.post(
// //     "/",
// //     auth("MEMBER", "ADMIN"),
// //     multerUpload.single("image"),
// //     IdeaController.createIdea
// // );

// // ✅ Create Idea Route with Multer for Image Uploads
// router.post(
//     "/",
//     auth("MEMBER", "ADMIN"),
   
//     validateRequest(ideaValidationSchema.createIdea),
//     IdeaController.createIdea
// );


// // router.post(
// //     "/",
// //     multerUpload.array("image"), // 👈 ১. মাল্টারকে সবার উপরে দিন এবং .array() ব্যবহার করুন
// //     auth("MEMBER", "ADMIN"),     // 👈 ২. অথেন্টিকেশন থাকবে মাল্টারের নিচে
// //     IdeaController.createIdea
// // );

// router.get("/my", auth("MEMBER"), IdeaController.getMyIdeas);

// router.patch(
//     "/:id",
//     auth("MEMBER"),
//     validateRequest(ideaValidationSchema.updateIdea),
//     IdeaController.updateIdea
// );

// router.patch(
//     "/:id/submit",
//     auth("MEMBER"),
//     validateRequest(ideaValidationSchema.submitIdea),
//     IdeaController.submitIdea
// );

// router.delete("/:id", auth("MEMBER"), IdeaController.deleteIdea);

// router.get("/admin/ideas", auth("ADMIN"), IdeaController.getAllIdeasAdmin);

// router.patch("/admin/ideas/:id/approve", auth("ADMIN"), IdeaController.approveIdea);

// router.patch(
//     "/admin/ideas/:id/reject",
//     auth("ADMIN"),
//     validateRequest(ideaValidationSchema.rejectIdea),
//     IdeaController.rejectIdea
// );

// router.delete("/admin/ideas/:id", auth("ADMIN"), IdeaController.adminDeleteIdea);

// router.get("/:id", IdeaController.getIdeaById);


// export const IdeaRoutes = router;






import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { IdeaController } from './idea.controller';
import { ideaValidationSchema } from './idea.validation';

const router = express.Router();

// ১. স্ট্যাটিক এবং পাবলিক রুটসমূহ (সবার উপরে থাকবে)
router.get("/public", IdeaController.getAllIdeas);
router.get("/my", auth("MEMBER"), IdeaController.getMyIdeas);
router.get("/admin/ideas", auth("ADMIN"), IdeaController.getAllIdeasAdmin);
router.get("/", IdeaController.getAllIdeas);

// ২. ক্রিয়েট রুট
router.post(
    "/",
    auth("MEMBER", "ADMIN"),
    validateRequest(ideaValidationSchema.createIdea),
    IdeaController.createIdea
);

// ৩. অ্যাডমিন অ্যাকশন রুটসমূহ
router.patch("/admin/ideas/:id/approve", auth("ADMIN"), IdeaController.approveIdea);
router.patch(
    "/admin/ideas/:id/reject",
    auth("ADMIN"),
    validateRequest(ideaValidationSchema.rejectIdea),
    IdeaController.rejectIdea
);
router.delete("/admin/ideas/:id", auth("ADMIN"), IdeaController.adminDeleteIdea);

// ৪. মেম্বার অ্যাকশন রুটসমূহ
router.patch("/:id/submit", auth("MEMBER"), validateRequest(ideaValidationSchema.submitIdea), IdeaController.submitIdea);
router.patch("/:id", auth("MEMBER"), validateRequest(ideaValidationSchema.updateIdea), IdeaController.updateIdea);
router.delete("/:id", auth("MEMBER"), IdeaController.deleteIdea);

// ৫. 🎯 সিঙ্গেল আইডিয়া ডিটেইলস রাউট (একদম সবার নিচে ডাইনামিক রাউট থাকবে)
router.get("/:id", IdeaController.getIdeaById);

export const IdeaRoutes = router;
