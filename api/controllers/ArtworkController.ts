import type { Request, Response } from 'express';
import { ArtworkService } from '../services/ArtworkService';
import type { ArtworkTag, SortType } from '../../shared/types';

const VALID_TAGS: ArtworkTag[] = ['风景', '人物', '动物', '抽象', '其他'];

export class ArtworkController {
  static getArtworks(req: Request, res: Response): void {
    try {
      const sort = (req.query.sort as SortType) || 'latest';
      const tag = req.query.tag as ArtworkTag | undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 12;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;

      if (sort !== 'hot' && sort !== 'latest' && sort !== 'mostComments') {
        res.status(400).json({ error: 'Invalid sort parameter. Must be "hot", "latest" or "mostComments"' });
        return;
      }

      if (tag && !VALID_TAGS.includes(tag)) {
        res.status(400).json({ error: `Invalid tag. Must be one of: ${VALID_TAGS.join(', ')}` });
        return;
      }

      if (isNaN(page) || page < 1) {
        res.status(400).json({ error: 'Invalid page parameter. Must be a positive integer' });
        return;
      }

      if (isNaN(pageSize) || pageSize < 1) {
        res.status(400).json({ error: 'Invalid pageSize parameter. Must be a positive integer' });
        return;
      }

      const effectiveLimit = limit ?? pageSize;
      const effectiveOffset = offset ?? (page - 1) * pageSize;

      const result = ArtworkService.getArtworks(sort, effectiveLimit, effectiveOffset, tag);
      res.json({ data: result.data, total: result.total, page, pageSize });
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
      const { title, author, imageData, tags, visitorId } = req.body;

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

      const validVisitorId = visitorId && typeof visitorId === 'string' ? visitorId : undefined;

      const artwork = ArtworkService.createArtwork(title.trim(), author.trim(), imageData, artworkTags, validVisitorId);
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

  static getRelatedArtworks(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid artwork ID' });
        return;
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      const artworks = ArtworkService.getRelatedArtworks(id, limit);
      res.json({ data: artworks });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch related artworks' });
    }
  }

  static getArtworksByAuthor(req: Request, res: Response): void {
    try {
      const author = req.params.author;
      if (!author || typeof author !== 'string' || author.trim().length === 0) {
        res.status(400).json({ error: 'Invalid author parameter' });
        return;
      }

      const result = ArtworkService.getArtworksByAuthor(decodeURIComponent(author));
      res.json({ data: result.data, total: result.total });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch artworks by author' });
    }
  }
}
