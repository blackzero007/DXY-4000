import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Artwork } from '../types';

const STORAGE_KEY = 'artwork_favorites';

interface FavoriteArtwork extends Artwork {
  favoritedAt: number;
}

interface FavoritesContextType {
  favorites: FavoriteArtwork[];
  isFavorited: (artworkId: number) => boolean;
  addFavorite: (artwork: Artwork) => void;
  removeFavorite: (artworkId: number) => void;
  toggleFavorite: (artwork: Artwork) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    setFavorites(prev => {
      if (prev.some(item => item.id === artwork.id)) {
        return prev.filter(item => item.id !== artwork.id);
      }
      return [...prev, { ...artwork, favoritedAt: Date.now() }];
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorited,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
