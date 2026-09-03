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
  Music,
  Sliders,
  Maximize2,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Clock,
  Settings,
  Scissors,
  Layers,
  VolumeX,
  Radio,
} from "lucide-react";
import { VideoSceneItem, VideoTimelineData } from "../types";

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
  const [selectedSceneId, setSelectedSceneId] = useState<number>(1);
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportProgress, setExportProgress] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Timeline Multi-Track State
  const [timeline, setTimeline] = useState<VideoTimelineData>({
    scenes: [
      {
        id: 1,
        name: "Scene 1",
        timeStart: 0,
        duration: 7,
        shotType: "Extreme Wide Aerial (ড্রোন শট)",
        visualDescription: "ভোরের কুয়াশাচ্ছন্ন পদ্মা নদীর ওপর দিয়ে ধীরগতির ড্রোন শট। দিগন্তে হালকা লালচে আভা।",
        voiceoverScript: "ভোরবেলা যখন পুরো পৃথিবী নিস্তব্ধ থাকে, তখন প্রকৃতি নিজের ভাষায় এক অপার্থিব প্রশান্তির গল্প বলে।",
        subtitle: "ভোরের নিস্তব্ধতায় প্রকৃতি শোনায় প্রশান্তির গল্প...",
        bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: 2,
        name: "Scene 2",
        timeStart: 7,
        duration: 8,
        shotType: "Macro Close-Up (ম্যাক্রো শট)",
        visualDescription: "সবুজ পাতার ডগায় জমে থাকা শিশিরবিন্দুর ওপর সকালের প্রথম রোদ পড়ার স্লো-মোশন শট (১২০ fps)।",
        voiceoverScript: "প্রতিটি সকাল আমাদের সামনে আসে এক নতুন আশার বার্তা নিয়ে। ফেলে আসা হতাশাগুলোকে পেছনে ফেলে নতুন করে শুরু করার সুযোগ।",
        subtitle: "প্রতিটি সকাল নতুন আশার বার্তা নিয়ে আসে...",
        bgImage: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: 3,
        name: "Scene 3",
        timeStart: 15,
        duration: 7,
        shotType: "Cinematic Tracking (মুভিং শট)",
        visualDescription: "এক তরুণ শান্তভাবে নদীর তীরে দাঁড়িয়ে দিগন্তের দিকে তাকিয়ে গভীর নিশ্বাস নিচ্ছে।",
        voiceoverScript: "হৃদয়ের ক্লান্তি দূর করতে কৃত্রিম কোলাহল থেকে দূরে গিয়ে সৃষ্টিকর্তার অপার সৃষ্টির সৌন্দর্যে মন ডুবিয়ে দিন।",
        subtitle: "কৃত্রিম কোলাহল ছেড়ে ফিরে আসুন অন্তরের শান্তিতে...",
        bgImage: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    voiceTrack: {
      enabled: true,
      volume: 90,
      voiceName: "Fenrir",
      speed: 1.0,
    },
    musicTrack: {
      enabled: true,
      volume: 40,
      trackName: "Peaceful Morning Piano",
      mood: "Calm & Reflective",
    },
    sfxTrack: {
      enabled: true,
      volume: 50,
      effects: [
        { time: 0, name: "Gentle Wind & Waves" },
        { time: 7, name: "Morning Birds Chirping" },
        { time: 15, name: "Deep Breath Whoosh" },
      ],
    },
    subtitleTrack: {
      enabled: true,
      fontSize: 18,
      color: "#FFFFFF",
    },
    aspectRatio: "16:9",
  });

  const totalDuration = timeline.scenes.reduce((acc, s) => acc + s.duration, 0);

  // Playback simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      const currentScene = timeline.scenes[currentSceneIndex];
      const durationMs = (currentScene?.duration || 6) * 1000;
      timer = setTimeout(() => {
        if (currentSceneIndex >= timeline.scenes.length - 1) {
          setIsPlaying(false);
          setCurrentSceneIndex(0);
        } else {
          setCurrentSceneIndex((prev) => prev + 1);
        }
      }, durationMs);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentSceneIndex, timeline.scenes]);

  const handleGenerateTimeline = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "video_editor",
          prompt: `Create a 3-scene video timeline with shot types, visual descriptions, voiceover scripts, and subtitles in Bengali for this prompt:
"${prompt}"

Output structured JSON or clean Markdown with duration for each scene.`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Timeline generated successfully
      }
    } catch (e) {
      console.error("Video timeline generation error:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReorderScene = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= timeline.scenes.length) return;

    const updated = [...timeline.scenes];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Recalculate timeStart
    let accTime = 0;
    const recalculated = updated.map((s) => {
      const start = accTime;
      accTime += s.duration;
      return { ...s, timeStart: start };
    });

    setTimeline({ ...timeline, scenes: recalculated });
  };

  const handleUpdateDuration = (sceneId: number, delta: number) => {
    const updated = timeline.scenes.map((s) => {
      if (s.id === sceneId) {
        const newDuration = Math.max(3, Math.min(30, s.duration + delta));
        return { ...s, duration: newDuration };
      }
      return s;
    });

    let accTime = 0;
    const recalculated = updated.map((s) => {
      const start = accTime;
      accTime += s.duration;
      return { ...s, timeStart: start };
    });

    setTimeline({ ...timeline, scenes: recalculated });
  };

  const handleUpdateSubtitle = (sceneId: number, text: string) => {
    setTimeline({
      ...timeline,
      scenes: timeline.scenes.map((s) => (s.id === sceneId ? { ...s, subtitle: text } : s)),
    });
  };

  const handleAddScene = () => {
    const newId = timeline.scenes.length + 1;
    const newScene: VideoSceneItem = {
      id: newId,
      name: `Scene ${newId}`,
      timeStart: totalDuration,
      duration: 6,
      shotType: "Medium Cinematic Shot",
      visualDescription: "প্রাকৃতিক আলোয় মনোমুগ্ধকর দৃশ্য ও ট্রানজিশন ইফেক্ট।",
      voiceoverScript: "জীবনের প্রতিটি মুহূর্ত সৃষ্টিশীলতায় ভরে উঠুক সুন্দর কর্মের মাধ্যমে।",
      subtitle: "সৃষ্টিশীলতায় ভরে উঠুক আপনার প্রতিটি মুহূর্ত...",
      bgImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    };
    setTimeline({ ...timeline, scenes: [...timeline.scenes, newScene] });
  };

  const handleDeleteScene = (sceneId: number) => {
    if (timeline.scenes.length <= 1) return;
    const filtered = timeline.scenes.filter((s) => s.id !== sceneId);
    let accTime = 0;
    const recalculated = filtered.map((s) => {
      const start = accTime;
      accTime += s.duration;
      return { ...s, timeStart: start };
    });
    setTimeline({ ...timeline, scenes: recalculated });
    if (currentSceneIndex >= recalculated.length) {
      setCurrentSceneIndex(0);
    }
  };

  const handleExportVideo = () => {
    setShowExportModal(true);
    setExportProgress(10);
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const currentScene = timeline.scenes[currentSceneIndex] || timeline.scenes[0];
  const selectedScene =
    timeline.scenes.find((s) => s.id === selectedSceneId) || timeline.scenes[0];

  return (
    <div id="video-studio-container" className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-950 via-rose-900 to-neutral-900 rounded-3xl p-6 text-white shadow-xl border border-red-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold mb-2">
            <Film className="w-3.5 h-3.5" />
            <span>FULL VIDEO EDITOR & TIMELINE STUDIO V2</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            মাল্টি-ট্র্যাক ভিডিও টাইমলাইন এডিটর
          </h1>
          <p className="text-red-200/90 text-xs md:text-sm mt-1">
            ভিডিও সিন রিঅর্ডার, ড্র্যাগ অ্যান্ড ড্রপ ট্রিম, ভয়েসওভার, মিউজিক বেড, এসএফএক্স এবং সাবটাইটেল সিঙ্ক।
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Aspect Ratio Switcher */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 text-xs">
            <button
              onClick={() => setAspectRatio("16:9")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                aspectRatio === "16:9" ? "bg-red-600 text-white shadow" : "text-neutral-300 hover:text-white"
              }`}
            >
              16:9
            </button>
            <button
              onClick={() => setAspectRatio("9:16")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                aspectRatio === "9:16" ? "bg-red-600 text-white shadow" : "text-neutral-300 hover:text-white"
              }`}
            >
              9:16
            </button>
            <button
              onClick={() => setAspectRatio("1:1")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                aspectRatio === "1:1" ? "bg-red-600 text-white shadow" : "text-neutral-300 hover:text-white"
              }`}
            >
              1:1
            </button>
          </div>

          <button
            id="video-export-open-btn"
            onClick={handleExportVideo}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm font-bold rounded-xl shadow transition-all"
          >
            <Download className="w-4 h-4" />
            <span>এক্সপোর্ট করুন</span>
          </button>
        </div>
      </div>

      {/* Main Preview & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Video Player Monitor */}
        <div className="lg:col-span-8 bg-neutral-950 rounded-2xl p-4 border border-neutral-800 shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
          {/* Monitor Screen Frame */}
          <div
            className={`w-full relative rounded-xl overflow-hidden shadow-2xl transition-all flex items-center justify-center bg-black ${
              aspectRatio === "16:9"
                ? "aspect-video max-h-[420px]"
                : aspectRatio === "9:16"
                ? "w-[260px] aspect-[9/16] my-2"
                : "w-[340px] aspect-square my-2"
            }`}
          >
            <img
              src={currentScene.bgImage}
              alt="Scene preview"
              className={`w-full h-full object-cover transition-transform duration-1000 ${
                isPlaying ? "scale-105" : "scale-100"
              }`}
            />
            {/* Dark gradient for text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Subtitle Overlay */}
            {timeline.subtitleTrack.enabled && (
              <div className="absolute bottom-6 left-4 right-4 text-center px-4 py-2 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10 max-w-[85%] mx-auto">
                <p
                  className="font-bold drop-shadow-md text-white tracking-wide"
                  style={{ fontSize: `${timeline.subtitleTrack.fontSize}px` }}
                >
                  {currentScene.subtitle}
                </p>
              </div>
            )}

            {/* Shot Info Badge */}
            <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-md rounded-md text-[11px] font-semibold text-neutral-200 border border-white/10">
              {currentScene.name}: {currentScene.shotType}
            </div>

            {/* Time Indicator */}
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-red-600/90 text-white rounded text-[11px] font-mono font-bold">
              {isPlaying ? "PLAYING" : "PREVIEW"}
            </div>
          </div>

          {/* Player Transport Controls */}
          <div className="w-full flex items-center justify-between mt-4 px-2 text-white">
            <div className="flex items-center gap-2">
              <button
                id="video-player-toggle"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow transition-all active:scale-95"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentSceneIndex(0);
                }}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                title="রিসেট"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="text-xs font-mono text-neutral-400 ml-2">
                সিন {currentSceneIndex + 1} / {timeline.scenes.length} • মোট সময়: {totalDuration}s
              </div>
            </div>

            {/* Track volume badges */}
            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                {timeline.voiceTrack.volume}%
              </span>
              <span className="flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-emerald-400" />
                {timeline.musicTrack.volume}%
              </span>
            </div>
          </div>
        </div>

        {/* Right: Scene Inspector & Edit Panel */}
        <div className="lg:col-span-4 bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-red-600" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                সিন ইন্সপেক্টর ({selectedScene.name})
              </h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400">
              {selectedScene.duration} সেকেন্ড
            </span>
          </div>

          {/* Scene Trim Controls */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex justify-between">
              <span>ট্রিম / দৃশ্যকাল (Duration):</span>
              <span className="font-mono text-red-600 font-bold">{selectedScene.duration}s</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateDuration(selectedScene.id, -1)}
                className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-bold"
              >
                -1s
              </button>
              <input
                type="range"
                min="3"
                max="25"
                value={selectedScene.duration}
                onChange={(e) =>
                  handleUpdateDuration(selectedScene.id, Number(e.target.value) - selectedScene.duration)
                }
                className="w-full accent-red-600"
              />
              <button
                onClick={() => handleUpdateDuration(selectedScene.id, 1)}
                className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-bold"
              >
                +1s
              </button>
            </div>
          </div>

          {/* Subtitle Editor for this scene */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              সাবটাইটেল টেক্সট:
            </label>
            <textarea
              value={selectedScene.subtitle}
              onChange={(e) => handleUpdateSubtitle(selectedScene.id, e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-red-600 focus:outline-none"
            />
          </div>

          {/* Voiceover Script */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              ভয়েসওভার স্ক্রিপ্ট:
            </label>
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300 max-h-24 overflow-y-auto">
              {selectedScene.voiceoverScript}
            </div>
            {onSendToAudio && (
              <button
                onClick={() => onSendToAudio(selectedScene.voiceoverScript)}
                className="w-full py-1.5 text-xs font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                ভয়েস স্টুডিওতে সিন্থেসিস করুন
              </button>
            )}
          </div>

          {/* Shot Type & Description */}
          <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-lg">
            <div>
              <span className="font-bold text-neutral-700 dark:text-neutral-300">শট টাইপ:</span>{" "}
              {selectedScene.shotType}
            </div>
            <div>
              <span className="font-bold text-neutral-700 dark:text-neutral-300">ভিজ্যুয়াল:</span>{" "}
              {selectedScene.visualDescription}
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO TIMELINE MULTI-TRACK EDITOR */}
      <div className="bg-neutral-900 rounded-2xl p-5 border border-neutral-800 shadow-xl space-y-4 text-white">
        {/* Timeline Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-red-500" />
            <h3 className="font-bold text-sm tracking-wide text-white">
              VIDEO MULTI-TRACK TIMELINE
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddScene}
              className="flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white rounded-lg transition-colors border border-neutral-700"
            >
              <Plus className="w-3.5 h-3.5 text-red-400" />
              <span>সিন যোগ করুন</span>
            </button>
          </div>
        </div>

        {/* TRACK 1: Video Scenes */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-bold px-1">
            <span className="flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-red-500" />
              TRACK 1: VIDEO SCENES
            </span>
            <span className="text-[11px] font-mono text-neutral-500">
              Drag / Reorder / Trim
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {timeline.scenes.map((scene, idx) => {
              const isCurrent = currentSceneIndex === idx;
              const isSelected = selectedSceneId === scene.id;

              return (
                <div
                  key={scene.id}
                  onClick={() => {
                    setSelectedSceneId(scene.id);
                    setCurrentSceneIndex(idx);
                  }}
                  className={`relative p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-red-950/40 border-red-500 ring-2 ring-red-500/30"
                      : "bg-neutral-800/80 border-neutral-700/80 hover:bg-neutral-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-200">
                      {scene.name} ({scene.duration}s)
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={idx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReorderScene(idx, "left");
                        }}
                        className="p-1 hover:bg-neutral-700 rounded text-neutral-400 disabled:opacity-30"
                        title="বামে সরান"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === timeline.scenes.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReorderScene(idx, "right");
                        }}
                        className="p-1 hover:bg-neutral-700 rounded text-neutral-400 disabled:opacity-30"
                        title="ডানে সরান"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      {timeline.scenes.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteScene(scene.id);
                          }}
                          className="p-1 hover:bg-red-900/60 rounded text-neutral-400 hover:text-red-400"
                          title="ডিলিট"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail snippet */}
                  <div className="relative h-20 rounded-lg overflow-hidden border border-neutral-700">
                    <img
                      src={scene.bgImage}
                      alt={scene.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute bottom-1 left-2 right-2 text-[10px] text-white font-medium truncate">
                      {scene.shotType}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TRACK 2: Voiceover Track */}
        <div className="p-3 bg-neutral-800/60 rounded-xl border border-neutral-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-xs font-bold text-neutral-200 block">
                TRACK 2: VOICEOVER (AI GEMINI TTS)
              </span>
              <span className="text-[11px] text-neutral-400">
                ভয়েস: {timeline.voiceTrack.voiceName} • গতি: {timeline.voiceTrack.speed}x
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-400">ভলিউম:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={timeline.voiceTrack.volume}
                onChange={(e) =>
                  setTimeline({
                    ...timeline,
                    voiceTrack: { ...timeline.voiceTrack, volume: Number(e.target.value) },
                  })
                }
                className="w-24 accent-purple-500"
              />
              <span className="text-xs font-mono text-neutral-300 w-8">
                {timeline.voiceTrack.volume}%
              </span>
            </div>
          </div>
        </div>

        {/* TRACK 3: Background Music Track */}
        <div className="p-3 bg-neutral-800/60 rounded-xl border border-neutral-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-xs font-bold text-neutral-200 block">
                TRACK 3: BACKGROUND MUSIC (BGM)
              </span>
              <span className="text-[11px] text-neutral-400">
                ট্র্যাক: {timeline.musicTrack.trackName} ({timeline.musicTrack.mood})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-400">ভলিউম:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={timeline.musicTrack.volume}
                onChange={(e) =>
                  setTimeline({
                    ...timeline,
                    musicTrack: { ...timeline.musicTrack, volume: Number(e.target.value) },
                  })
                }
                className="w-24 accent-emerald-500"
              />
              <span className="text-xs font-mono text-neutral-300 w-8">
                {timeline.musicTrack.volume}%
              </span>
            </div>
          </div>
        </div>

        {/* TRACK 4: Sound Effects (SFX) Track */}
        <div className="p-3 bg-neutral-800/60 rounded-xl border border-neutral-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-xs font-bold text-neutral-200 block">
                TRACK 4: SOUND EFFECTS (SFX)
              </span>
              <span className="text-[11px] text-neutral-400">
                ৩টি সিঙ্কড সাউন্ড এফেক্ট সক্রিয় (Whoosh, Waves, Birds)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-400">ভলিউম:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={timeline.sfxTrack.volume}
              onChange={(e) =>
                setTimeline({
                  ...timeline,
                  sfxTrack: { ...timeline.sfxTrack, volume: Number(e.target.value) },
                })
              }
              className="w-24 accent-amber-500"
            />
            <span className="text-xs font-mono text-neutral-300 w-8">
              {timeline.sfxTrack.volume}%
            </span>
          </div>
        </div>

        {/* TRACK 5: Subtitle Track */}
        <div className="p-3 bg-neutral-800/60 rounded-xl border border-neutral-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Subtitles className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-xs font-bold text-neutral-200 block">
                TRACK 5: SUBTITLE & CAPTIONS
              </span>
              <span className="text-[11px] text-neutral-400">
                স্বয়ংক্রিয় সিঙ্কড বাংলা সাবটাইটেল ট্র্যাক (সাইজ: {timeline.subtitleTrack.fontSize}px)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={timeline.subtitleTrack.enabled}
                onChange={(e) =>
                  setTimeline({
                    ...timeline,
                    subtitleTrack: {
                      ...timeline.subtitleTrack,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="rounded accent-blue-500"
              />
              <span>সাবটাইটেল অন রাখুন</span>
            </label>
          </div>
        </div>
      </div>

      {/* Export Settings Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 max-w-md w-full border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                  ভিডিও এক্সপোর্ট ও রেন্ডার সেটিংস
                </h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-700 dark:text-neutral-300">
              <div>
                <label className="font-bold block mb-1">রেজোলিউশন:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button className="py-2 bg-red-50 dark:bg-red-950/40 text-red-600 border border-red-500 rounded-lg font-bold">
                    1080p FHD
                  </button>
                  <button className="py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200">
                    4K Ultra HD
                  </button>
                  <button className="py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200">
                    720p HD
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">ফ্রেমরেট (FPS):</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2 bg-red-50 dark:bg-red-950/40 text-red-600 border border-red-500 rounded-lg font-bold">
                    60 FPS (স্মুথ)
                  </button>
                  <button className="py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200">
                    30 FPS (স্ট্যান্ডার্ড)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">ফরম্যাট:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2 bg-red-50 dark:bg-red-950/40 text-red-600 border border-red-500 rounded-lg font-bold">
                    MP4 (H.264)
                  </button>
                  <button className="py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200">
                    WebM
                  </button>
                </div>
              </div>

              {exportProgress !== null && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span>রেন্ডারিং প্রগ্রেস...</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600 transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  alert("ভিডিও প্রজেক্ট এবং টাইমলাইন কনফিগ ফাইল ডাউনলোড সম্পন্ন হয়েছে!");
                  setShowExportModal(false);
                }}
                className="px-5 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow transition-all"
              >
                ডাউনলোড শুরু করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
