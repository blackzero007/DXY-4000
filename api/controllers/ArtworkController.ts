import type { Request, Response } from 'express';
import { ArtworkService } from '../services/ArtworkService';
import type { ArtworkTag, SortType } from '../../shared/types';

const VALID_TAGS: ArtworkTag[] = ['风景', '人物', '动物', '抽象', '其他'];

export class ArtworkController {
  static getArtworks(req: Request, res: Response): void {
    try {
      const sort = (req.query.sort as SortType) || 'latest';
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      const tag = req.query.tag as ArtworkTag | undefined;

      if (sort !== 'hot' && sort !== 'latest') {
        res.status(400).json({ error: 'Invalid sort parameter. Must be "hot" or "latest"' });
        return;
      }

      if (tag && !VALID_TAGS.includes(tag)) {
        res.status(400).json({ error: `Invalid tag. Must be one of: ${VALID_TAGS.join(', ')}` });
        return;
      }

      const result = ArtworkService.getArtworks(sort, limit, offset, tag);
      res.json({ data: result.data, total: result.total });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch artworks' });
    }
  }

  static getArtworkById(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid artwork ID' });
        return;
      }

      const artwork = ArtworkService.getArtworkById(id);
      if (!artwork) {
        res.status(404).json({ error: 'Artwork not found' });
        return;
      }

      res.json({ data: artwork });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch artwork' });
    }
  }

  static createArtwork(req: Request, res: Response): void {
    try {
      const { title, author, imageData, tags } = req.body;

      if (!title || !author || !imageData) {
        res.status(400).json({ error: 'Missing required fields: title, author, imageData' });
        return;
      }

      if (typeof title !== 'string' || title.trim().length === 0) {
        res.status(400).json({ error: 'Invalid title' });
        return;
      }

      if (typeof author !== 'string' || author.trim().length === 0) {
        res.status(400).json({ error: 'Invalid author' });
        return;
      }

      if (typeof imageData !== 'string' || !imageData.startsWith('data:image/')) {
        res.status(400).json({ error: 'Invalid image data' });
        return;
      }

      const artworkTags: ArtworkTag[] = Array.isArray(tags)
        ? tags.filter((t: string): t is ArtworkTag => VALID_TAGS.includes(t as ArtworkTag))
        : [];

      const artwork = ArtworkService.createArtwork(title.trim(), author.trim(), imageData, artworkTags);
      res.status(201).json({ data: artwork, message: 'Artwork created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create artwork' });
    }
  }

  static toggleLike(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);
      const { visitorId } = req.body;

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid artwork ID' });
        return;
      }

      if (!visitorId || typeof visitorId !== 'string') {
        res.status(400).json({ error: 'Missing or invalid visitorId' });
        return;
      }

      const result = ArtworkService.toggleLike(id, visitorId);
      res.json({ data: result });
    } catch (error) {
      if (error instanceof Error && error.message === 'Artwork not found') {
        res.status(404).json({ error: 'Artwork not found' });
        return;
      }
      res.status(500).json({ error: 'Failed to toggle like' });
    }
  }

  static checkLikeStatus(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);
      const { visitorId } = req.query;

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid artwork ID' });
        return;
      }

      if (!visitorId || typeof visitorId !== 'string') {
        res.status(400).json({ error: 'Missing or invalid visitorId' });
        return;
      }

      const liked = ArtworkService.hasUserLiked(id, visitorId);
      res.json({ data: { liked } });
    } catch (error) {
      res.status(500).json({ error: 'Failed to check like status' });
    }
  }

  static incrementViews(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid artwork ID' });
        return;
      }

      const result = ArtworkService.incrementViews(id);
      res.json({ data: result });
    } catch (error) {
      if (error instanceof Error && error.message === 'Artwork not found') {
        res.status(404).json({ error: 'Artwork not found' });
        return;
      }
      res.status(500).json({ error: 'Failed to increment views' });
    }
  }
}
