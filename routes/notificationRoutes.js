import express from 'express';
import { getUserNotifications, markNotificationAsRead } from '../controllers/notificationController.js';
import userAuthCheck from '../middleware/authCheck.js';

const notificationRouter = express.Router();

// GET all notifications for logged-in user
notificationRouter.get('/',userAuthCheck, getUserNotifications);

// MARK as read
notificationRouter.patch('/:notificationId/read',userAuthCheck, markNotificationAsRead);

export default notificationRouter;
