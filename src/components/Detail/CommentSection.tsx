import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Send, User, MessageCircle, CornerDownRight, Smile } from 'lucide-react';
import { api } from '../../utils/api';
import type { Comment } from '../../types';

const DEFAULT_EMOJIS = ['👍', '❤️', '😂', '🎨', '✨', '🔥', '💯'];

function insertEmojiAtCursor(
  inputRef: React.RefObject<HTMLInputElement>,
  emoji: string,
  setValue: React.Dispatch<React.SetStateAction<string>>
) {
  const input = inputRef.current;
  if (!input) {
    setValue((prev) => prev + emoji);
    return;
  }

  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  const newValue = input.value.slice(0, start) + emoji + input.value.slice(end);

  setValue(newValue);

  requestAnimationFrame(() => {
    input.focus();
    const newPos = start + emoji.length;
    input.setSelectionRange(newPos, newPos);
  });
}

interface CommentSectionProps {
  artworkId: number;
  visitorName: string;
}

interface CommentNode extends Comment {
  replies: CommentNode[];
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

function buildCommentTree(comments: Comment[]): CommentNode[] {
  const nodeMap = new Map<number, CommentNode>();
  const roots: CommentNode[] = [];

  comments.forEach((comment) => {
    nodeMap.set(comment.id, { ...comment, replies: [] });
  });

  comments.forEach((comment) => {
    const node = nodeMap.get(comment.id)!;
    if (comment.parentId && nodeMap.has(comment.parentId)) {
      nodeMap.get(comment.parentId)!.replies.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortReplies = (nodes: CommentNode[]): CommentNode[] => {
    nodes.sort((a, b) => a.createdAt - b.createdAt);
    nodes.forEach((node) => sortReplies(node.replies));
    return nodes;
  };

  roots.sort((a, b) => b.createdAt - a.createdAt);
  roots.forEach((root) => sortReplies(root.replies));

  return roots;
}

interface CommentItemProps {
  comment: CommentNode;
  visitorName: string;
  artworkId: number;
  onReplyAdded: (newComment: Comment) => void;
  submittingReply: number | null;
  setSubmittingReply: (id: number | null) => void;
  depth?: number;
  index?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  visitorName,
  artworkId,
  onReplyAdded,
  submittingReply,
  setSubmittingReply,
  depth = 0,
  index = 0,
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthor, setReplyAuthor] = useState(visitorName);
  const [showReplyEmojiPicker, setShowReplyEmojiPicker] = useState(false);
  const replyInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setReplyAuthor(visitorName);
  }, [visitorName]);

  useEffect(() => {
    if (showReplyBox && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [showReplyBox]);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !replyAuthor.trim() || submittingReply === comment.id) return;

    setSubmittingReply(comment.id);
    try {
      const res = await api.createComment(
        artworkId,
        replyAuthor.trim(),
        replyContent.trim(),
        comment.id,
        comment.author
      );
      onReplyAdded(res.data);
      setReplyContent('');
      setShowReplyBox(false);
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setSubmittingReply(null);
    }
  };

  const isSubmitting = submittingReply === comment.id;

  return (
    <div
      className="animate-slideInFromLeft"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`flex gap-3 ${depth > 0 ? 'ml-10 pl-4 border-l-2 border-pink-100' : ''}`}>
        <Link
          to={`/user/${encodeURIComponent(comment.author)}`}
          className={`flex-shrink-0 ${depth === 0 ? 'w-10 h-10' : 'w-8 h-8'} bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm hover:scale-110 transition-transform`}
        >
          {comment.author.charAt(0)}
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Link
              to={`/user/${encodeURIComponent(comment.author)}`}
              className="font-semibold text-gray-800 hover:text-pink-500 transition-colors"
            >
              {comment.author}
            </Link>
            {comment.replyTo && (
              <span className="flex items-center text-xs text-gray-400">
                <CornerDownRight className="w-3 h-3 mx-1" />
                回复
                <Link
                  to={`/user/${encodeURIComponent(comment.replyTo)}`}
                  className="ml-1 text-pink-500 hover:underline"
                >
                  @{comment.replyTo}
                </Link>
              </span>
            )}
            <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
          </div>
          <div
            className={`${
              depth === 0
                ? 'bg-gradient-to-r from-blue-50 to-purple-50'
                : 'bg-gray-50'
            } rounded-2xl rounded-tl-sm px-4 py-3 text-gray-700 break-words`}
          >
            {comment.content}
          </div>
          <button
            onClick={() => setShowReplyBox(!showReplyBox)}
            className="mt-2 text-xs text-gray-400 hover:text-pink-500 transition-colors flex items-center gap-1"
          >
            <CornerDownRight className="w-3 h-3" />
            回复
          </button>

          {showReplyBox && (
            <form onSubmit={handleSubmitReply} className="mt-3 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyAuthor}
                  onChange={(e) => setReplyAuthor(e.target.value)}
                  placeholder="你的昵称"
                  className="w-28 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                  maxLength={20}
                />
                <div className="flex-1 flex gap-2 items-center">
                  <div className="flex-1 relative">
                    <input
                      ref={replyInputRef}
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`回复 @${comment.author}...`}
                      className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                      maxLength={200}
                    />
                    <button
                      type="button"
                      onClick={() => setShowReplyEmojiPicker(!showReplyEmojiPicker)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-pink-500 transition-colors"
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                    {showReplyEmojiPicker && (
                      <div className="absolute left-0 bottom-full mb-2 flex gap-1 p-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                        {DEFAULT_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              insertEmojiAtCursor(replyInputRef, emoji, setReplyContent);
                            }}
                            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-pink-50 rounded-lg transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={!replyContent.trim() || !replyAuthor.trim() || isSubmitting}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    {isSubmitting ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReplyBox(false);
                      setReplyContent('');
                    }}
                    className="px-3 py-2 text-gray-400 hover:text-gray-600 text-sm transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply, replyIndex) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              visitorName={visitorName}
              artworkId={artworkId}
              onReplyAdded={onReplyAdded}
              submittingReply={submittingReply}
              setSubmittingReply={setSubmittingReply}
              depth={depth + 1}
              index={replyIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CommentSection: React.FC<CommentSectionProps> = ({ artworkId, visitorName }) => {
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState(visitorName);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittingReply, setSubmittingReply] = useState<number | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const commentListRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

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
      setAllComments(res.data);
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
      setAllComments([res.data, ...allComments]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplyAdded = (newReply: Comment) => {
    setAllComments([...allComments, newReply]);
  };

  const commentTree = buildCommentTree(allComments);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-bold text-gray-800">评论区</h3>
        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
          {allComments.length}
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
            <div className="flex gap-2 items-center">
              <div className="flex-1 relative">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="写下你的评论..."
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                  maxLength={200}
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <Smile className="w-5 h-5" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute left-0 bottom-full mb-2 flex gap-1 p-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                    {DEFAULT_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          insertEmojiAtCursor(commentInputRef, emoji, setNewComment);
                        }}
                        className="w-9 h-9 flex items-center justify-center text-xl hover:bg-pink-50 rounded-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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

      <div ref={commentListRef} className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
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
        ) : allComments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>还没有评论，快来抢沙发吧~</p>
          </div>
        ) : (
          commentTree.map((comment, index) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              visitorName={visitorName}
              artworkId={artworkId}
              onReplyAdded={handleReplyAdded}
              submittingReply={submittingReply}
              setSubmittingReply={setSubmittingReply}
              depth={0}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
};
