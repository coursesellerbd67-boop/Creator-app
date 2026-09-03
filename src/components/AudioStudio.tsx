import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Sparkles,
  Volume2,
  Download,
  Play,
  Square,
  RefreshCw,
  Clock,
  History,
} from "lucide-react";
import { VoiceOption, ToneOption, PresetQuote } from "../types";
import { PRESET_QUOTES, TONE_OPTIONS, USER_DEFAULT_TEXT } from "../data/presets";
import { VoiceSelector } from "./VoiceSelector";
import { AudioWaveform } from "./AudioWaveform";
import { AudioPlayerBar } from "./AudioPlayerBar";

interface AudioStudioProps {
  initialText?: string;
  hasGeminiKey: boolean;
}

interface AudioHistoryItem {
  id: string;
  text: string;
  audioUrl: string;
  voice: string;
  timestamp: string;
}

export const AudioStudio: React.FC<AudioStudioProps> = ({
  initialText = "",
  hasGeminiKey,
}) => {
  const [inputText, setInputText] = useState(initialText || USER_DEFAULT_TEXT);
  const [engine, setEngine] = useState<"gemini" | "browser">(hasGeminiKey ? "gemini" : "browser");
  const [geminiVoices, setGeminiVoices] = useState<VoiceOption[]>([
    { id: "Kore", name: "কোরি (Kore - সুমধুর ও শান্ত)", gender: "Female", tone: "Calm, soothing, natural" },
    { id: "Fenrir", name: "ফেনরির (Fenrir - গম্ভীর ও বলিষ্ঠ)", gender: "Male", tone: "Deep, resonant, authoritative" },
    { id: "Puck", name: "পাক (Puck - প্রাণবন্ত ও তারুণ্যদীপ্ত)", gender: "Male", tone: "Energetic, expressive" },
    { id: "Zephyr", name: "জেফির (Zephyr - স্পষ্ট ও মার্জিত)", gender: "Female", tone: "Clear, graceful, articulate" },
    { id: "Charon", name: "শ্যারন (Charon - ধীরস্থির ও গম্ভীর)", gender: "Male", tone: "Reflective, serious, measured" },
  ]);
  const [selectedVoice, setSelectedVoice] = useState("Fenrir");
  const [selectedTone, setSelectedTone] = useState("islamic");
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedBrowserVoiceIndex, setSelectedBrowserVoiceIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [history, setHistory] = useState<AudioHistoryItem[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load browser speech voices
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setBrowserVoices(voices);
        const bnIdx = voices.findIndex((v) => v.lang.startsWith("bn"));
        if (bnIdx !== -1) setSelectedBrowserVoiceIndex(bnIdx);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Update initialText if prop changes
  useEffect(() => {
    if (initialText) {
      setInputText(initialText);
    }
  }, [initialText]);

  const handleGenerateVoice = async () => {
    if (!inputText.trim()) return;

    if (engine === "browser") {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(inputText);
      if (browserVoices[selectedBrowserVoiceIndex]) {
        utterance.voice = browserVoices[selectedBrowserVoiceIndex];
      }
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      return;
    }

    // Gemini Neural TTS via server
    setIsGenerating(true);
    try {
      const tone = TONE_OPTIONS.find((t) => t.id === selectedTone);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText.trim(),
          voiceName: selectedVoice,
          tonePrompt: tone?.promptInstruction,
        }),
      });

      const data = await res.json();
      if (data.success && data.audioBase64) {
        setAudioBase64(data.audioBase64);
        const audioSrc = `data:audio/wav;base64,${data.audioBase64}`;
        setAudioUrl(audioSrc);

        // Add to history
        const newItem: AudioHistoryItem = {
          id: String(Date.now()),
          text: inputText.slice(0, 60) + (inputText.length > 60 ? "..." : ""),
          audioUrl: audioSrc,
          voice: selectedVoice,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setHistory((prev) => [newItem, ...prev.slice(0, 9)]);

        // Auto play
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        }, 100);
      }
    } catch (err) {
      console.error("TTS error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStopAudio = () => {
    if (engine === "browser" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Hidden audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={() => {
            if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) setDuration(audioRef.current.duration);
          }}
        />
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-emerald-700 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
              <Mic className="w-3.5 h-3.5" />
              <span>বাংলা ও বহুভাষিক টেক্সট-টু-স্পিচ (TTS)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Hind_Siliguri',sans-serif]">
              বাংলা ভয়েস স্টুডিও
            </h1>
            <p className="text-xs sm:text-sm text-purple-100 max-w-xl font-['Hind_Siliguri',sans-serif]">
              ইসলামিক বয়ান/ওয়াজ, খবর পাঠ, কিংবা গল্পের জন্য স্পষ্ট ও স্বাভাবিক
              বাংলা অডিও তৈরি করুন।
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold">
            <span>কণ্ঠ: {selectedVoice}</span> •{" "}
            <span>
              {TONE_OPTIONS.find((t) => t.id === selectedTone)?.label || "স্বাভাবিক"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Text Input & Presets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider font-['Hind_Siliguri',sans-serif] flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-purple-600" />
                <span>টেক্সট বা বয়ান লিখুন</span>
              </label>
              <span className="text-xs text-neutral-400 font-mono">
                {inputText.length} অক্ষর
              </span>
            </div>

            <textarea
              id="voice-input-textarea"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={5}
              placeholder="এখানে বাংলা বা ইংরেজি টেক্সট লিখুন..."
              className="w-full p-3.5 text-sm rounded-xl border border-neutral-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none resize-none font-['Hind_Siliguri',sans-serif] leading-relaxed"
            />

            {/* Quick Sample Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-neutral-500 font-['Hind_Siliguri',sans-serif]">
                নমুনা টেক্সট থেকে চেষ্টা করুন:
              </span>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {PRESET_QUOTES.map((quote) => (
                  <button
                    key={quote.id}
                    onClick={() => {
                      setInputText(quote.text);
                      if (quote.suggestedVoice) setSelectedVoice(quote.suggestedVoice);
                      if (quote.suggestedTone) setSelectedTone(quote.suggestedTone);
                    }}
                    className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[11px] font-['Hind_Siliguri',sans-serif]"
                  >
                    {quote.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={handleStopAudio}
                disabled={!isPlaying}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
              >
                <Square className="w-3.5 h-3.5" />
                <span>থামান</span>
              </button>

              <button
                id="generate-voice-btn"
                onClick={handleGenerateVoice}
                disabled={isGenerating || !inputText.trim()}
                className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>ভয়েস জেনারেট হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>ভয়েস তৈরি ও শুনুন</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Waveform and Audio Player */}
          {audioBase64 && (
            <div className="bg-white rounded-2xl p-5 border border-purple-200 shadow-xs space-y-4">
              <AudioPlayerBar
                audioBase64={audioBase64}
                voiceName={selectedVoice}
              />
            </div>
          )}

          {/* Audio History */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700">
                <History className="w-4 h-4 text-neutral-500" />
                <span>সাম্প্রতিক তৈরি করা ভয়েস ({history.length})</span>
              </div>
              <div className="space-y-1.5">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="truncate">
                      <div className="font-semibold text-neutral-900 truncate">
                        {item.text}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        কণ্ঠ: {item.voice} • {item.timestamp}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setAudioUrl(item.audioUrl);
                        setTimeout(() => {
                          if (audioRef.current) {
                            audioRef.current.currentTime = 0;
                            audioRef.current.play();
                          }
                        }, 50);
                      }}
                      className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 shrink-0"
                      title="পুনরায় শুনুন"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Voice & Tone Selector */}
        <div className="space-y-4">
          <VoiceSelector
            engine={engine}
            onEngineChange={setEngine}
            geminiVoices={geminiVoices}
            selectedVoice={selectedVoice}
            onVoiceChange={setSelectedVoice}
            selectedTone={selectedTone}
            onToneChange={setSelectedTone}
            toneOptions={TONE_OPTIONS}
            browserVoices={browserVoices}
            selectedBrowserVoiceIndex={selectedBrowserVoiceIndex}
            onBrowserVoiceChange={setSelectedBrowserVoiceIndex}
            rate={rate}
            onRateChange={setRate}
            pitch={pitch}
            onPitchChange={setPitch}
          />
        </div>
      </div>
    </div>
  );
};
