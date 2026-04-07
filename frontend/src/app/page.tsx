"use client";

import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import KPICard from "@/components/analytics/KPICard";
import LandUseChart from "@/components/analytics/LandUseChart";
import ImageSlider from "@/components/ImageSlider";
import { Activity, Layers, Map, Droplet } from "lucide-react";

export default function Home() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setAnalyzing(true);
    setUploadedImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Step 1: Upload
      const uploadRes = await fetch("http://localhost:8000/api/v1/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      
      // Step 2: Analyze
      const analyzeRes = await fetch("http://localhost:8000/api/v1/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_path: uploadData.temp_path })
      });
      
      const analyzeData = await analyzeRes.json();
      setResults(analyzeData);
      
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto flex flex-col gap-8">
      <header className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Urban Asset <span className="text-sky-400">Intelligence</span></h1>
          <p className="text-slate-400 text-lg">AI-powered Geospatial Analytics Command Center</p>
        </div>
        <div className="h-12 w-12 rounded-full glass-card flex items-center justify-center neon-border">
          <Activity className="text-sky-400" />
        </div>
      </header>

      {!results && !analyzing && (
        <section className="w-full flex justify-center py-12 animate-in fade-in zoom-in duration-500">
          <UploadZone onUpload={handleUpload} />
        </section>
      )}

      {analyzing && (
        <section className="w-full py-24 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 rounded-full border-t-2 border-sky-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-r-2 border-indigo-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-4 rounded-full border-b-2 border-emerald-400 animate-spin" style={{ animationDuration: '2s' }}></div>
            <Activity className="absolute inset-0 m-auto text-sky-400 w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-500 animate-pulse">Running YOLOv8 Segmentation...</h2>
          <p className="text-slate-400 mt-2">Processing large-scale tiles</p>
        </section>
      )}

      {results && uploadedImage && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden p-1 neon-border">
            <div className="h-[600px] w-full relative bg-slate-900 rounded-xl overflow-hidden">
               <ImageSlider beforeImage={uploadedImage} afterImage={results.image_base64} />
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-bold border-b border-slate-700 pb-2">Spatial Analytics</h3>
            <div className="grid grid-cols-2 gap-4">
               <KPICard title="Buildings" value={`${results.analytics.Buildings} m²`} icon={<Layers />} color="text-indigo-400" />
               <KPICard title="Vegetation" value={`${results.analytics.Vegetation} m²`} icon={<Map />} color="text-emerald-400" />
               <KPICard title="Roads" value={`${results.analytics.Roads} m²`} icon={<Activity />} color="text-amber-400" />
               <KPICard title="Water" value={`${results.analytics.Water} m²`} icon={<Droplet />} color="text-blue-400" />
            </div>
            <div className="glass-card rounded-2xl p-4 mt-auto">
                <LandUseChart data={results.analytics} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
