import React from "react";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { PresetQuote } from "../types";

interface PresetQuotesListProps {
  presets: PresetQuote[];
  selectedText: string;
  onSelectPreset: (preset: PresetQuote) => void;
}

export const PresetQuotesList: React.FC<PresetQuotesListProps> = ({
  presets,
  selectedText,
  onSelectPreset,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs font-['Hind_Siliguri',sans-serif] space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>নমুনা বক্তব্য ও উক্তি (Presets)</span>
        </h3>
        <span className="text-xs text-neutral-400">ক্লিক করে লোড করুন</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {presets.map((item) => {
          const isActive = selectedText.trim() === item.text.trim();
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectPreset(item)}
              id={`preset-btn-${item.id}`}
              className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between group ${
                isActive
                  ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                  : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xs font-bold text-emerald-700 uppercase tracking-wide px-2 py-0.5 rounded-md bg-emerald-100/70">
                    {item.category}
                  </span>
                  {isActive && (
                    <span className="flex items-center gap-1 text-2xs font-semibold text-emerald-700">
                      <Sparkles className="w-3 h-3" /> সক্রিয়
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-neutral-900 line-clamp-1 mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                  "{item.text}"
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-2xs text-neutral-500 group-hover:text-emerald-700">
                <span>প্রস্তাবিত ভয়েস: {item.suggestedVoice}</span>
                <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
