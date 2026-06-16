import React, { useState, useEffect, useMemo } from 'react';
import { Palette, Sparkles, Search, X, Tag } from 'lucide-react';
import { ArtworkGrid } from '../components/Gallery/ArtworkGrid';
import { SortTabs } from '../components/Gallery/SortTabs';
import { api } from '../utils/api';
import type { Artwork, ArtworkTag, SortType } from '../types';

const ARTWORK_TAGS: ArtworkTag[] = ['风景', '人物', '动物', '抽象', '其他'];

const TAG_FILTER_COLORS: Record<ArtworkTag, string> = {
  '风景': 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200',
  '人物': 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200',
  '动物': 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200',
  '抽象': 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200',
  '其他': 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200',
};

const TAG_FILTER_SELECTED_COLORS: Record<ArtworkTag, string> = {
  '风景': 'bg-green-500 text-white border-green-500 shadow-md shadow-green-200',
  '人物': 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-200',
  '动物': 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200',
  '抽象': 'bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-200',
  '其他': 'bg-gray-500 text-white border-gray-500 shadow-md shadow-gray-200',
};

export const GalleryPage: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [sort, setSort] = useState<SortType>('latest');
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeTag, setActiveTag] = useState<ArtworkTag | undefined>(undefined);

  const filteredArtworks = useMemo(() => {
    if (!searchKeyword.trim()) return artworks;
    const keyword = searchKeyword.toLowerCase();
    return artworks.filter(artwork =>
      artwork.title.toLowerCase().includes(keyword)
    );
  }, [artworks, searchKeyword]);

  useEffect(() => {
    loadArtworks();
  }, [sort, activeTag]);

  const loadArtworks = async () => {
    setLoading(true);
    try {
      const res = await api.getArtworks(sort, activeTag);
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

          <div className="max-w-2xl mx-auto mb-8 animate-fadeInUp">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索作品名称..."
                className="w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm border-2 border-transparent rounded-2xl shadow-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-pink-300 focus:bg-white transition-all duration-300 hover:shadow-xl"
              />
              {searchKeyword && (
                <button
                  type="button"
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8 animate-fadeInUp">
            <Tag className="w-5 h-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setActiveTag(undefined)}
              className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-200 ${
                !activeTag
                  ? 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white border-pink-500 shadow-md shadow-pink-200'
                  : 'bg-white/80 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              全部
            </button>
            {ARTWORK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(activeTag === tag ? undefined : tag)}
                className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-200 ${
                  activeTag === tag
                    ? TAG_FILTER_SELECTED_COLORS[tag]
                    : TAG_FILTER_COLORS[tag]
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {searchKeyword ? '搜索结果' : '全部作品'}
                </h2>
                <p className="text-sm text-gray-500">
                  {searchKeyword
                    ? `找到 ${filteredArtworks.length} 幅相关作品`
                    : `共 ${artworks.length} 幅作品`
                  }
                </p>
              </div>
            </div>
            <SortTabs sort={sort} onSortChange={setSort} />
          </div>

          <ArtworkGrid artworks={filteredArtworks} loading={loading} />
        </div>
      </div>
    </div>
  );
};
