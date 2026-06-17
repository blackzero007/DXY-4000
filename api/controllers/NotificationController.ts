import type { Request, Response } from 'express';
import { NotificationService } from '../services/NotificationService';

export class NotificationController {
  static getUnreadCount(req: Request, res: Response): void {
    try {
      const { visitorId, since } = req.query;

      if (!visitorId || typeof visitorId !== 'string') {
        res.status(400).json({ error: 'Missing or invalid visitorId' });
        return;
      }

      const sinceTimestamp = since ? parseInt(since as string) : 0;
      if (isNaN(sinceTimestamp) || sinceTimestamp < 0) {
        res.status(400).json({ error: 'Invalid since parameter. Must be a non-negative integer timestamp' });
        return;
      }

      const result = NotificationService.getUnreadCount(visitorId, sinceTimestamp);
      res.json({ data: result });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notification count' });
    }
  }

  static getNotifications(req: Request, res: Response): void {
    try {
      const { visitorId, since } = req.query;

      if (!visitorId || typeof visitorId !== 'string') {
        res.status(400).json({ error: 'Missing or invalid visitorId' });
        return;
      }

      const sinceTimestamp = since ? parseInt(since as string) : undefined;
      if (since !== undefined && (isNaN(sinceTimestamp as number) || (sinceTimestamp as number) < 0)) {
        res.status(400).json({ error: 'Invalid since parameter. Must be a non-negative integer timestamp' });
        return;
      }

      const result = NotificationService.getNotifications(visitorId, sinceTimestamp);
      res.json({ data: result });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  }
}
