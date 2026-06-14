import React, { useState, useEffect } from 'react';
import { Palette, Sparkles } from 'lucide-react';
import { ArtworkGrid } from '../components/Gallery/ArtworkGrid';
import { SortTabs } from '../components/Gallery/SortTabs';
import { api } from '../utils/api';
import type { Artwork, SortType } from '../types';

export const GalleryPage: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [sort, setSort] = useState<SortType>('latest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtworks();
  }, [sort]);

  const loadArtworks = async () => {
    setLoading(true);
    try {
      const res = await api.getArtworks(sort);
      setArtworks(res.data);
    } catch (error) {
      console.error('Failed to load artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12 animate-fadeInDown">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md mb-6">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">发现精彩创作</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">
                简笔画涂鸦画廊
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              在这里，每个人都可以是艺术家！用简单的笔触，画出你的创意世界 ✨
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">全部作品</h2>
                <p className="text-sm text-gray-500">共 {artworks.length} 幅作品</p>
              </div>
            </div>
            <SortTabs sort={sort} onSortChange={setSort} />
          </div>

          <ArtworkGrid artworks={artworks} loading={loading} />
        </div>
      </div>
    </div>
  );
};
