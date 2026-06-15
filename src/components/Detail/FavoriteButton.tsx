import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import type { Artwork } from '../../types';

interface FavoriteButtonProps {
  artwork: Artwork;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ artwork }) => {
  const { isFavorited, toggleFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  const favorited = isFavorited(artwork.id);

  const handleToggle = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    toggleFavorite(artwork);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isAnimating}
      className={`
        relative flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-lg
        transition-all duration-300 transform
        ${favorited
          ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
          : 'bg-white border-2 border-yellow-200 text-yellow-500 hover:border-yellow-400 hover:shadow-md'
        }
        ${isAnimating ? 'scale-110' : 'hover:scale-105'}
      `}
    >
      <Star
        className={`w-6 h-6 transition-all duration-300 ${favorited ? 'fill-white scale-110' : ''}`}
      />
      <span>{favorited ? '已收藏' : '收藏'}</span>
      
      {favorited && isAnimating && (
        <span className="absolute inset-0 rounded-2xl animate-ping bg-yellow-400/30" />
      )}
    </button>
  );
};
