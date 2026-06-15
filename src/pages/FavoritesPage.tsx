import React, { useMemo } from 'react';
import { Star, Trash2, Sparkles, Search, X } from 'lucide-react';
import { ArtworkCard } from '../components/Gallery/ArtworkCard';
import { useFavorites } from '../hooks/useFavorites';
import { Link } from 'react-router-dom';

export const FavoritesPage: React.FC = () => {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const [searchKeyword, setSearchKeyword] = React.useState('');

  const filteredFavorites = useMemo(() => {
    if (!searchKeyword.trim()) return favorites;
    const keyword = searchKeyword.toLowerCase();
    return favorites.filter(artwork =>
      artwork.title.toLowerCase().includes(keyword)
    );
  }, [favorites, searchKeyword]);

  const handleClearAll = () => {
    if (window.confirm('确定要清空所有收藏吗？')) {
      clearFavorites();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-orange-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12 animate-fadeInDown">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md mb-6">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium text-gray-600">我的收藏夹</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                我的收藏
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              珍藏你喜欢的作品，随时回味那些触动你的创意 ✨
            </p>
          </div>

          {favorites.length > 0 && (
            <>
              <div className="max-w-2xl mx-auto mb-8 animate-fadeInUp">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="搜索收藏的作品..."
                    className="w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm border-2 border-transparent rounded-2xl shadow-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-yellow-300 focus:bg-white transition-all duration-300 hover:shadow-xl"
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

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <Star className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {searchKeyword ? '搜索结果' : '收藏的作品'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {searchKeyword
                        ? `找到 ${filteredFavorites.length} 幅相关作品`
                        : `共收藏 ${favorites.length} 幅作品`
                      }
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-red-200 text-red-500 rounded-xl font-medium hover:bg-red-50 hover:border-red-300 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  清空收藏
                </button>
              </div>
            </>
          )}

          {favorites.length === 0 ? (
            <div className="text-center py-20 animate-fadeIn">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
                <Star className="w-12 h-12 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">还没有收藏的作品</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                浏览画廊，点击作品详情页的收藏按钮，把喜欢的作品收藏起来吧！
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                去发现作品
              </Link>
            </div>
          ) : filteredFavorites.length === 0 ? (
            <div className="text-center py-20 animate-fadeIn">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">没有找到相关作品</h3>
              <p className="text-gray-500">
                试试其他关键词，或者
                <button
                  type="button"
                  onClick={() => setSearchKeyword('')}
                  className="text-yellow-500 hover:text-yellow-600 font-medium ml-1"
                >
                  查看全部收藏
                </button>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFavorites.map((artwork, index) => (
                <div key={artwork.id} className="relative group">
                  <ArtworkCard artwork={artwork} index={index} />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFavorite(artwork.id);
                    }}
                    className="absolute top-3 right-3 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="取消收藏"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
