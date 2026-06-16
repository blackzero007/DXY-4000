import fs from 'fs';
import path from 'path';
import type { DatabaseSchema, Artwork, ArtworkTag, Comment, LikeRecord } from '../../shared/types';

const DATA_FILE = path.join(process.cwd(), 'data', 'db.json');

const initialData: DatabaseSchema = {
  artworks: [],
  comments: [],
  likeRecords: [],
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
    data.artworks.forEach((artwork) => {
      if (artwork.views === undefined || artwork.views === null) {
        (artwork as any).views = Math.max(10, Math.floor((artwork.likes || 0) * 3 + Math.random() * 100));
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

export const db = {
  artworks: {
    getAll: (tag?: ArtworkTag): Artwork[] => {
      let artworks = readData().artworks.map((a) => ({ ...a, views: a.views || 0, tags: a.tags || [] }));
      if (tag) {
        artworks = artworks.filter((a) => a.tags.includes(tag));
      }
      return artworks;
    },
    getById: (id: number): Artwork | undefined => {
      const artwork = readData().artworks.find((a) => a.id === id);
      if (artwork) {
        return { ...artwork, views: artwork.views || 0, tags: artwork.tags || [] };
      }
      return undefined;
    },
    create: (artwork: Omit<Artwork, 'id' | 'likes' | 'views' | 'createdAt'>): Artwork => {
      const data = readData();
      const newArtwork: Artwork = {
        ...artwork,
        tags: artwork.tags || [],
        id: data.artworks.length > 0 ? Math.max(...data.artworks.map((a) => a.id)) + 1 : 1,
        likes: 0,
        views: 0,
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
};
