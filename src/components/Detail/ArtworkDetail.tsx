import React from 'react';
import { User, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LikeButton } from './LikeButton';
import { CommentSection } from './CommentSection';
import type { Artwork } from '../../types';

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
              </div>
            </div>
            <LikeButton
              artworkId={artwork.id}
              visitorId={visitorId}
              initialLikes={artwork.likes}
            />
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
