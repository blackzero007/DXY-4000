import { db } from '../db';
import type { Artwork, SortType } from '../../shared/types';

export class ArtworkService {
  static getArtworks(sort: SortType = 'latest', limit?: number, offset?: number): { data: Artwork[]; total: number } {
    let artworks = [...db.artworks.getAll()];

    if (sort === 'hot') {
      artworks.sort((a, b) => (b.views || 0) - (a.views || 0));
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

  static createArtwork(title: string, author: string, imageData: string): Artwork {
    return db.artworks.create({ title, author, imageData });
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
}
