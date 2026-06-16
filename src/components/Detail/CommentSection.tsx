import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Send, User, MessageCircle } from 'lucide-react';
import { api } from '../../utils/api';
import type { Comment } from '../../types';

interface CommentSectionProps {
  artworkId: number;
  visitorName: string;
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

export const CommentSection: React.FC<CommentSectionProps> = ({ artworkId, visitorName }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState(visitorName);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const commentListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAuthor(visitorName);
  }, [visitorName]);

  useEffect(() => {
    loadComments();
  }, [artworkId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await api.getComments(artworkId);
      setComments(res.data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !author.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await api.createComment(artworkId, author.trim(), newComment.trim());
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-bold text-gray-800">评论区</h3>
        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
          {comments.length}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="你的昵称"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
              maxLength={20}
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="写下你的评论..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                maxLength={200}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || !author.trim() || submitting}
                className="px-5 py-3 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div ref={commentListRef} className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>还没有评论，快来抢沙发吧~</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div
              key={comment.id}
              className="flex gap-3 animate-slideInFromLeft"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link
                to={`/user/${encodeURIComponent(comment.author)}`}
                className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm hover:scale-110 transition-transform"
              >
                {comment.author.charAt(0)}
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    to={`/user/${encodeURIComponent(comment.author)}`}
                    className="font-semibold text-gray-800 hover:text-pink-500 transition-colors"
                  >
                    {comment.author}
                  </Link>
                  <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl rounded-tl-sm px-4 py-3 text-gray-700">
                  {comment.content}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
