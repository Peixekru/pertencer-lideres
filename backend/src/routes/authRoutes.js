import express from 'express';
import { login, logout, refreshToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

export default router;



router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
/*
router.post('/users', createUser);               
router.get('/users', getAllUsers);               
router.get('/users/:id', getUserById);           
router.put('/users/:id', updateUserById);       
router.delete('/users/:id', deleteUserById);     
router.post('/users/bulk-upload', Exemplo: isAdmin,uploadCsv.single('csvFile'), bulkCreateUsersController);

router.get('/space/:urlParam/', getSpaceSettingsByName);  

router.get('/users/:userId/courses', getUserCourses);               
router.get('/user-courses/:userCourseId/course', getUserCourse);
router.get('/user-courses/:userCourseId/units', getUserUnits);  
router.get('/user-courses/:userCourseId/lessons', getUserLesson);
router.get('/user-courses/:userCourseId/gallery', getUserGallery);
router.get('/user-courses/:userCourseId/badges', getUserBadgs);
router.get('/user-courses/:userCourseId/widgets', getUserWidgets);
router.get('/user-courses/:userCourseId/units', getUserUnits); 
router.get('/user-courses/:userCourseId/timeCapsule', getUserTime);     
router.get('/user-courses/:userCourseId/accessibility', getUserAcessibility);
router.get('/user-courses/:userCourseId/settings', getUserSettings);  
router.get('/user-courses/:userCourseId/aiChat', getUserAiChat);

router.post('/user-courses/:userCourseId/course', postUserCourse);
router.post('/user-courses/:userCourseId/units', postUserUnits);
router.post('/user-courses/:userCourseId/lessons', postUserLesson);
router.post('/user-courses/:userCourseId/gallery', postUserGallery);
router.post('/user-courses/:userCourseId/badges', postUserBadgs);
router.post('/user-courses/:userCourseId/widposts', postUserWidposts);
router.post('/user-courses/:userCourseId/units', postUserUnits);
router.post('/user-courses/:userCourseId/timeCapsule', postUserTime);
router.post('/user-courses/:userCourseId/accessibility', postUserAcessibility);
router.post('/user-courses/:userCourseId/settings', postUserSettings);
router.post('/user-courses/:userCourseId/aiChat', getUserAiChat);  



router.post('/user-courses/:userCourseId/gallery/upload', upload.single('image'), resizeImage, uploadUserCourseImage);

*/