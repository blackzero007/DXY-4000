import React, { forwardRef, useImperativeHandle } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { Toolbar } from './Toolbar';

export interface DrawingCanvasHandle {
  getImageData: () => string;
}

interface DrawingCanvasProps {
  canvasWidth?: number;
  canvasHeight?: number;
}

export const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(
  ({ canvasWidth = 800, canvasHeight = 600 }, ref) => {
    const canvas = useCanvas(canvasWidth, canvasHeight);

    useImperativeHandle(ref, () => ({
      getImageData: canvas.getImageData,
    }));

    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-5xl mx-auto">
        <div
          className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-dashed border-pink-200"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #f5f5f5 25%, transparent 25%),
              linear-gradient(-45deg, #f5f5f5 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #f5f5f5 75%),
              linear-gradient(-45deg, transparent 75%, #f5f5f5 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          }}
        >
          <canvas
            ref={canvas.canvasRef}
            onMouseDown={canvas.startDrawing}
            onMouseMove={canvas.draw}
            onMouseUp={canvas.stopDrawing}
            onMouseLeave={canvas.stopDrawing}
            onTouchStart={canvas.startDrawing}
            onTouchMove={canvas.draw}
            onTouchEnd={canvas.stopDrawing}
            className="cursor-crosshair block"
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
          {canvas.isDrawing && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-sm rounded-full animate-pulse">
              绘画中...
            </div>
          )}
        </div>

        <Toolbar
          color={canvas.color}
          onColorChange={canvas.setColor}
          brushSize={canvas.brushSize}
          onBrushSizeChange={canvas.setBrushSize}
          tool={canvas.tool}
          onToolChange={canvas.setTool}
          bgColor={canvas.bgColor}
          onBgColorChange={canvas.setBackgroundColor}
          onUndo={canvas.undo}
          onRedo={canvas.redo}
          onClear={canvas.clearCanvas}
          canUndo={canvas.canUndo}
          canRedo={canvas.canRedo}
        />
      </div>
    );
  }
);

DrawingCanvas.displayName = 'DrawingCanvas';
