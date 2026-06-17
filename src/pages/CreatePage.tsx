import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Lightbulb, Maximize2 } from 'lucide-react';
import { DrawingCanvas, DrawingCanvasHandle } from '../components/Canvas/DrawingCanvas';
import { PublishModal } from '../components/common/PublishModal';
import { api } from '../utils/api';
import { useVisitor } from '../hooks/useVisitor';
import type { ArtworkTag } from '../types';

interface CanvasSize {
  name: string;
  width: number;
  height: number;
  description: string;
}

const CANVAS_SIZES: CanvasSize[] = [
  { name: '小', width: 400, height: 300, description: '400×300' },
  { name: '中', width: 800, height: 600, description: '800×600' },
  { name: '大', width: 1200, height: 900, description: '1200×900' },
];

export const CreatePage: React.FC = () => {
  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [canvasSize, setCanvasSize] = useState<CanvasSize>(CANVAS_SIZES[1]);
  const { visitorId, visitorName, updateVisitorName } = useVisitor();
  const navigate = useNavigate();

  const handlePublishClick = () => {
    if (canvasRef.current) {
      const thumb = canvasRef.current.getThumbnail(300, 225);
      setThumbnailUrl(thumb);
    }
    setShowPublishModal(true);
  };

  const handleSizeChange = (size: CanvasSize) => {
    if (size.width === canvasSize.width && size.height === canvasSize.height) return;
    if (window.confirm('切换画布尺寸将清空当前画作，确定要继续吗？')) {
      setCanvasSize(size);
    }
  };

  const handlePublish = async (title: string, author: string, tags: ArtworkTag[]) => {
    if (!canvasRef.current) return;

    setIsPublishing(true);
    try {
      const imageData = canvasRef.current.getImageData();
      updateVisitorName(author);
      
      const res = await api.createArtwork(title, author, imageData, tags, visitorId);
      setShowPublishModal(false);
      navigate(`/artwork/${res.data.id}`);
    } catch (error) {
      console.error('Failed to publish artwork:', error);
      alert('发布失败，请重试~');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 animate-fadeInDown">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600">发挥你的创意</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">
              开始你的涂鸦创作
            </span>
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            使用下方的工具在画布上自由创作，完成后点击发布按钮分享你的作品~
          </p>
        </div>

        <div className="flex justify-center mb-6 animate-fadeInUp">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 text-gray-600">
              <Maximize2 className="w-5 h-5" />
              <span className="text-sm font-medium">画布尺寸：</span>
            </div>
            <div className="flex gap-2">
              {CANVAS_SIZES.map((size) => (
                <button
                  key={size.description}
                  type="button"
                  onClick={() => handleSizeChange(size)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    canvasSize.width === size.width && canvasSize.height === size.height
                      ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-102'
                  }`}
                >
                  {size.name}
                  <span className="ml-1 text-xs opacity-80">({size.description})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <DrawingCanvas ref={canvasRef} canvasWidth={canvasSize.width} canvasHeight={canvasSize.height} />
        </div>

        <div className="flex justify-center mt-8 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <button
            type="button"
            onClick={handlePublishClick}
            className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 text-white text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Rocket className="w-6 h-6 relative z-10 group-hover:-translate-y-1 group-hover:rotate-12 transition-transform" />
            <span className="relative z-10">发布作品</span>
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          {[
            { icon: '🎨', title: '选择颜色', desc: '12种预设颜色 + 自定义取色器' },
            { icon: '✏️', title: '调节笔刷', desc: '1-50像素粗细自由调节' },
            { icon: '🧹', title: '橡皮擦', desc: '随时擦除不满意的部分' },
          ].map((tip, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-3">{tip.icon}</div>
              <h3 className="font-bold text-gray-800 mb-1">{tip.title}</h3>
              <p className="text-sm text-gray-500">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublish={handlePublish}
        defaultAuthor={visitorName}
        isPublishing={isPublishing}
        thumbnailUrl={thumbnailUrl}
      />
    </div>
  );
};
