"use client";

import { useState, useCallback } from "react";
import { UploadCloud } from "lucide-react";

interface UploadZoneProps {
  onUpload: (file: File) => void;
}

export default function UploadZone({ onUpload }: UploadZoneProps) {
  const [isHover, setIsHover] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsHover(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files[0]);
    }
  }, [onUpload]);

  return (
    <div 
      className={`relative w-full max-w-2xl h-80 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer glass-card
        ${isHover ? 'border-sky-400 bg-sky-900/20 shadow-[0_0_30px_rgba(56,189,248,0.2)]' : 'border-slate-600 hover:border-slate-500'}
      `}
      onDragOver={(e) => { e.preventDefault(); setIsHover(true); }}
      onDragLeave={() => setIsHover(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input 
        id="file-upload" 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={(e) => e.target.files && onUpload(e.target.files[0])} 
      />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-sky-500/5 rounded-3xl pointer-events-none" />
      
      <div className={`p-6 rounded-full bg-slate-800/80 mb-6 border border-slate-700 transition-transform duration-500 ${isHover ? 'scale-110 border-sky-400/50' : ''}`}>
         <UploadCloud className={`w-12 h-12 ${isHover ? 'text-sky-400' : 'text-slate-400'}`} />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-2">Initialize Satellite Scan</h3>
      <p className="text-slate-400 text-center max-w-md">
        Drag & drop high-resolution aerial imagery here, or click to select files.
      </p>
    </div>
  );
}
