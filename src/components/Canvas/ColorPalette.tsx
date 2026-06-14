import React from 'react';
import { Check } from 'lucide-react';

const PRESET_COLORS = [
  '#2D3436',
  '#636E72',
  '#E17055',
  '#D63031',
  '#E84393',
  '#6C5CE7',
  '#0984E3',
  '#00B894',
  '#00CEC9',
  '#FDCB6E',
  '#F39C12',
  '#FF7675',
];

interface ColorPaletteProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ selectedColor, onColorChange }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {PRESET_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onColorChange(color)}
          className={`
            w-8 h-8 rounded-full transition-all duration-200
            hover:scale-110 hover:shadow-lg
            flex items-center justify-center
            ${selectedColor === color ? 'scale-110 ring-2 ring-offset-2 ring-yellow-400 shadow-lg' : ''}
          `}
          style={{ backgroundColor: color }}
        >
          {selectedColor === color && (
            <Check className="w-4 h-4" style={{ color: color === '#2D3436' || color === '#636E72' ? '#fff' : '#2D3436' }} />
          )}
        </button>
      ))}
      <div className="relative">
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-8 h-8 rounded-full cursor-pointer opacity-0 absolute inset-0"
        />
        <div
          className="w-8 h-8 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center text-xs font-bold text-gray-500"
          style={{ background: `linear-gradient(135deg, ${selectedColor} 50%, transparent 50%)` }}
        >
          +
        </div>
      </div>
    </div>
  );
};
