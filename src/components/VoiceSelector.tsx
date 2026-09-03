import React from "react";
import { Sparkles, Globe, User, Sliders } from "lucide-react";
import { EngineType, ToneOption, VoiceOption } from "../types";

interface VoiceSelectorProps {
  engine: EngineType;
  onEngineChange: (engine: EngineType) => void;
  geminiVoices: VoiceOption[];
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
  selectedTone: string;
  onToneChange: (tone: string) => void;
  toneOptions: ToneOption[];
  browserVoices: SpeechSynthesisVoice[];
  selectedBrowserVoiceIndex: number;
  onBrowserVoiceChange: (index: number) => void;
  rate: number;
  onRateChange: (rate: number) => void;
  pitch: number;
  onPitchChange: (pitch: number) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  engine,
  onEngineChange,
  geminiVoices,
  selectedVoice,
  onVoiceChange,
  selectedTone,
  onToneChange,
  toneOptions,
  browserVoices,
  selectedBrowserVoiceIndex,
  onBrowserVoiceChange,
  rate,
  onRateChange,
  pitch,
  onPitchChange,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs space-y-5 font-['Hind_Siliguri',sans-serif]">
      {/* Engine Selection Tabs */}
      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
          ভয়েস ইঞ্জিন নির্বাচন
        </label>
        <div className="grid grid-cols-2 gap-2 bg-neutral-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onEngineChange("gemini")}
            id="tab-engine-gemini"
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              engine === "gemini"
                ? "bg-white text-emerald-800 shadow-xs border border-emerald-200/60"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Sparkles className={`w-4 h-4 ${engine === "gemini" ? "text-emerald-600" : "text-neutral-400"}`} />
            <span>AI স্টুডিও (HD Voice)</span>
          </button>

          <button
            type="button"
            onClick={() => onEngineChange("browser")}
            id="tab-engine-browser"
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              engine === "browser"
                ? "bg-white text-indigo-800 shadow-xs border border-indigo-200/60"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Globe className={`w-4 h-4 ${engine === "browser" ? "text-indigo-600" : "text-neutral-400"}`} />
            <span>ডিভাইস স্পিচ (তাৎক্ষণিক)</span>
          </button>
        </div>
      </div>

      {/* Engine 1: Gemini AI Voice Controls */}
      {engine === "gemini" && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-neutral-800 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                <span>কণ্ঠস্বর (AI ভয়েস)</span>
              </label>
              <span className="text-xs text-neutral-500 font-sans">Gemini 3.1 Neural</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {geminiVoices.map((v) => {
                const isSelected = selectedVoice === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => onVoiceChange(v.id)}
                    id={`voice-opt-${v.id.toLowerCase()}`}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-neutral-900 text-sm">{v.name}</div>
                      <span
                        className={`text-2xs px-2 py-0.5 rounded-full font-medium ${
                          v.gender === "Female"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {v.gender === "Female" ? "নারী" : "পুরুষ"}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">{v.tone}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tone / Mood Selector */}
          <div>
            <label className="block text-sm font-bold text-neutral-800 mb-2">
              সুর ও বাচনভঙ্গি (Mood & Tone)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {toneOptions.map((tone) => {
                const isSelected = selectedTone === tone.id;
                return (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => onToneChange(tone.id)}
                    id={`tone-opt-${tone.id}`}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    {tone.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Engine 2: Browser Web Speech Controls */}
      {engine === "browser" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-neutral-800 mb-2">
              সিস্টেম ভয়েস তালিকা
            </label>
            {browserVoices.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                ব্রাউজারের ভয়েস তালিকা লোড হচ্ছে অথবা আপনার ডিভাইসে বাংলা TTS ভয়েস ইনস্টল করা আছে কিনা চেক করুন।
              </div>
            ) : (
              <select
                value={selectedBrowserVoiceIndex}
                onChange={(e) => onBrowserVoiceChange(Number(e.target.value))}
                id="select-browser-voice"
                className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {browserVoices.map((voice, idx) => {
                  const isBangla =
                    voice.lang.toLowerCase().includes("bn") ||
                    voice.name.toLowerCase().includes("bangla") ||
                    voice.name.toLowerCase().includes("bengali");
                  return (
                    <option key={`${voice.name}-${idx}`} value={idx}>
                      {isBangla ? "🇧🇩 " : ""}
                      {voice.name} ({voice.lang})
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          {/* Rate and Pitch Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-1.5">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                  গতি (Speed):
                </span>
                <span className="font-mono text-neutral-900">{rate.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.8"
                step="0.1"
                value={rate}
                onChange={(e) => onRateChange(parseFloat(e.target.value))}
                id="slider-speech-rate"
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-2xs text-neutral-400 mt-1 font-sans">
                <span>০.৫x (ধীর)</span>
                <span>১.০x (স্বাভাবিক)</span>
                <span>১.৮x (দ্রুত)</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-1.5">
                <span>পিচ (Pitch):</span>
                <span className="font-mono text-neutral-900">{pitch.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.5"
                step="0.1"
                value={pitch}
                onChange={(e) => onPitchChange(parseFloat(e.target.value))}
                id="slider-speech-pitch"
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-2xs text-neutral-400 mt-1 font-sans">
                <span>০.৬x (ভারী)</span>
                <span>১.০x (স্বাভাবিক)</span>
                <span>১.৫x (উচ্চ)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
