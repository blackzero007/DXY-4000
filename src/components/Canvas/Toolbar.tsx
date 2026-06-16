import React from 'react';
import { Pencil, Eraser, Undo2, Redo2, Trash2, Check } from 'lucide-react';
import { ColorPalette } from './ColorPalette';
import type { ToolType } from '../../types';

const BG_COLORS = [
  { color: '#FFFFFF', label: '白色' },
  { color: '#F5F5DC', label: '米色' },
  { color: '#808080', label: '灰色' },
  { color: '#000000', label: '黑色' },
];

interface ToolbarProps {
  color: string;
  onColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  tool: ToolType;
  onToolChange: (tool: ToolType) => void;
  bgColor: string;
  onBgColorChange: (color: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  color,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  tool,
  onToolChange,
  bgColor,
  onBgColorChange,
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="bg-gradient-to-r from-pink-100 via-yellow-100 to-blue-100 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">颜色</span>
          <ColorPalette selectedColor={color} onColorChange={onColorChange} />
        </div>

        <div className="h-8 w-px bg-gray-300" />

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">背景</span>
          <div className="flex items-center gap-2">
            {BG_COLORS.map(({ color: bg, label }) => (
              <button
                key={bg}
                type="button"
                onClick={() => onBgColorChange(bg)}
                title={label}
                className={`
                  w-8 h-8 rounded-lg transition-all duration-200
                  hover:scale-110 hover:shadow-lg
                  flex items-center justify-center
                  ${bgColor === bg ? 'scale-110 ring-2 ring-offset-2 ring-yellow-400 shadow-lg' : ''}
                `}
                style={{ backgroundColor: bg, border: bg === '#FFFFFF' ? '1px solid #e5e7eb' : 'none' }}
              >
                {bgColor === bg && (
                  <Check
                    className="w-4 h-4"
                    style={{ color: bg === '#000000' || bg === '#808080' ? '#fff' : '#2D3436' }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="h-8 w-px bg-gray-300" />

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">笔刷</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => onBrushSizeChange(Number(e.target.value))}
              className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <span className="text-sm font-bold text-gray-700 w-8 text-center">{brushSize}</span>
            <div
              className="rounded-full bg-gray-800"
              style={{ width: brushSize, height: brushSize }}
            />
          </div>
        </div>

        <div className="h-8 w-px bg-gray-300" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToolChange('pen')}
            className={`
              p-3 rounded-xl transition-all duration-200 flex items-center gap-2
              ${tool === 'pen'
                ? 'bg-pink-500 text-white shadow-lg scale-105'
                : 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-md'
              }
            `}
          >
            <Pencil className="w-5 h-5" />
            <span className="text-sm font-medium">画笔</span>
          </button>
          <button
            type="button"
            onClick={() => onToolChange('eraser')}
            className={`
              p-3 rounded-xl transition-all duration-200 flex items-center gap-2
              ${tool === 'eraser'
                ? 'bg-pink-500 text-white shadow-lg scale-105'
                : 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-md'
              }
            `}
          >
            <Eraser className="w-5 h-5" />
            <span className="text-sm font-medium">橡皮</span>
          </button>
        </div>

        <div className="h-8 w-px bg-gray-300" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`
              p-3 rounded-xl transition-all duration-200 flex items-center gap-2
              ${canUndo
                ? 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
            title="撤销 (Ctrl+Z)"
          >
            <Undo2 className="w-5 h-5" />
            <span className="text-sm font-medium">撤销</span>
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className={`
              p-3 rounded-xl transition-all duration-200 flex items-center gap-2
              ${canRedo
                ? 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
            title="重做 (Ctrl+Y)"
          >
            <Redo2 className="w-5 h-5" />
            <span className="text-sm font-medium">重做</span>
          </button>
          <button
            type="button"
            onClick={onClear}
            className="p-3 rounded-xl bg-white/70 text-red-500 hover:bg-red-100 hover:shadow-md transition-all duration-200 flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-sm font-medium">清空</span>
          </button>
        </div>
      </div>
    </div>
  );
};
