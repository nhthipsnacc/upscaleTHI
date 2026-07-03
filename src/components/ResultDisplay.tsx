import React, { useState } from 'react';

interface ResultDisplayProps {
  originalImage: string;
  upscaledImage: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImage, upscaledImage }) => {
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Comparison</h2>
      <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-gray-700 bg-gray-900 group">
        <img
          src={originalImage}
          alt="Original"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 w-full h-full object-cover overflow-hidden"
          style={{ width: `${sliderValue}%` }}
        >
          <img
            src={upscaledImage}
            alt="Upscaled"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: '100vw' }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          className="absolute inset-y-0 w-full opacity-0 cursor-ew-resize z-20"
        />
        <div
          className="absolute inset-y-0 w-1 bg-white z-10 pointer-events-none"
          style={{ left: `${sliderValue}%` }}
        />
      </div>
      <p className="text-sm text-gray-400 text-center">Drag to compare: Original vs Upscaled</p>
    </div>
  );
};
