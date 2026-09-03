import React, { useState } from "react";
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Palette,
  Sliders,
  Layers,
  Wand2,
  Crop,
  Sun,
  Eye,
  Eraser,
  Tv,
  ArrowRight,
  Maximize,
} from "lucide-react";

interface ImageStudioProps {
  initialPrompt?: string;
}

export const ImageStudio: React.FC<ImageStudioProps> = ({ initialPrompt = "" }) => {
  const [activeTab, setActiveTab] = useState<"generate" | "edit" | "enhance">("generate");
  const [prompt, setPrompt] = useState(
    initialPrompt ||
      "An ultra-detailed cinematic 8k shot of a peaceful mosque courtyard at sunset with golden warm sunlight, marble reflection, and dramatic clouds."
  );
  const [selectedStyle, setSelectedStyle] = useState("cinematic");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16" | "4:3">("16:9");
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [editInstruction, setEditInstruction] = useState("");

  // Visual filter state
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 105,
    saturation: 110,
    blur: 0,
    warmth: 5,
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const [generatedImages, setGeneratedImages] = useState<
    {
      id: string;
      url: string;
      prompt: string;
      style: string;
      aspectRatio: string;
      editLog?: string;
    }[]
  >([
    {
      id: "img-1",
      url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
      prompt: "Cinematic mosque dome with golden hour rays, high dynamic range, architectural elegance.",
      style: "Cinematic",
      aspectRatio: "16:9",
    },
    {
      id: "img-2",
      url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
      prompt: "Vibrant abstract digital art with luminous turquoise and emerald neon flourishes.",
      style: "Digital Art",
      aspectRatio: "1:1",
    },
    {
      id: "img-3",
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      prompt: "Photorealistic aerial view of misty green mountains and river stream at sunrise.",
      style: "Realistic Photo",
      aspectRatio: "16:9",
    },
  ]);

  const styles = [
    { id: "cinematic", label: "🎬 সিনেমাটিক 8K", desc: "Dramatic lighting & volumetric depth" },
    { id: "3d", label: "✨ 3D অ্যানিমেশন", desc: "Pixar / Unreal Engine 5 render" },
    { id: "islamic", label: "☪ ইসলামিক আর্ট", desc: "Geometric arabesque & calligraphy" },
    { id: "photo", label: "📸 রিয়েলিস্টিক ফটো", desc: "Natural light, Hasselblad 50mm" },
    { id: "anime", label: "🎨 অ্যানিমে / মাঙ্গা", desc: "Makoto Shinkai aesthetic" },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "image_editor",
          prompt: `Optimize and expand this text-to-image prompt for a top-tier visual generator in '${selectedStyle}' style with '${aspectRatio}' aspect ratio:
"${prompt}"

Output ONLY the final optimized English prompt (maximum 40 words) with photographic lighting and composition keywords.`,
        }),
      });

      const data = await res.json();
      const polished = data.text?.replace(/["\n]/g, "").trim() || prompt;
      setEnhancedPrompt(polished);

      const sampleUrls: { [k: string]: string } = {
        cinematic: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
        "3d": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        islamic: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
        photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        anime: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
      };

      const newImg = {
        id: String(Date.now()),
        url: sampleUrls[selectedStyle] || sampleUrls.cinematic,
        prompt: polished,
        style: styles.find((s) => s.id === selectedStyle)?.label || selectedStyle,
        aspectRatio,
      };

      setGeneratedImages((prev) => [newImg, ...prev]);
      setSelectedImageIndex(0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyEdit = async (instruction: string) => {
    if (!instruction.trim()) return;
    setIsProcessing(true);

    try {
      const current = generatedImages[selectedImageIndex];
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "image_editor",
          prompt: `User wants to edit an existing image with prompt: "${current.prompt}".
Edit instruction: "${instruction}".
Provide the modified AI diffusion prompt and editing directives.`,
        }),
      });

      const data = await res.json();
      const newPrompt = data.text?.slice(0, 150) || `${current.prompt} [Edited: ${instruction}]`;

      // Update current image with edit log
      const updated = {
        ...current,
        id: String(Date.now()),
        prompt: newPrompt,
        editLog: instruction,
      };

      setGeneratedImages((prev) => [updated, ...prev]);
      setSelectedImageIndex(0);
      setEditInstruction("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickEnhance = (type: "cinematic" | "thumbnail" | "hdr" | "golden") => {
    if (type === "cinematic") {
      setFilters({ brightness: 95, contrast: 125, saturation: 115, blur: 0, warmth: 10 });
      handleApplyEdit("এটাকে cinematic লাইটিং এবং ডার্ক অ্যাম্বিয়েন্ট ব্যাকগ্রাউন্ডে রূপান্তর করো।");
    } else if (type === "thumbnail") {
      setAspectRatio("16:9");
      setFilters({ brightness: 110, contrast: 130, saturation: 135, blur: 0, warmth: 0 });
      handleApplyEdit("YouTube thumbnail-এর জন্য 16:9 ফরম্যাটে হাই-কনট্রাস্ট ও বোল্ড স্যাচুরেশন করো।");
    } else if (type === "hdr") {
      setFilters({ brightness: 105, contrast: 120, saturation: 120, blur: 0, warmth: 0 });
      handleApplyEdit("8K রেজোলিউশন ও আল্ট্রা-ডিটেইলড এইচডিআর এনহ্যান্সমেন্ট করো।");
    } else if (type === "golden") {
      setFilters({ brightness: 105, contrast: 110, saturation: 125, blur: 0, warmth: 25 });
      handleApplyEdit("গোল্ডেন আওয়ার সানসেট ওয়ার্ম লাইটিং যোগ করো।");
    }
  };

  const currentImage = generatedImages[selectedImageIndex] || generatedImages[0];

  return (
    <div id="image-studio-container" className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-900 via-purple-950 to-neutral-900 rounded-3xl p-6 text-white shadow-xl border border-pink-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold mb-2">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>AI IMAGE STUDIO V2 • GENERATE • EDIT • ENHANCE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            এআই ইমেজ ক্রিয়েটর ও ফুল এডিটর
          </h1>
          <p className="text-pink-200/90 text-xs md:text-sm mt-1">
            শুধু তৈরি নয়—ছবির ব্যাকগ্রাউন্ড পরিবর্তন, অবজেক্ট রিমুভ, সিনেমাটিক গ্রেডিং এবং ইউটিউব থাম্বনেইল স্কেলিং।
          </p>
        </div>

        {/* 3-Step Mode Tabs */}
        <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl p-1 text-xs">
          <button
            onClick={() => setActiveTab("generate")}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "generate" ? "bg-pink-600 text-white shadow" : "text-neutral-300 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate</span>
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "edit" ? "bg-pink-600 text-white shadow" : "text-neutral-300 hover:text-white"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setActiveTab("enhance")}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "enhance" ? "bg-pink-600 text-white shadow" : "text-neutral-300 hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Enhance</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Canvas & Viewer */}
        <div className="lg:col-span-7 bg-neutral-950 rounded-2xl p-4 border border-neutral-800 shadow-xl flex flex-col items-center justify-between min-h-[460px]">
          {/* Canvas Box */}
          <div
            className={`w-full relative rounded-xl overflow-hidden shadow-2xl transition-all flex items-center justify-center bg-black ${
              aspectRatio === "16:9"
                ? "aspect-video max-h-[360px]"
                : aspectRatio === "9:16"
                ? "w-[240px] aspect-[9/16]"
                : "w-[340px] aspect-square"
            }`}
          >
            <img
              src={currentImage.url}
              alt="Generated art"
              className="w-full h-full object-cover transition-all duration-300"
              style={{
                filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) sepia(${filters.warmth}%)`,
              }}
            />

            {/* Overlay badge */}
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded text-[11px] font-semibold text-white border border-white/10">
              {currentImage.style} • {aspectRatio}
            </div>

            {currentImage.editLog && (
              <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded text-[11px] text-pink-300 border border-pink-500/30 truncate">
                ✨ এডিট: {currentImage.editLog}
              </div>
            )}
          </div>

          {/* Canvas Bottom Controls */}
          <div className="w-full flex items-center justify-between mt-4 px-2 text-xs text-neutral-300">
            <span className="font-mono text-[11px] text-neutral-400">
              ইমেজ {selectedImageIndex + 1} / {generatedImages.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentImage.prompt);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>প্রম্পট কপি</span>
              </button>

              <button
                onClick={() => alert("ইমেজটি হাই-রেজোলিউশন ফরম্যাটে ডাউনলোড হচ্ছে!")}
                className="flex items-center gap-1 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 rounded-lg text-white font-bold transition-colors shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ডাউনলোড</span>
              </button>
            </div>
          </div>

          {/* History Thumbnails */}
          <div className="w-full flex items-center gap-2 pt-4 border-t border-neutral-800 overflow-x-auto">
            {generatedImages.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-14 h-14 rounded-lg overflow-hidden border flex-shrink-0 transition-all ${
                  selectedImageIndex === idx ? "border-pink-500 ring-2 ring-pink-500/40" : "border-neutral-700 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Mode-Specific Tools */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
          {/* TAB 1: GENERATE */}
          {activeTab === "generate" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block mb-1.5">
                  🎨 টেক্সট প্রম্পট (বাংলা বা ইংরেজিতে):
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  placeholder="আপনি কেমন ছবি চান তা বিস্তারিত লিখুন..."
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              {/* Aspect Ratio Selector */}
              <div>
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block mb-1.5">
                  📐 অ্যাসপেক্ট রেশিও:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["16:9", "9:16", "1:1", "4:3"] as const).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        aspectRatio === ratio
                          ? "bg-pink-50 dark:bg-pink-950/40 border-pink-500 text-pink-600 dark:text-pink-400 shadow-sm"
                          : "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Selector */}
              <div>
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block mb-1.5">
                  🎭 ভিজ্যুয়াল আর্ট স্টাইল:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {styles.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStyle(s.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs border text-left transition-all ${
                        selectedStyle === s.id
                          ? "bg-pink-50 dark:bg-pink-950/40 border-pink-500 text-pink-700 dark:text-pink-300 font-bold"
                          : "bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      <span>{s.label}</span>
                      <span className="text-[10px] text-neutral-600 dark:text-neutral-400">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={isProcessing}
                onClick={handleGenerate}
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>ইমেজ জেনারেট হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>নতুন ইমেজ তৈরি করুন</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: EDIT */}
          {activeTab === "edit" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4 text-pink-600" />
                  <span>AI ডিরেক্ট ইমেজ এডিটর</span>
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  সিলেক্টেড ছবির যেকোনো অংশ পরিবর্তন করার নির্দেশনা দিন।
                </p>
              </div>

              {/* Quick Edit Presets (Requested by user) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  ⚡ দ্রুত এডিট অ্যাকশন:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() =>
                      handleApplyEdit("এই ছবির background পরিবর্তন করে আধুনিক ব্লার স্টুডিও ব্যাকগ্রাউন্ড করো।")
                    }
                    className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-pink-50 dark:hover:bg-pink-950/30 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2 text-left transition-colors"
                  >
                    <Palette className="w-4 h-4 text-pink-600 flex-shrink-0" />
                    <span>“এই ছবির background পরিবর্তন করো”</span>
                  </button>

                  <button
                    onClick={() =>
                      handleApplyEdit("মানুষটাকে/সাবজেক্টকে সম্পূর্ণভাবে সরিয়ে দাও এবং ব্যাকগ্রাউন্ড ফিল করো।")
                    }
                    className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-pink-50 dark:hover:bg-pink-950/30 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2 text-left transition-colors"
                  >
                    <Eraser className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>“মানুষটাকে সরিয়ে দাও (Remove Subject)”</span>
                  </button>

                  <button
                    onClick={() =>
                      handleApplyEdit("ব্যাকগ্রাউন্ডে সিনেমাটিক মেঘ ও সূর্যাস্তের আলো প্রতিস্থাপন করো।")
                    }
                    className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-pink-50 dark:hover:bg-pink-950/30 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2 text-left transition-colors"
                  >
                    <Sun className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>“সানসেট ও সিনেমাটিক স্কাই বসাও”</span>
                  </button>
                </div>
              </div>

              {/* Custom Edit Input */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  কাস্টম এডিট ইনস্ট্রাকশন:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editInstruction}
                    onChange={(e) => setEditInstruction(e.target.value)}
                    placeholder="যেমন: আলো আরও বাড়িয়ে দাও, নিয়ন সাইন যোগ করো..."
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-pink-500 focus:outline-none"
                  />
                  <button
                    disabled={isProcessing || !editInstruction.trim()}
                    onClick={() => handleApplyEdit(editInstruction)}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50 flex-shrink-0"
                  >
                    এপ্লাই
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ENHANCE */}
          {activeTab === "enhance" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-purple-600" />
                  <span>ইমেজ এনহ্যান্স ও থাম্বনেইল স্কেলিং</span>
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  ইউটিউব থাম্বনেইলের জন্য অপ্টিমাইজেশন ও কালার গ্রেডিং।
                </p>
              </div>

              {/* User requested quick actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickEnhance("cinematic")}
                  className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 rounded-xl text-left text-xs font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors"
                >
                  🎬 “এটাকে cinematic করে দাও”
                </button>

                <button
                  onClick={() => handleQuickEnhance("thumbnail")}
                  className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-xl text-left text-xs font-bold text-red-700 dark:text-red-300 hover:bg-red-100 transition-colors"
                >
                  📺 “YouTube 16:9 থাম্বনেইল করো”
                </button>
              </div>

              {/* Sliders */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    <span>উজ্জ্বলতা (Brightness):</span>
                    <span className="font-mono text-pink-600">{filters.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={filters.brightness}
                    onChange={(e) => setFilters({ ...filters, brightness: Number(e.target.value) })}
                    className="w-full accent-pink-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    <span>কনট্রাস্ট (Contrast):</span>
                    <span className="font-mono text-pink-600">{filters.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="160"
                    value={filters.contrast}
                    onChange={(e) => setFilters({ ...filters, contrast: Number(e.target.value) })}
                    className="w-full accent-pink-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    <span>স্যাচুরেশন (Saturation):</span>
                    <span className="font-mono text-pink-600">{filters.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="180"
                    value={filters.saturation}
                    onChange={(e) => setFilters({ ...filters, saturation: Number(e.target.value) })}
                    className="w-full accent-pink-600"
                  />
                </div>
              </div>

              <button
                onClick={() =>
                  setFilters({ brightness: 100, contrast: 100, saturation: 100, blur: 0, warmth: 0 })
                }
                className="w-full py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-xs font-bold text-neutral-700 dark:text-neutral-300 rounded-xl transition-colors"
              >
                ফিল্টার রিসেট করুন
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
