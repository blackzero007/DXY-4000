export interface Artwork {
  id: number;
  title: string;
  author: string;
  imageData: string;
  likes: number;
  createdAt: number;
}

export interface Comment {
  id: number;
  artworkId: number;
  author: string;
  content: string;
  createdAt: number;
}

export interface LikeRecord {
  artworkId: number;
  visitorId: string;
  createdAt: number;
}

export interface DatabaseSchema {
  artworks: Artwork[];
  comments: Comment[];
  likeRecords: LikeRecord[];
}

export type SortType = 'hot' | 'latest';
