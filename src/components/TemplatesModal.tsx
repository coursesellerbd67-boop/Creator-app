import React, { useState } from "react";
import {
  X,
  LayoutGrid,
  Sparkles,
  Youtube,
  Globe,
  Smartphone,
  Video,
  Mic,
  Code2,
  ArrowRight,
} from "lucide-react";
import { STUDIO_TEMPLATES } from "../data/templates";
import { StudioType } from "../types";

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (prompt: string, targetStudio: StudioType) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [filter, setFilter] = useState<string>("all");

  if (!isOpen) return null;

  const filtered =
    filter === "all"
      ? STUDIO_TEMPLATES
      : STUDIO_TEMPLATES.filter((t) => t.category === filter);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-200">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 font-['Hind_Siliguri',sans-serif]">
                রেডিমেড ক্রিয়েশন টেমপ্লেটস
              </h2>
              <p className="text-xs text-neutral-500 font-['Hind_Siliguri',sans-serif]">
                এক ক্লিকে প্রজেক্ট শুরু করতে পছন্দসই টেমপ্লেট নির্বাচন করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-5 py-2.5 border-b border-neutral-100 flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: "all", label: "সবগুলো" },
            { id: "youtube", label: "📺 YouTube" },
            { id: "website", label: "🌐 ওয়েবসাইট" },
            { id: "app", label: "📱 মোবাইল অ্যাপ" },
            { id: "creative", label: "🎨 ক্রিয়েটিভ ও অডিও" },
            { id: "business", label: "💼 বিজনেস ও কোড" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
                filter === tab.id
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid List */}
        <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectTemplate(item.prompt, item.targetStudio);
                onClose();
              }}
              className="p-4 rounded-2xl border border-neutral-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer bg-white group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-wider">
                    {item.targetStudio}
                  </span>
                  <Sparkles className="w-4 h-4 text-neutral-300 group-hover:text-emerald-500 transition-colors" />
                </div>
                <h3 className="font-bold text-sm text-neutral-900 group-hover:text-emerald-800 font-['Hind_Siliguri',sans-serif]">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-['Hind_Siliguri',sans-serif]">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>টেমপ্লেট ব্যবহার করুন</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
