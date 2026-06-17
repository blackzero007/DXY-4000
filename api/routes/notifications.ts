import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';

const router = Router();

router.get('/unread-count', NotificationController.getUnreadCount);
router.get('/', NotificationController.getNotifications);

export default router;
