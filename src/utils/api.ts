import type { Artwork, Comment, SortType, ApiResponse } from '../types';

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
  getArtworks: (sort: SortType = 'latest'): Promise<ApiResponse<Artwork[]>> => {
    return request<ApiResponse<Artwork[]>>(`/artworks?sort=${sort}`);
  },

  getArtworkById: (id: number): Promise<ApiResponse<Artwork>> => {
    return request<ApiResponse<Artwork>>(`/artworks/${id}`);
  },

  createArtwork: (title: string, author: string, imageData: string): Promise<ApiResponse<Artwork>> => {
    return request<ApiResponse<Artwork>>('/artworks', {
      method: 'POST',
      body: JSON.stringify({ title, author, imageData }),
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

  createComment: (artworkId: number, author: string, content: string): Promise<ApiResponse<Comment>> => {
    return request<ApiResponse<Comment>>(`/artworks/${artworkId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ author, content }),
    });
  },
};
