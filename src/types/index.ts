export type ArtworkTag = '风景' | '人物' | '动物' | '抽象' | '其他';

export interface Artwork {
  id: number;
  title: string;
  author: string;
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
}

export interface Message {
  id: number;
  author: string;
  email?: string;
  content: string;
  createdAt: number;
}

export type SortType = 'hot' | 'latest' | 'mostComments';

export type ToolType = 'pen' | 'eraser';

export interface CanvasState {
  color: string;
  brushSize: number;
  tool: ToolType;
  isDrawing: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  total?: number;
}
