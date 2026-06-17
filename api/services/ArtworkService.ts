import { db } from '../db';
import type { Artwork, ArtworkTag, SortType } from '../../shared/types';

export class ArtworkService {
  static getArtworks(sort: SortType = 'latest', limit?: number, offset?: number, tag?: ArtworkTag): { data: Artwork[]; total: number } {
    let artworks = [...db.artworks.getAll(tag)];

    if (sort === 'hot') {
      artworks.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sort === 'mostComments') {
      const comments = db.comments.getAll();
      const commentCounts = new Map<number, number>();
      for (const comment of comments) {
        commentCounts.set(comment.artworkId, (commentCounts.get(comment.artworkId) || 0) + 1);
      }
      artworks.sort((a, b) => (commentCounts.get(b.id) || 0) - (commentCounts.get(a.id) || 0));
    } else {
      artworks.sort((a, b) => b.createdAt - a.createdAt);
    }

    const total = artworks.length;

    if (offset !== undefined) {
      artworks = artworks.slice(offset);
    }
    if (limit !== undefined) {
      artworks = artworks.slice(0, limit);
    }

    return { data: artworks, total };
  }

  static getArtworkById(id: number): Artwork | undefined {
    return db.artworks.getById(id);
  }

  static createArtwork(title: string, author: string, imageData: string, tags: ArtworkTag[] = [], visitorId?: string): Artwork {
    return db.artworks.create({ title, author, imageData, tags, visitorId });
  }

  static incrementViews(artworkId: number): { views: number } {
    const artwork = db.artworks.getById(artworkId);
    if (!artwork) {
      throw new Error('Artwork not found');
    }
    const views = db.artworks.incrementViews(artworkId);
    return { views };
  }

  static toggleLike(artworkId: number, visitorId: string): { likes: number; liked: boolean } {
    const artwork = db.artworks.getById(artworkId);
    if (!artwork) {
      throw new Error('Artwork not found');
    }

    const hasLiked = db.likeRecords.hasLiked(artworkId, visitorId);

    if (hasLiked) {
      db.likeRecords.remove(artworkId, visitorId);
      const newLikes = Math.max(0, artwork.likes - 1);
      db.artworks.updateLikes(artworkId, newLikes);
      return { likes: newLikes, liked: false };
    } else {
      db.likeRecords.add(artworkId, visitorId);
      const newLikes = artwork.likes + 1;
      db.artworks.updateLikes(artworkId, newLikes);
      return { likes: newLikes, liked: true };
    }
  }

  static hasUserLiked(artworkId: number, visitorId: string): boolean {
    return db.likeRecords.hasLiked(artworkId, visitorId);
  }

  static getArtworksByAuthor(author: string): { data: Artwork[]; total: number } {
    const artworks = db.artworks.getByAuthor(author);
    return { data: artworks, total: artworks.length };
  }

  static getRelatedArtworks(artworkId: number, limit: number = 4): Artwork[] {
    const artwork = db.artworks.getById(artworkId);
    if (!artwork) return [];

    const allArtworks = db.artworks.getAll();
    const scored = allArtworks
      .filter((a) => a.id !== artworkId)
      .map((a) => {
        let score = 0;
        if (a.author === artwork.author) score += 2;
        const commonTags = a.tags.filter((t) => artwork.tags.includes(t)).length;
        score += commonTags * 3;
        score += (a.likes || 0) * 0.01;
        return { artwork: a, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.artwork);

    return scored;
  }
}
