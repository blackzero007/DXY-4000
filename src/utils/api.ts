import type { Artwork, ArtworkTag, Comment, Message, SortType, ApiResponse } from '../types';

const API_BASE = '/api';

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  getArtworks: (sort: SortType = 'latest', tag?: ArtworkTag, page: number = 1, pageSize: number = 12): Promise<ApiResponse<Artwork[]>> => {
    const params = new URLSearchParams({ sort, page: String(page), pageSize: String(pageSize) });
    if (tag) params.append('tag', tag);
    return request<ApiResponse<Artwork[]>>(`/artworks?${params.toString()}`);
  },

  getArtworkById: (id: number): Promise<ApiResponse<Artwork>> => {
    return request<ApiResponse<Artwork>>(`/artworks/${id}`);
  },

  createArtwork: (title: string, author: string, imageData: string, tags: ArtworkTag[] = []): Promise<ApiResponse<Artwork>> => {
    return request<ApiResponse<Artwork>>('/artworks', {
      method: 'POST',
      body: JSON.stringify({ title, author, imageData, tags }),
    });
  },

  toggleLike: (artworkId: number, visitorId: string): Promise<ApiResponse<{ likes: number; liked: boolean }>> => {
    return request<ApiResponse<{ likes: number; liked: boolean }>>(`/artworks/${artworkId}/like`, {
      method: 'POST',
      body: JSON.stringify({ visitorId }),
    });
  },

  checkLikeStatus: (artworkId: number, visitorId: string): Promise<ApiResponse<{ liked: boolean }>> => {
    return request<ApiResponse<{ liked: boolean }>>(`/artworks/${artworkId}/like-status?visitorId=${visitorId}`);
  },

  incrementViews: (artworkId: number): Promise<ApiResponse<{ views: number }>> => {
    return request<ApiResponse<{ views: number }>>(`/artworks/${artworkId}/view`, {
      method: 'POST',
    });
  },

  getComments: (artworkId: number): Promise<ApiResponse<Comment[]>> => {
    return request<ApiResponse<Comment[]>>(`/artworks/${artworkId}/comments`);
  },

  createComment: (
    artworkId: number,
    author: string,
    content: string,
    parentId?: number,
    replyTo?: string
  ): Promise<ApiResponse<Comment>> => {
    return request<ApiResponse<Comment>>(`/artworks/${artworkId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ author, content, parentId, replyTo }),
    });
  },

  getArtworksByAuthor: (author: string): Promise<ApiResponse<Artwork[]>> => {
    return request<ApiResponse<Artwork[]>>(`/artworks/author/${encodeURIComponent(author)}`);
  },

  getMessages: (): Promise<ApiResponse<Message[]>> => {
    return request<ApiResponse<Message[]>>('/messages');
  },

  createMessage: (author: string, content: string, email?: string): Promise<ApiResponse<Message>> => {
    return request<ApiResponse<Message>>('/messages', {
      method: 'POST',
      body: JSON.stringify({ author, content, email }),
    });
  },

  updateMessage: (id: number, updates: Partial<Omit<Message, 'id' | 'createdAt'>>): Promise<ApiResponse<Message>> => {
    return request<ApiResponse<Message>>(`/messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteMessage: (id: number): Promise<{ success: boolean; message: string }> => {
    return request<{ success: boolean; message: string }>(`/messages/${id}`, {
      method: 'DELETE',
    });
  },
};
