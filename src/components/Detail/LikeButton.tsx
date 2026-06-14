import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { api } from '../../utils/api';

interface LikeButtonProps {
  artworkId: number;
  visitorId: string;
  initialLikes: number;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ artworkId, visitorId, initialLikes }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    if (visitorId) {
      api.checkLikeStatus(artworkId, visitorId).then((res) => {
        setLiked(res.data.liked);
      }).catch(() => {});
    }
  }, [artworkId, visitorId]);

  const handleLike = async () => {
    if (!visitorId || isAnimating) return;

    setIsAnimating(true);
    
    if (!liked) {
      const newParticles = Array.from({ length: 8 }, (_, i) => i);
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 600);
    }

    try {
      const res = await api.toggleLike(artworkId, visitorId);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleLike}
        disabled={isAnimating}
        className={`
          relative flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-lg
          transition-all duration-300 transform
          ${liked
            ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg'
            : 'bg-white border-2 border-pink-200 text-pink-500 hover:border-pink-400 hover:shadow-md'
          }
          ${isAnimating ? 'scale-110' : 'hover:scale-105'}
        `}
      >
        <Heart
          className={`w-6 h-6 transition-all duration-300 ${liked ? 'fill-white scale-110' : ''}`}
        />
        <span className="min-w-[2ch]">{likes}</span>
        
        {particles.map((_, i) => (
          <span
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              animation: `particleBurst 0.6s ease-out forwards`,
              animationDelay: `${i * 0.05}s`,
              transform: `rotate(${i * 45}deg)`,
            }}
          >
            <span
              className="block w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#FF6B6B', '#FFD93D', '#4ECDC4', '#D6A2E8'][i % 4],
              }}
            />
          </span>
        ))}
      </button>
    </div>
  );
};
