import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { User, Palette, ArrowLeft, Heart, Eye, Calendar } from 'lucide-react';
import { ArtworkGrid } from '../components/Gallery/ArtworkGrid';
import { api } from '../utils/api';
import type { Artwork } from '../types';

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export const UserProfilePage: React.FC = () => {
  const { author } = useParams<{ author: string }>();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  const decodedAuthor = author ? decodeURIComponent(author) : '';

  const loadUserArtworks = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getArtworksByAuthor(decodedAuthor);
      setArtworks(res.data);
    } catch (error) {
      console.error('Failed to load user artworks:', error);
    } finally {
      setLoading(false);
    }
  }, [decodedAuthor]);

  useEffect(() => {
    if (decodedAuthor) {
      loadUserArtworks();
    }
  }, [decodedAuthor, loadUserArtworks]);

  const stats = {
    totalArtworks: artworks.length,
    totalLikes: artworks.reduce((sum, a) => sum + a.likes, 0),
    totalViews: artworks.reduce((sum, a) => sum + (a.views || 0), 0),
    earliestDate: artworks.length > 0 ? Math.min(...artworks.map((a) => a.createdAt)) : Date.now(),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            返回画廊
          </Link>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 animate-fadeInDown">
            <div className="bg-gradient-to-r from-pink-100 via-yellow-100 to-blue-100 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                  <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {decodedAuthor}
                  </h1>
                  <p className="text-gray-600 mb-4">
                    创作者主页
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-xl">
                      <Palette className="w-5 h-5 text-pink-500" />
                      <div>
                        <p className="text-xs text-gray-500">作品数</p>
                        <p className="text-xl font-bold text-gray-800">{stats.totalArtworks}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-xl">
                      <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                      <div>
                        <p className="text-xs text-gray-500">总获赞</p>
                        <p className="text-xl font-bold text-gray-800">{stats.totalLikes}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-xl">
                      <Eye className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-500">总浏览</p>
                        <p className="text-xl font-bold text-gray-800">{stats.totalViews}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-xl">
                      <Calendar className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="text-xs text-gray-500">加入时间</p>
                        <p className="text-sm font-bold text-gray-800">{formatDate(stats.earliestDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 animate-fadeInUp">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                TA 的作品
              </h2>
              <p className="text-sm text-gray-500">
                共 {artworks.length} 幅作品
              </p>
            </div>
          </div>

          <ArtworkGrid artworks={artworks} loading={loading} />
        </div>
      </div>
    </div>
  );
};
