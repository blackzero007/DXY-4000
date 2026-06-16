import type { Request, Response } from 'express';
import { MessageService } from '../services/MessageService';

export class MessageController {
  static getMessages(req: Request, res: Response): void {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;

      const result = MessageService.getMessages(limit, offset);
      res.json({ data: result.data, total: result.total });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }

  static getMessageById(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid message ID' });
        return;
      }

      const message = MessageService.getMessageById(id);
      if (!message) {
        res.status(404).json({ error: 'Message not found' });
        return;
      }

      res.json({ data: message });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch message' });
    }
  }

  static createMessage(req: Request, res: Response): void {
    try {
      const { author, content, email } = req.body;

      if (!author || !content) {
        res.status(400).json({ error: 'Missing required fields: author, content' });
        return;
      }

      if (typeof author !== 'string' || author.trim().length === 0) {
        res.status(400).json({ error: 'Invalid author' });
        return;
      }

      if (typeof content !== 'string' || content.trim().length === 0) {
        res.status(400).json({ error: 'Invalid content' });
        return;
      }

      if (email && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
      }

      const message = MessageService.createMessage(author.trim(), content.trim(), email?.trim());
      res.status(201).json({ data: message, message: 'Message created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create message' });
    }
  }

  static updateMessage(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid message ID' });
        return;
      }

      const { author, content, email } = req.body;
      const updates: Partial<{ author: string; content: string; email?: string }> = {};

      if (author !== undefined) {
        if (typeof author !== 'string' || author.trim().length === 0) {
          res.status(400).json({ error: 'Invalid author' });
          return;
        }
        updates.author = author.trim();
      }

      if (content !== undefined) {
        if (typeof content !== 'string' || content.trim().length === 0) {
          res.status(400).json({ error: 'Invalid content' });
          return;
        }
        updates.content = content.trim();
      }

      if (email !== undefined) {
        if (email && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
          res.status(400).json({ error: 'Invalid email format' });
          return;
        }
        updates.email = email?.trim();
      }

      const message = MessageService.updateMessage(id, updates);
      if (!message) {
        res.status(404).json({ error: 'Message not found' });
        return;
      }

      res.json({ data: message, message: 'Message updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update message' });
    }
  }

  static deleteMessage(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid message ID' });
        return;
      }

      const success = MessageService.deleteMessage(id);
      if (!success) {
        res.status(404).json({ error: 'Message not found' });
        return;
      }

      res.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete message' });
    }
  }
}
