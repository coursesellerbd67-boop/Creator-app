import React, { useState, useEffect } from "react";
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  Copy,
  Check,
  Film,
  Camera,
  Subtitles,
  Volume2,
} from "lucide-react";

interface SceneItem {
  id: number;
  time: string;
  shotType: string;
  visualDescription: string;
  voiceoverScript: string;
  subtitle: string;
  bgImage: string;
}

interface VideoStudioProps {
  initialPrompt?: string;
  onSendToAudio?: (text: string) => void;
}

export const VideoStudio: React.FC<VideoStudioProps> = ({
  initialPrompt = "",
  onSendToAudio,
}) => {
  const [prompt, setPrompt] = useState(
    initialPrompt ||
      "একটি সিনেমাটিক ডকুমেন্টারি ভিডিও: 'ভোরের প্রশান্তি ও আত্মিক জাগরণ'। বৃষ্টিভেজা সবুজ প্রকৃতি ও নদীর ঢেউ।"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const [scenes, setScenes] = useState<SceneItem[]>([
    {
      id: 1,
      time: "০০:০০ - ০০:০৭",
      shotType: "Extreme Wide Aerial (ড্রোন শট)",
      visualDescription: "ভোরের কুয়াশাচ্ছন্ন পদ্মা নদীর ওপর দিয়ে ধীরগতির ড্রোন শট। দিগন্তে হালকা লালচে আভা।",
      voiceoverScript: "ভোরবেলা যখন পুরো পৃথিবী নিস্তব্ধ থাকে, তখন প্রকৃতি নিজের ভাষায় এক অপার্থিব প্রশান্তির গল্প বলে।",
      subtitle: "ভোরের নিস্তব্ধতায় প্রকৃতি শোনায় প্রশান্তির গল্প...",
      bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 2,
      time: "০০:০৭ - ০০:১৫",
      shotType: "Macro Close-Up (ম্যাক্রো শট)",
      visualDescription: "সবুজ পাতার ডগায় জমে থাকা শিশিরবিন্দুর ওপর সকালের প্রথম রোদ পড়ার স্লো-মোশন শট (১২০ fps)।",
      voiceoverScript: "প্রতিটি সকাল আমাদের সামনে আসে এক নতুন আশার বার্তা নিয়ে। ফেলে আসা হতাশাগুলোকে পেছনে ফেলে নতুন করে শুরু করার সুযোগ।",
      subtitle: "প্রতিটি সকাল নতুন আশার বার্তা নিয়ে আসে...",
      bgImage: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 3,
      time: "০০:১৫ - ০০:২২",
      shotType: "Cinematic Tracking (মুভিং শট)",
      visualDescription: "এক তরুণ শান্তভাবে নদীর তীরে দাঁড়িয়ে দিগন্তের দিকে তাকিয়ে গভীর নিশ্বাস নিচ্ছে।",
      voiceoverScript: "হৃদয়ের ক্লান্তি দূর করতে কৃত্রিম কোলাহল থেকে দূরে গিয়ে সৃষ্টিকর্তার অপার সৃষ্টির সৌন্দর্যে মন ডুবিয়ে দিন।",
      subtitle: "কৃত্রিম কোলাহল ছেড়ে ফিরে আসুন অন্তরের শান্তিতে...",
      bgImage: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80",
    },
  ]);

  // Video playback simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSceneIndex((prev) => {
          if (prev >= scenes.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, scenes.length]);

  const handleGenerateStoryboard = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Create a 3-scene cinematic video storyboard for this idea: "${prompt}".
For each scene provide:
- Time code
- Shot type (Camera angle)
- Visual description
- Voiceover script in Bengali
- Subtitle in Bengali`,
        }),
      });

      const data = await res.json();
      if (data.success && data.text) {
        // Keep updated scenes and start preview
        setCurrentSceneIndex(0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyScript = () => {
    const fullScript = scenes.map((s) => `[${s.time}] ${s.voiceoverScript}`).join("\n\n");
    navigator.clipboard.writeText(fullScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentScene = scenes[currentSceneIndex] || scenes[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 rounded-2xl p-6 text-white shadow-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
            <Video className="w-3.5 h-3.5" />
            <span>AI ভিডিও স্টুডিও ও স্টোরিবোর্ড</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Hind_Siliguri',sans-serif]">
            ভিডিও স্টুডিও
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl font-['Hind_Siliguri',sans-serif]">
            সিন-বাই-সিন সিনেমাটিক স্টোরিবোর্ড, ক্যামেরা মুভমেন্ট, ডায়লগ এবং
            রিয়েল-টাইম সাবটাইটেল প্লেয়ার।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Interactive Video Canvas Player */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-xl flex flex-col relative aspect-video select-none group">
            {/* Scene Visual Background */}
            <img
              src={currentScene.bgImage}
              alt="Scene preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-opacity duration-700"
            />

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50" />

            {/* Top Bar on Video Canvas */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs text-white">
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs font-mono font-semibold border border-white/20">
                সিন {currentScene.id} / {scenes.length} • {currentScene.time}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-red-600 font-semibold text-[11px]">
                {currentScene.shotType}
              </span>
            </div>

            {/* Subtitle Overlay in Bottom Third */}
            <div className="absolute bottom-14 left-4 right-4 text-center">
              <div className="inline-block bg-black/75 backdrop-blur-xs text-white px-4 py-2 rounded-xl text-sm sm:text-base font-bold font-['Hind_Siliguri',sans-serif] border border-white/10 shadow-lg tracking-wide">
                {currentScene.subtitle}
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 p-3 bg-neutral-950/80 backdrop-blur-md flex items-center justify-between gap-3 text-white text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-700 flex items-center justify-center font-bold text-white shadow-xs"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentSceneIndex(0);
                  }}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
                  title="প্রথম থেকে শুরু করুন"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Scene Stepper Dots */}
              <div className="flex items-center gap-1.5">
                {scenes.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentSceneIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentSceneIndex
                        ? "w-6 bg-red-500"
                        : "w-2 bg-neutral-600 hover:bg-neutral-400"
                    }`}
                  />
                ))}
              </div>

              <span className="font-mono text-neutral-400 text-[11px]">
                {isPlaying ? "প্লে হচ্ছে..." : "পজ করা"}
              </span>
            </div>
          </div>

          {/* Current Scene Script & Audio sender */}
          <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 font-['Hind_Siliguri',sans-serif]">
                বর্তমান সিনের ভয়েসওভার স্ক্রিপ্ট:
              </span>
              {onSendToAudio && (
                <button
                  onClick={() => onSendToAudio(currentScene.voiceoverScript)}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>ভয়েস স্টুডিওতে পাঠান</span>
                </button>
              )}
            </div>
            <p className="text-xs text-neutral-700 font-['Hind_Siliguri',sans-serif] bg-neutral-50 p-3 rounded-xl border border-neutral-200 leading-relaxed">
              "{currentScene.voiceoverScript}"
            </p>
          </div>
        </div>

        {/* Right 5 cols: Storyboard List & Prompt Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs space-y-3">
            <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider font-['Hind_Siliguri',sans-serif] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>ভিডিওর আইডিয়া ও বিষয়</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              className="w-full p-2.5 text-xs rounded-xl border border-neutral-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none resize-none font-['Hind_Siliguri',sans-serif]"
            />
            <button
              onClick={handleGenerateStoryboard}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <span>নতুন স্টোরিবোর্ড তৈরি করুন</span>
            </button>
          </div>

          {/* Storyboard Scenes List */}
          <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-900 font-['Hind_Siliguri',sans-serif]">
                স্টোরিবোর্ড শট তালিকা ({scenes.length})
              </h3>
              <button
                onClick={handleCopyScript}
                className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>সব স্ক্রিপ্ট কপি</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {scenes.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setCurrentSceneIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    idx === currentSceneIndex
                      ? "bg-rose-50 border-rose-400 ring-2 ring-rose-100"
                      : "border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
                    <span>সিন {s.id}: {s.shotType}</span>
                    <span className="font-mono text-neutral-400 text-[10px]">{s.time}</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-1 font-['Hind_Siliguri',sans-serif] line-clamp-2">
                    {s.visualDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
