export type ArtworkTag = '风景' | '人物' | '动物' | '抽象' | '其他';

export interface Artwork {
  id: number;
  title: string;
  author: string;
  visitorId?: string;
  imageData: string;
  tags: ArtworkTag[];
  likes: number;
  views: number;
  commentCount: number;
  createdAt: number;
}

export interface Comment {
  id: number;
  artworkId: number;
  author: string;
  content: string;
  createdAt: number;
  parentId?: number;
  replyTo?: string;
}

export interface LikeRecord {
  artworkId: number;
  visitorId: string;
  createdAt: number;
}

export interface Message {
  id: number;
  author: string;
  email?: string;
  content: string;
  createdAt: number;
}

export interface DatabaseSchema {
  artworks: Artwork[];
  comments: Comment[];
  likeRecords: LikeRecord[];
  messages: Message[];
}

export type SortType = 'hot' | 'latest' | 'mostComments';
