import { dbRaw } from '../db';


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

export class NotificationService {
  static getUnreadCount(visitorId: string, since: number): NotificationCount {
    const data = dbRaw.readData();
    const visitorArtworkIds = new Set(
      data.artworks
        .filter((a) => a.visitorId === visitorId)
        .map((a) => a.id)
    );

    let newComments = 0;
    let newLikes = 0;

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

  static getNotifications(visitorId: string, since?: number): NotificationItem[] {
    const data = dbRaw.readData();
    const artworkMap = new Map(data.artworks.map((a) => [a.id, a]));
    const visitorArtworkIds = new Set(
      data.artworks
        .filter((a) => a.visitorId === visitorId)
        .map((a) => a.id)
    );

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
