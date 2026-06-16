import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ArtworkDetail } from '../components/Detail/ArtworkDetail';
import { api } from '../utils/api';
import { useVisitor } from '../hooks/useVisitor';
import type { Artwork } from '../types';
import { Palette, AlertCircle } from 'lucide-react';

export const ArtworkDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { visitorId, visitorName } = useVisitor();
  const viewedRef = useRef<number | null>(null);

  useEffect(() => {
    if (id) {
      loadArtwork(parseInt(id));
    }
  }, [id]);

  const loadArtwork = async (artworkId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getArtworkById(artworkId);
      const artworkData = res.data;

      if (viewedRef.current !== artworkId) {
        viewedRef.current = artworkId;
        try {
          const viewRes = await api.incrementViews(artworkId);
          artworkData.views = viewRes.data.views;
        } catch {
          // 浏览量记录失败不影响主流程
        }
      }

      setArtwork(artworkData);
    } catch (err) {
      setError('作品不存在或已被删除');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-32" />
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-pink-100 to-blue-100" />
              <div className="p-8 space-y-6">
                <div className="aspect-video bg-gray-100 rounded-2xl" />
                <div className="h-64 bg-gray-50 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center animate-fadeIn">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-yellow-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-pink-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{error || '作品不存在'}</h2>
          <p className="text-gray-500 mb-6">这个作品可能已经被删除了</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
          >
            <Palette className="w-5 h-5" />
            返回画廊
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50 py-8 px-4">
      <ArtworkDetail artwork={artwork} visitorId={visitorId} visitorName={visitorName} />
    </div>
  );
};
