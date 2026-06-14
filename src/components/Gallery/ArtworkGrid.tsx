import React from 'react';
import { ArtworkCard } from './ArtworkCard';
import type { Artwork } from '../../types';
import { Palette } from 'lucide-react';

interface ArtworkGridProps {
  artworks: Artwork[];
  loading?: boolean;
}

export const ArtworkGrid: React.FC<ArtworkGridProps> = ({ artworks, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-100" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-yellow-100 rounded-full flex items-center justify-center">
          <Palette className="w-12 h-12 text-pink-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">还没有作品哦~</h3>
        <p className="text-gray-500">快来成为第一个发布作品的人吧！</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {artworks.map((artwork, index) => (
        <ArtworkCard key={artwork.id} artwork={artwork} index={index} />
      ))}
    </div>
  );
};
