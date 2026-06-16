import React, { useState } from 'react';
import { X, Send, Sparkles, Tag } from 'lucide-react';
import type { ArtworkTag } from '../../types';

const ARTWORK_TAGS: ArtworkTag[] = ['风景', '人物', '动物', '抽象', '其他'];

const TAG_COLORS: Record<ArtworkTag, string> = {
  '风景': 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200',
  '人物': 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200',
  '动物': 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200',
  '抽象': 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200',
  '其他': 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200',
};

const TAG_SELECTED_COLORS: Record<ArtworkTag, string> = {
  '风景': 'bg-green-500 text-white border-green-500',
  '人物': 'bg-blue-500 text-white border-blue-500',
  '动物': 'bg-orange-500 text-white border-orange-500',
  '抽象': 'bg-purple-500 text-white border-purple-500',
  '其他': 'bg-gray-500 text-white border-gray-500',
};

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (title: string, author: string, tags: ArtworkTag[]) => void;
  defaultAuthor: string;
  isPublishing: boolean;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  defaultAuthor,
  isPublishing,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(defaultAuthor);
  const [selectedTags, setSelectedTags] = useState<ArtworkTag[]>([]);

  if (!isOpen) return null;

  const handleTagToggle = (tag: ArtworkTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && author.trim()) {
      onPublish(title.trim(), author.trim(), selectedTags);
      setTitle('');
      setSelectedTags([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
        <div className="bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">发布作品</h2>
              <p className="text-white/80 text-sm">为你的创作起个名字吧~</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              作品名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给你的作品起个好听的名字"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all text-gray-800"
              maxLength={50}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              你的昵称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="输入你的昵称"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none transition-all text-gray-800"
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline-block mr-1 -mt-0.5" />
              作品标签 <span className="text-gray-400 font-normal">（可选，可多选）</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {ARTWORK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1.5 rounded-full border-2 text-sm font-medium transition-all duration-200 ${
                    selectedTags.includes(tag)
                      ? TAG_SELECTED_COLORS[tag]
                      : TAG_COLORS[tag]
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              disabled={isPublishing}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !author.trim() || isPublishing}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPublishing ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <Send className="w-5 h-5" />
              )}
              {isPublishing ? '发布中...' : '发布作品'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
