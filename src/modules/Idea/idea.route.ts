// // import express from 'express';
// // import auth from '../../middlewares/auth';
// // import validateRequest from '../../middlewares/validateRequest';
// // import { IdeaController } from './idea.controller';
// // import { ideaValidationSchema } from './idea.validation';
// // import { multerUpload } from '../../config/multer.config'; 

// // const router = express.Router();

// // // Public idea listing routes
// // router.get(
// //     '/',
// //     validateRequest(ideaValidationSchema.getAllIdeas),
// //     IdeaController.getAllIdeas,
// // );


// // router.post(
// //     '/',
// //     auth('MEMBER'),
// //     multerUpload.single('file'), // 👈 ২. এখানে 'file' বা 'image' (যে নামে পোস্টম্যান থেকে ছবি পাঠাবেন) বসিয়ে দিন
// //     validateRequest(ideaValidationSchema.createIdea), // নোট: বডি ভ্যালিডেশনের আগে মাল্টার বসালে রিকোয়েস্টের টেক্সট ডেটা ঠিকঠাক ভ্যালিডেশন পাবে
// //     IdeaController.createIdea,
// // );

// // // Member-specific idea routes
// // router.post(
// //     '/',
// //     auth('MEMBER'),
// //     validateRequest(ideaValidationSchema.createIdea),
// //     IdeaController.createIdea,
// // );
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

// // // Admin idea management
// // router.get('/admin/ideas', auth('ADMIN'), IdeaController.getAllIdeasAdmin);
// // router.patch('/admin/ideas/:id/approve', auth('ADMIN'), IdeaController.approveIdea);
// // router.patch(
// //     '/admin/ideas/:id/reject',
// //     auth('ADMIN'),
// //     validateRequest(ideaValidationSchema.rejectIdea),
// //     IdeaController.rejectIdea,
// // );
// // router.delete('/admin/ideas/:id', auth('ADMIN'), IdeaController.adminDeleteIdea);

// // // Public idea detail route (must come after specific member/admin routes)
// // router.get('/:id', IdeaController.getIdeaById);

// // export const IdeaRoutes = router;




// import express from 'express';
// import auth from '../../middlewares/auth';
// import validateRequest from '../../middlewares/validateRequest';
// import { IdeaController } from './idea.controller';
// import { ideaValidationSchema } from './idea.validation';
// import { multerUpload } from '../../config/cloudinary.config';
// // import { multerUpload } from '../../config/multer.config'; 

// const router = express.Router();

// // Public idea listing routes
// router.get(
//     '/',
//     validateRequest(ideaValidationSchema.getAllIdeas),
//     IdeaController.getAllIdeas,
// );

// // ✅ শুধুমাত্র একটি ক্রিয়েট রাউট থাকবে (মাল্টার সহ)
// router.post(
//     '/',
//     auth('MEMBER'),
//     multerUpload.single('file'), 
//     // validateRequest(ideaValidationSchema.createIdea), 
//     IdeaController.createIdea,
// );

// // 🗑️ (নিচ থেকে ডুপ্লিকেট router.post('/', ...) অংশটি সম্পূর্ণ ফেলে দেওয়া হয়েছে)

// router.get('/my', auth('MEMBER'), IdeaController.getMyIdeas);

// router.patch(
//     '/:id',
//     auth('MEMBER'),
//     validateRequest(ideaValidationSchema.updateIdea),
//     IdeaController.updateIdea,
// );
// router.patch(
//     '/:id/submit',
//     auth('MEMBER'),
//     validateRequest(ideaValidationSchema.submitIdea),
//     IdeaController.submitIdea,
// );
// router.delete('/:id', auth('MEMBER'), IdeaController.deleteIdea);

// // Admin idea management
// router.get('/admin/ideas', auth('ADMIN'), IdeaController.getAllIdeasAdmin);
// router.patch('/admin/ideas/:id/approve', auth('ADMIN'), IdeaController.approveIdea);
// router.patch(
//     '/admin/ideas/:id/reject',
//     auth('ADMIN'),
//     validateRequest(ideaValidationSchema.rejectIdea),
//     IdeaController.rejectIdea,
// );
// router.delete('/admin/ideas/:id', auth('ADMIN'), IdeaController.adminDeleteIdea);

// // Public idea detail route (must come after specific member/admin routes)
// router.get('/:id', IdeaController.getIdeaById);

// export const IdeaRoutes = router;




import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { IdeaController } from './idea.controller';
import { ideaValidationSchema } from './idea.validation';
import { multerUpload } from '../../config/multer.config';
// import { multerUpload } from '../../config/multer.config';


const router = express.Router();

// ১. পাবলিক আইডিয়া লিস্টিং রুট
router.get(
    '/',
    validateRequest(ideaValidationSchema.getAllIdeas),
    IdeaController.getAllIdeas,
);

// ২. ক্রিয়েট আইডিয়া রাউট (মাল্টার সহ জড ভ্যালিডেশন অ্যাক্টিভেট করা হলো)
// router.post(
//     '/',
//     auth('MEMBER'),
//     multerUpload.single('file'), // 👈 প্রথমে ফাইল ও টেক্সট ফিল্ড পার্স হবে
//     validateRequest(ideaValidationSchema.createIdea), // 👈 এখন req.body রেডি, ভ্যালিডেশন কাজ করবে!
//     IdeaController.createIdea,
// );

router.post(
    '/create-idea',
    auth('MEMBER'), // ১. প্রথমে ইউজার লগইন কিনা চেক হবে
    multerUpload.single('file'), // ২. তারপর মাল্টার দিয়ে ইমেজ আপলোড হবে
    validateRequest(ideaValidationSchema.createIdea), // ৩. তারপর জড দিয়ে ডেটা ভ্যালিডেশন হবে
    IdeaController.createIdea // 👈 ৪. সবশেষে এই ক্লিন ফাংশনটি কল হবে (ভেতরে কোনো অ্যানোনিমাস ফাংশন থাকবে না)
);


// ৩. মেম্বার স্পেসিফিক আইডিয়া রুটসমূহ
router.get('/my', auth('MEMBER'), IdeaController.getMyIdeas);

router.patch(
    '/:id',
    auth('MEMBER'),
    validateRequest(ideaValidationSchema.updateIdea),
    IdeaController.updateIdea,
);

router.patch(
    '/:id/submit',
    auth('MEMBER'),
    validateRequest(ideaValidationSchema.submitIdea),
    IdeaController.submitIdea,
);

router.delete('/:id', auth('MEMBER'), IdeaController.deleteIdea);

// ৪. অ্যাডমিন আইডিয়া ম্যানেজমেন্ট রুটসমূহ
router.get('/admin/ideas', auth('ADMIN'), IdeaController.getAllIdeasAdmin);
router.patch('/admin/ideas/:id/approve', auth('ADMIN'), IdeaController.approveIdea);
router.patch(
    '/admin/ideas/:id/reject',
    auth('ADMIN'),
    validateRequest(ideaValidationSchema.rejectIdea),
    IdeaController.rejectIdea,
);

router.delete('/admin/ideas/:id', auth('ADMIN'), IdeaController.adminDeleteIdea);

// ৫. পাবলিক আইডিয়া ডিটেইল রুট (অবশ্যই সবার শেষে থাকবে)
router.get('/:id', IdeaController.getIdeaById);

export const IdeaRoutes = router;