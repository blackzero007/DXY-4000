import React from 'react';
import { User, Calendar, ArrowLeft, Share2, Eye, Tag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { LikeButton } from './LikeButton';
import { FavoriteButton } from './FavoriteButton';
import { CommentSection } from './CommentSection';
import { useToast } from '../common/Toast';
import type { Artwork, ArtworkTag } from '../../types';

const TAG_COLORS: Record<ArtworkTag, string> = {
  '风景': 'bg-green-100 text-green-700 border-green-200',
  '人物': 'bg-blue-100 text-blue-700 border-blue-200',
  '动物': 'bg-orange-100 text-orange-700 border-orange-200',
  '抽象': 'bg-purple-100 text-purple-700 border-purple-200',
  '其他': 'bg-gray-100 text-gray-700 border-gray-200',
};

interface ArtworkDetailProps {
  artwork: Artwork;
  visitorId: string;
  visitorName: string;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ artwork, visitorId, visitorName }) => {
  const location = useLocation();
  const { showToast } = useToast();

  const handleShare = async () => {
    const url = window.location.origin + location.pathname;
    try {
      await navigator.clipboard.writeText(url);
      showToast('链接已复制', 'success');
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        showToast('链接已复制', 'success');
      } catch {
        showToast('复制失败，请手动复制链接', 'error');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        返回画廊
      </Link>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-pink-100 via-yellow-100 to-blue-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {artwork.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{artwork.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(artwork.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-blue-600">{artwork.views || 0}</span>
                  <span className="text-gray-400">次浏览</span>
                </div>
              </div>
              {artwork.tags && artwork.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <div className="flex flex-wrap gap-1.5">
                    {artwork.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${TAG_COLORS[tag]}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <LikeButton
                artworkId={artwork.id}
                visitorId={visitorId}
                initialLikes={artwork.likes}
              />
              <FavoriteButton artwork={artwork} />
              <button
                type="button"
                onClick={handleShare}
                className="
                  flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-lg
                  transition-all duration-300 transform hover:scale-105
                  bg-white border-2 border-blue-200 text-blue-500 hover:border-blue-400 hover:shadow-md
                "
              >
                <Share2 className="w-6 h-6" />
                <span>分享</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 md:p-8 mb-8 border-2 border-dashed border-pink-100">
            <img
              src={artwork.imageData}
              alt={artwork.title}
              className="max-w-full h-auto mx-auto max-h-[600px] object-contain rounded-xl shadow-lg animate-fadeInUp"
            />
          </div>

          <CommentSection artworkId={artwork.id} visitorName={visitorName} />
        </div>
      </div>
    </div>
  );
};
