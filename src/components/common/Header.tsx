import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Palette, Plus, Home, Star, MessageSquare, Bell } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { useVisitor } from '../../hooks/useVisitor';
import { api } from '../../utils/api';

const LAST_NOTIFICATION_READ_KEY = 'doodle_gallery_last_notification_read';

export const Header: React.FC = () => {
  const location = useLocation();
  const { favorites } = useFavorites();
  const { visitorId } = useVisitor();
  const [unreadCount, setUnreadCount] = useState(0);

  const getLastReadTime = useCallback((): number => {
    const stored = localStorage.getItem(LAST_NOTIFICATION_READ_KEY);
    return stored ? parseInt(stored, 10) : 0;
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    if (!visitorId) return;
    try {
      const since = getLastReadTime();
      const res = await api.getNotificationUnreadCount(visitorId, since);
      setUnreadCount(res.data.total);
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
    }
  }, [visitorId, getLastReadTime]);

  useEffect(() => {
    if (!visitorId) return;

    fetchUnreadCount();

    const intervalId = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(intervalId);
  }, [visitorId, fetchUnreadCount]);

  const handleNotificationClick = () => {
    localStorage.setItem(LAST_NOTIFICATION_READ_KEY, String(Date.now()));
    setUnreadCount(0);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">
                简笔画涂鸦画廊
              </h1>
              <p className="text-xs text-gray-500">用画笔表达你的创意 ✨</p>
            </div>
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              to="/"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
                ${location.pathname === '/'
                  ? 'bg-gradient-to-r from-pink-100 to-yellow-100 text-pink-600 shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">画廊</span>
            </Link>
            <Link
              to="/favorites"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
                ${location.pathname === '/favorites'
                  ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-600 shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <div className="relative">
                <Star className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                    {favorites.length > 99 ? '99+' : favorites.length}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">我的收藏</span>
            </Link>
            <Link
              to="/message-board"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
                ${location.pathname === '/message-board'
                  ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="hidden sm:inline">留言板</span>
            </Link>
            <button
              type="button"
              onClick={handleNotificationClick}
              className="
                flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
                text-gray-600 hover:bg-gray-100 relative
              "
              title="通知"
            >
              <div className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">通知</span>
            </button>
            <Link
              to="/create"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
                ${location.pathname === '/create'
                  ? 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white shadow-md hover:shadow-lg hover:scale-105'
                }
              `}
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">开始创作</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
