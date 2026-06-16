import React from 'react';
import { Flame, Clock, MessageSquare } from 'lucide-react';
import type { SortType } from '../../types';

interface SortTabsProps {
  sort: SortType;
  onSortChange: (sort: SortType) => void;
}

export const SortTabs: React.FC<SortTabsProps> = ({ sort, onSortChange }) => {
  return (
    <div className="inline-flex bg-gray-100 rounded-full p-1">
      <button
        type="button"
        onClick={() => onSortChange('hot')}
        className={`
          flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all duration-300
          ${sort === 'hot'
            ? 'bg-white text-orange-500 shadow-md scale-105'
            : 'text-gray-500 hover:text-gray-700'
          }
        `}
      >
        <Flame className={`w-5 h-5 ${sort === 'hot' ? 'animate-pulse' : ''}`} />
        热门
      </button>
      <button
        type="button"
        onClick={() => onSortChange('latest')}
        className={`
          flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all duration-300
          ${sort === 'latest'
            ? 'bg-white text-blue-500 shadow-md scale-105'
            : 'text-gray-500 hover:text-gray-700'
          }
        `}
      >
        <Clock className="w-5 h-5" />
        最新
      </button>
      <button
        type="button"
        onClick={() => onSortChange('mostComments')}
        className={`
          flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all duration-300
          ${sort === 'mostComments'
            ? 'bg-white text-pink-500 shadow-md scale-105'
            : 'text-gray-500 hover:text-gray-700'
          }
        `}
      >
        <MessageSquare className="w-5 h-5" />
        最多评论
      </button>
    </div>
  );
};
