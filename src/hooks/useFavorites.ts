import { useState, useEffect, useCallback } from 'react';
import type { Artwork } from '../types';

const STORAGE_KEY = 'artwork_favorites';

interface FavoriteArtwork extends Artwork {
  favoritedAt: number;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteArtwork[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse favorites:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorited = useCallback((artworkId: number) => {
    return favorites.some(item => item.id === artworkId);
  }, [favorites]);

  const addFavorite = useCallback((artwork: Artwork) => {
    setFavorites(prev => {
      if (prev.some(item => item.id === artwork.id)) {
        return prev;
      }
      return [...prev, { ...artwork, favoritedAt: Date.now() }];
    });
  }, []);

  const removeFavorite = useCallback((artworkId: number) => {
    setFavorites(prev => prev.filter(item => item.id !== artworkId));
  }, []);

  const toggleFavorite = useCallback((artwork: Artwork) => {
    if (isFavorited(artwork.id)) {
      removeFavorite(artwork.id);
    } else {
      addFavorite(artwork);
    }
  }, [isFavorited, addFavorite, removeFavorite]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    isFavorited,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
  };
}
