import fs from 'fs';
import path from 'path';
import type { DatabaseSchema, Artwork, ArtworkTag, Comment, LikeRecord, Message } from '../../shared/types';

const DATA_FILE = path.join(process.cwd(), 'data', 'db.json');

const initialData: DatabaseSchema = {
  artworks: [],
  comments: [],
  likeRecords: [],
  messages: [],
};

function readData(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      writeData(initialData);
      return initialData;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data: DatabaseSchema = JSON.parse(raw);
    let needsSave = false;

    if (!data.messages) {
      data.messages = [];
      needsSave = true;
    }

    data.artworks.forEach((artwork) => {
      if (artwork.views === undefined || artwork.views === null) {
        (artwork as any).views = Math.max(10, Math.floor((artwork.likes || 0) * 3 + Math.random() * 100));
        needsSave = true;
      }
      if ((artwork as any).commentCount === undefined || (artwork as any).commentCount === null) {
        (artwork as any).commentCount = 0;
        needsSave = true;
      }
    });

    data.comments.forEach((comment) => {
      if ((comment as any).parentId === undefined) {
        (comment as any).parentId = undefined;
        needsSave = true;
      }
      if ((comment as any).replyTo === undefined) {
        (comment as any).replyTo = undefined;
        needsSave = true;
      }
    });
    if (needsSave) {
      writeData(data);
    }
    return data;
  } catch {
    return initialData;
  }
}

function writeData(data: DatabaseSchema): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export const dbRaw = {
  readData,
  writeData,
};

export const db = {
  artworks: {
    getAll: (tag?: ArtworkTag): Artwork[] => {
      const data = readData();
      const commentCounts = new Map<number, number>();
      for (const comment of data.comments) {
        commentCounts.set(comment.artworkId, (commentCounts.get(comment.artworkId) || 0) + 1);
      }
      let artworks = data.artworks.map((a) => ({
        ...a,
        views: a.views || 0,
        tags: a.tags || [],
        commentCount: commentCounts.get(a.id) || 0,
      }));
      if (tag) {
        artworks = artworks.filter((a) => a.tags.includes(tag));
      }
      return artworks;
    },
    getById: (id: number): Artwork | undefined => {
      const data = readData();
      const artwork = data.artworks.find((a) => a.id === id);
      if (artwork) {
        const commentCount = data.comments.filter((c) => c.artworkId === id).length;
        return { ...artwork, views: artwork.views || 0, tags: artwork.tags || [], commentCount };
      }
      return undefined;
    },
    getByAuthor: (author: string): Artwork[] => {
      const data = readData();
      const commentCounts = new Map<number, number>();
      for (const comment of data.comments) {
        commentCounts.set(comment.artworkId, (commentCounts.get(comment.artworkId) || 0) + 1);
      }
      return data.artworks
        .filter((a) => a.author === author)
        .map((a) => ({
          ...a,
          views: a.views || 0,
          tags: a.tags || [],
          commentCount: commentCounts.get(a.id) || 0,
        }))
        .sort((a, b) => b.createdAt - a.createdAt);
    },
    create: (artwork: Omit<Artwork, 'id' | 'likes' | 'views' | 'commentCount' | 'createdAt'>): Artwork => {
      const data = readData();
      const newArtwork: Artwork = {
        ...artwork,
        tags: artwork.tags || [],
        id: data.artworks.length > 0 ? Math.max(...data.artworks.map((a) => a.id)) + 1 : 1,
        likes: 0,
        views: 0,
        commentCount: 0,
        createdAt: Date.now(),
      };
      data.artworks.push(newArtwork);
      writeData(data);
      return newArtwork;
    },
    updateLikes: (id: number, likes: number): void => {
      const data = readData();
      const artwork = data.artworks.find((a) => a.id === id);
      if (artwork) {
        artwork.likes = likes;
        writeData(data);
      }
    },
    incrementViews: (id: number): number => {
      const data = readData();
      const artwork = data.artworks.find((a) => a.id === id);
      if (artwork) {
        artwork.views = (artwork.views || 0) + 1;
        writeData(data);
        return artwork.views;
      }
      return 0;
    },
    updateViews: (id: number, views: number): void => {
      const data = readData();
      const artwork = data.artworks.find((a) => a.id === id);
      if (artwork) {
        artwork.views = views;
        writeData(data);
      }
    },
  },
  comments: {
    getAll: (): Comment[] => {
      return readData().comments.map((c) => ({ ...c }));
    },
    getByArtworkId: (artworkId: number): Comment[] => {
      return readData()
        .comments.filter((c) => c.artworkId === artworkId)
        .sort((a, b) => b.createdAt - a.createdAt);
    },
    create: (comment: Omit<Comment, 'id' | 'createdAt'>): Comment => {
      const data = readData();
      const newComment: Comment = {
        ...comment,
        id: data.comments.length > 0 ? Math.max(...data.comments.map((c) => c.id)) + 1 : 1,
        createdAt: Date.now(),
      };
      data.comments.push(newComment);
      writeData(data);
      return newComment;
    },
  },
  likeRecords: {
    hasLiked: (artworkId: number, visitorId: string): boolean => {
      return readData().likeRecords.some(
        (r) => r.artworkId === artworkId && r.visitorId === visitorId
      );
    },
    add: (artworkId: number, visitorId: string): void => {
      const data = readData();
      if (!db.likeRecords.hasLiked(artworkId, visitorId)) {
        data.likeRecords.push({
          artworkId,
          visitorId,
          createdAt: Date.now(),
        });
        writeData(data);
      }
    },
    remove: (artworkId: number, visitorId: string): void => {
      const data = readData();
      data.likeRecords = data.likeRecords.filter(
        (r) => !(r.artworkId === artworkId && r.visitorId === visitorId)
      );
      writeData(data);
    },
  },
  messages: {
    getAll: (): Message[] => {
      return readData()
        .messages.map((m) => ({ ...m }))
        .sort((a, b) => b.createdAt - a.createdAt);
    },
    getById: (id: number): Message | undefined => {
      return readData().messages.find((m) => m.id === id);
    },
    create: (message: Omit<Message, 'id' | 'createdAt'>): Message => {
      const data = readData();
      const newMessage: Message = {
        ...message,
        id: data.messages.length > 0 ? Math.max(...data.messages.map((m) => m.id)) + 1 : 1,
        createdAt: Date.now(),
      };
      data.messages.push(newMessage);
      writeData(data);
      return newMessage;
    },
    update: (id: number, updates: Partial<Omit<Message, 'id' | 'createdAt'>>): Message | undefined => {
      const data = readData();
      const index = data.messages.findIndex((m) => m.id === id);
      if (index !== -1) {
        data.messages[index] = { ...data.messages[index], ...updates };
        writeData(data);
        return data.messages[index];
      }
      return undefined;
    },
    delete: (id: number): boolean => {
      const data = readData();
      const initialLength = data.messages.length;
      data.messages = data.messages.filter((m) => m.id !== id);
      if (data.messages.length !== initialLength) {
        writeData(data);
        return true;
      }
      return false;
    },
  },
};
