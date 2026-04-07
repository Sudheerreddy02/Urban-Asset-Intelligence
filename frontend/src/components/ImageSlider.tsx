"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronsLeftRight } from "lucide-react";

interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
}

export default function ImageSlider({ beforeImage, afterImage }: ImageSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <div 
      className="relative w-full h-full cursor-ew-resize select-none overflow-hidden"
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchMove={handleTouchMove}
    >
      <img
        src={afterImage}
        alt="AI Segmentation Mask"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      <div 
        className="absolute inset-0 overflow-hidden" 
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Raw Imagery"
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: containerRef.current?.offsetWidth || '100vw' }}
          draggable={false}
        />
      </div>
      <div 
        className="absolute top-0 bottom-0 w-1 bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="absolute top-1/2 -mt-4 -ml-4 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <ChevronsLeftRight className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="absolute top-4 left-4 glass-card px-3 py-1 rounded shadow text-sm font-semibold text-white">Raw</div>
      <div className="absolute top-4 right-4 glass-card px-3 py-1 rounded shadow text-sm font-semibold text-white">Analyzed</div>
    </div>
  );
}
