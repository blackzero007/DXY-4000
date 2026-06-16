import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, User, Calendar, Eye } from 'lucide-react';
import type { Artwork, ArtworkTag } from '../../types';

const TAG_COLORS: Record<ArtworkTag, string> = {
  '风景': 'bg-green-100 text-green-700',
  '人物': 'bg-blue-100 text-blue-700',
  '动物': 'bg-orange-100 text-orange-700',
  '抽象': 'bg-purple-100 text-purple-700',
  '其他': 'bg-gray-100 text-gray-700',
};

interface ArtworkCardProps {
  artwork: Artwork;
  index: number;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString('zh-CN');
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, index }) => {
  return (
    <Link
      to={`/artwork/${artwork.id}`}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fadeInUp"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={artwork.imageData}
          alt={artwork.title}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 right-3 flex items-center gap-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-md">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-bold text-gray-700">{artwork.views || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span className="text-sm font-bold text-gray-700">{artwork.likes}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg mb-2 truncate group-hover:text-pink-500 transition-colors">
          {artwork.title}
        </h3>
        {artwork.tags && artwork.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {artwork.tags.map((tag) => (
              <span
                key={tag}
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${TAG_COLORS[tag]}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span className="truncate max-w-20">{artwork.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(artwork.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
