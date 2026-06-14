import type { Request, Response } from 'express';
import { CommentService } from '../services/CommentService';

export class CommentController {
  static getCommentsByArtworkId(req: Request, res: Response): void {
    try {
      const artworkId = parseInt(req.params.id);
      if (isNaN(artworkId)) {
        res.status(400).json({ error: 'Invalid artwork ID' });
        return;
      }

      const comments = CommentService.getCommentsByArtworkId(artworkId);
      res.json({ data: comments });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  }

  static createComment(req: Request, res: Response): void {
    try {
      const artworkId = parseInt(req.params.id);
      const { author, content } = req.body;

      if (isNaN(artworkId)) {
        res.status(400).json({ error: 'Invalid artwork ID' });
        return;
      }

      if (!author || typeof author !== 'string' || author.trim().length === 0) {
        res.status(400).json({ error: 'Missing or invalid author' });
        return;
      }

      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        res.status(400).json({ error: 'Missing or invalid content' });
        return;
      }

      const comment = CommentService.createComment(artworkId, author.trim(), content.trim());
      res.status(201).json({ data: comment });
    } catch (error) {
      if (error instanceof Error && error.message === 'Artwork not found') {
        res.status(404).json({ error: 'Artwork not found' });
        return;
      }
      res.status(500).json({ error: 'Failed to create comment' });
    }
  }
}
