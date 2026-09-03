import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Bot,
  Globe,
  Smartphone,
  Workflow,
  Mic,
  Video,
  Image as ImageIcon,
  Code2,
  FileText,
  Compass,
  Lightbulb,
} from "lucide-react";
import { StudioType } from "../types";
import { STUDIO_TEMPLATES } from "../data/templates";

interface UniversalPromptProps {
  onExecutePrompt: (prompt: string, targetStudio: StudioType) => void;
  onSelectStudio: (studio: StudioType) => void;
}

export const UniversalPrompt: React.FC<UniversalPromptProps> = ({
  onExecutePrompt,
  onSelectStudio,
}) => {
  const [promptText, setPromptText] = useState("");
  const [selectedStudioHint, setSelectedStudioHint] = useState<StudioType | "auto">("auto");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Quick categories
  const categories = [
    { id: "auto", label: "✨ স্মার্ট অটো-ডিটেক্ট", icon: Sparkles },
    { id: "agent", label: "🧩 এআই এজেন্ট", icon: Workflow },
    { id: "website", label: "🌐 ওয়েবসাইট", icon: Globe },
    { id: "app", label: "📱 মোবাইল অ্যাপ", icon: Smartphone },
    { id: "audio", label: "🎙️ বাংলা ভয়েস", icon: Mic },
    { id: "video", label: "🎬 ভিডিও স্টুডিও", icon: Video },
    { id: "image", label: "🖼️ ইমেজ", icon: ImageIcon },
    { id: "code", label: "💻 কোডিং", icon: Code2 },
    { id: "chat", label: "🤖 চ্যাট", icon: Bot },
    { id: "doc", label: "📄 ডকুমেন্ট AI", icon: FileText },
  ];

  const handleLaunch = () => {
    const trimmed = promptText.trim();
    if (!trimmed) return;

    setIsAnalyzing(true);

    let targetStudio: StudioType = "chat";

    if (selectedStudioHint !== "auto") {
      targetStudio = selectedStudioHint;
    } else {
      // Smart detection based on prompt keywords
      const lower = trimmed.toLowerCase();
      if (
        lower.includes("website") ||
        lower.includes("ওয়েবসাইট") ||
        lower.includes("ওয়েবসাইট") ||
        lower.includes("web page") ||
        lower.includes("ল্যান্ডিং")
      ) {
        targetStudio = "website";
      } else if (
        lower.includes("app") ||
        lower.includes("অ্যাপ") ||
        lower.includes("মোবাইল") ||
        lower.includes("android") ||
        lower.includes("ios")
      ) {
        targetStudio = "app";
      } else if (
        lower.includes("youtube") ||
        lower.includes("ভিডিও প্যাকেজ") ||
        lower.includes("১০টা ভিডিও") ||
        lower.includes("এজেন্ট") ||
        lower.includes("agent") ||
        lower.includes("workflow") ||
        lower.includes("কমপ্লিট প্যাকেজ")
      ) {
        targetStudio = "agent";
      } else if (
        lower.includes("ভয়েস") ||
        lower.includes("ভয়েস") ||
        lower.includes("ওয়াজ") ||
        lower.includes("কণ্ঠ") ||
        lower.includes("অডিও") ||
        lower.includes("speech") ||
        lower.includes("voice")
      ) {
        targetStudio = "audio";
      } else if (
        lower.includes("ভিডিও") ||
        lower.includes("video") ||
        lower.includes("স্টোরিবোর্ড") ||
        lower.includes("সিন")
      ) {
        targetStudio = "video";
      } else if (
        lower.includes("ছবি") ||
        lower.includes("image") ||
        lower.includes("থাম্বনেইল") ||
        lower.includes("পিকচার") ||
        lower.includes("art")
      ) {
        targetStudio = "image";
      } else if (
        lower.includes("code") ||
        lower.includes("কোড") ||
        lower.includes("python") ||
        lower.includes("javascript") ||
        lower.includes("react") ||
        lower.includes("api") ||
        lower.includes("backend")
      ) {
        targetStudio = "code";
      } else if (
        lower.includes("pdf") ||
        lower.includes("ডকুমেন্ট") ||
        lower.includes("csv") ||
        lower.includes("সারসংক্ষেপ")
      ) {
        targetStudio = "doc";
      }
    }

    setTimeout(() => {
      setIsAnalyzing(false);
      onExecutePrompt(trimmed, targetStudio);
    }, 400);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>STUDIO X — অল-ইন-ওয়ান এআই ক্রিয়েশন স্যুইট</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight font-['Hind_Siliguri',sans-serif]">
          তুমি আজ কী তৈরি করতে চাও?
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base max-w-2xl mx-auto font-['Hind_Siliguri',sans-serif]">
          ওয়েবসাইট, মোবাইল অ্যাপ, অটোনোমাস ইউটিউব প্যাকেজ, বাংলা ভয়েস, ভিডিও
          স্ক্রিপ্ট বা পূর্ণাঙ্গ কোড—শুধু একটি প্রম্পটেই তৈরি করুন।
        </p>
      </div>

      {/* Universal Prompt Box */}
      <div className="relative bg-white rounded-2xl border-2 border-neutral-300 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100 shadow-sm transition-all p-3 sm:p-4">
        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-2 border-b border-neutral-100 text-xs scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedStudioHint === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedStudioHint(cat.id as any)}
                className={`px-2.5 py-1.5 rounded-lg shrink-0 font-medium transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            id="universal-prompt-input"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleLaunch();
              }
            }}
            placeholder="উদাহরণ: 'একটা Islamic education website তৈরি করো, responsive design সহ, বাংলা ও English language থাকবে।' অথবা 'YouTube-এর জন্য ১০টা ভিডিও তৈরির প্যাকেজ বানাও'..."
            rows={3}
            className="w-full bg-transparent resize-none border-0 text-neutral-800 text-sm sm:text-base focus:ring-0 focus:outline-none placeholder:text-neutral-400 font-['Hind_Siliguri',sans-serif] leading-relaxed"
          />
        </div>

        {/* Bottom Bar: Action buttons & smart status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-['Hind_Siliguri',sans-serif]">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                টার্গেট মোড:{" "}
                <strong className="text-neutral-800 capitalize">
                  {selectedStudioHint === "auto"
                    ? "স্মার্ট অটো-ডিটেক্ট"
                    : selectedStudioHint}
                </strong>
              </span>
            </span>
          </div>

          <button
            id="universal-prompt-submit-btn"
            onClick={handleLaunch}
            disabled={!promptText.trim() || isAnalyzing}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
              promptText.trim() && !isAnalyzing
                ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow-emerald-200"
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            }`}
          >
            {isAnalyzing ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>প্ল্যান করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <span>তৈরি শুরু করুন</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Launch Cards / Workspace Shortcuts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2 font-['Hind_Siliguri',sans-serif]">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>জনপ্রিয় স্টুডিও ও এক-ক্লিকে অ্যাকশন</span>
          </h2>
          <span className="text-xs text-neutral-500">
            যেকোনো স্টুডিওতে সরাসরি প্রবেশ করুন
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Agent */}
          <div
            id="quick-card-agent"
            onClick={() => onSelectStudio("agent")}
            className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Workflow className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 font-['Hind_Siliguri',sans-serif] group-hover:text-amber-700">
              মাল্টি-স্টেপ এআই এজেন্ট
            </h3>
            <p className="text-xs text-neutral-500 mt-1 font-['Hind_Siliguri',sans-serif]">
              রিসার্চ থেকে শুরু করে স্ক্রিপ্ট, অডিও ও ভিডিও প্যাকেজ নিজে ধাপে ধাপে
              সম্পন্ন করে।
            </p>
          </div>

          {/* Card 2: Website */}
          <div
            id="quick-card-website"
            onClick={() => onSelectStudio("website")}
            className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 font-['Hind_Siliguri',sans-serif] group-hover:text-blue-700">
              রেসপন্সিভ ওয়েবসাইট বিল্ডার
            </h3>
            <p className="text-xs text-neutral-500 mt-1 font-['Hind_Siliguri',sans-serif]">
              প্রম্পট দিলেই পূর্ণাঙ্গ লাইভ ওয়েবসাইট তৈরি, প্রিভিউ এবং জিপ কোড
              ডাউনলোড।
            </p>
          </div>

          {/* Card 3: App Builder */}
          <div
            id="quick-card-app"
            onClick={() => onSelectStudio("app")}
            className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 font-['Hind_Siliguri',sans-serif] group-hover:text-emerald-700">
              মোবাইল অ্যাপ প্রোটোটাইপ
            </h3>
            <p className="text-xs text-neutral-500 mt-1 font-['Hind_Siliguri',sans-serif]">
              লাইভ ফোন ফ্রেমের ভেতর ইন্টারেক্টিভ মোবাইল অ্যাপ ইন্টারফেস ও কোড।
            </p>
          </div>

          {/* Card 4: Bengali Voice */}
          <div
            id="quick-card-audio"
            onClick={() => onSelectStudio("audio")}
            className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 font-['Hind_Siliguri',sans-serif] group-hover:text-purple-700">
              বাংলা ভয়েস স্টুডিও (TTS)
            </h3>
            <p className="text-xs text-neutral-500 mt-1 font-['Hind_Siliguri',sans-serif]">
              স্বাভাবিক বাংলা কণ্ঠে ওয়াজ, খবর বা গল্পের অডিও তৈরি ও ওয়েভফর্ম
              প্লেয়ার।
            </p>
          </div>
        </div>
      </div>

      {/* Featured Templates Row */}
      <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm text-neutral-900 font-['Hind_Siliguri',sans-serif]">
            🎯 রেডিমেড টেমপ্লেট থেকে দ্রুত শুরু করুন
          </span>
          <span className="text-xs text-emerald-700 font-medium">
            ৮টি রেডিমেড আইডিয়া
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {STUDIO_TEMPLATES.slice(0, 4).map((tpl) => (
            <div
              key={tpl.id}
              id={`template-card-${tpl.id}`}
              onClick={() => onExecutePrompt(tpl.prompt, tpl.targetStudio)}
              className="p-3.5 rounded-xl bg-white border border-neutral-200 hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer flex items-start gap-3 text-left"
            >
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-neutral-900 truncate font-['Hind_Siliguri',sans-serif]">
                  {tpl.title}
                </div>
                <div className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5 font-['Hind_Siliguri',sans-serif]">
                  {tpl.description}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0 mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
