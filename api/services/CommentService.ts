import { db } from '../db';
import type { Comment } from '../../shared/types';

export class CommentService {
  static getCommentsByArtworkId(artworkId: number): Comment[] {
    return db.comments.getByArtworkId(artworkId);
  }

  static createComment(
    artworkId: number,
    author: string,
    content: string,
    parentId?: number,
    replyTo?: string
  ): Comment {
    const artwork = db.artworks.getById(artworkId);
    if (!artwork) {
      throw new Error('Artwork not found');
    }
    return db.comments.create({ artworkId, author, content, parentId, replyTo });
  }
}
