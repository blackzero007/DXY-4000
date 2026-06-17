import { dbRaw } from '../db';
import type { Artwork } from '../../shared/types';


export interface NotificationCount {
  newComments: number;
  newLikes: number;
  total: number;
}

export interface NotificationItem {
  id: string;
  type: 'comment' | 'like';
  artworkId: number;
  artworkTitle: string;
  author?: string;
  content?: string;
  createdAt: number;
}

function getUserArtworkIds(visitorId?: string, author?: string): Set<number> {
  const data = dbRaw.readData();
  const ids = new Set<number>();

  for (const artwork of data.artworks) {
    if (artwork.visitorId) {
      if (visitorId && artwork.visitorId === visitorId) {
        ids.add(artwork.id);
      }
    } else {
      if (author && artwork.author === author) {
        ids.add(artwork.id);
      }
    }
  }

  return ids;
}

export class NotificationService {
  static getUnreadCount(since: number, visitorId?: string, author?: string): NotificationCount {
    const visitorArtworkIds = getUserArtworkIds(visitorId, author);

    let newComments = 0;
    let newLikes = 0;
    const data = dbRaw.readData();

    for (const comment of data.comments) {
      if (visitorArtworkIds.has(comment.artworkId) && comment.createdAt > since) {
        newComments++;
      }
    }

    for (const like of data.likeRecords) {
      if (visitorArtworkIds.has(like.artworkId) && like.createdAt > since) {
        newLikes++;
      }
    }

    return {
      newComments,
      newLikes,
      total: newComments + newLikes,
    };
  }

  static getNotifications(since?: number, visitorId?: string, author?: string): NotificationItem[] {
    const visitorArtworkIds = getUserArtworkIds(visitorId, author);
    const data = dbRaw.readData();
    const artworkMap = new Map<number, Artwork>(data.artworks.map((a) => [a.id, a]));

    const items: NotificationItem[] = [];
    const threshold = since ?? 0;

    for (const comment of data.comments) {
      if (visitorArtworkIds.has(comment.artworkId) && comment.createdAt > threshold) {
        const artwork = artworkMap.get(comment.artworkId);
        items.push({
          id: `comment_${comment.id}`,
          type: 'comment',
          artworkId: comment.artworkId,
          artworkTitle: artwork?.title ?? '未知作品',
          author: comment.author,
          content: comment.content,
          createdAt: comment.createdAt,
        });
      }
    }

    for (const like of data.likeRecords) {
      if (visitorArtworkIds.has(like.artworkId) && like.createdAt > threshold) {
        const artwork = artworkMap.get(like.artworkId);
        items.push({
          id: `like_${like.artworkId}_${like.visitorId}`,
          type: 'like',
          artworkId: like.artworkId,
          artworkTitle: artwork?.title ?? '未知作品',
          createdAt: like.createdAt,
        });
      }
    }

    items.sort((a, b) => b.createdAt - a.createdAt);
    return items;
  }
}
