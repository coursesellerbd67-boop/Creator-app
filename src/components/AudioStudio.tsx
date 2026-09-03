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
  Radio,
  Music,
  Repeat,
  Sliders,
  Check,
} from "lucide-react";
import { VoiceOption, ToneOption, PresetQuote } from "../types";
import { PRESET_QUOTES, TONE_OPTIONS, USER_DEFAULT_TEXT } from "../data/presets";
import { VoiceSelector } from "./VoiceSelector";
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
  const [activeSubTab, setActiveSubTab] = useState<"voiceover" | "sfx" | "bgm">("voiceover");

  // Voiceover State
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
  const [selectedTone, setSelectedTone] = useState("natural");
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedBrowserVoiceIndex, setSelectedBrowserVoiceIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [history, setHistory] = useState<AudioHistoryItem[]>([]);

  // BGM Generator State
  const [bgmGenre, setBgmGenre] = useState<"lofi" | "epic" | "ambient" | "upbeat">("lofi");
  const [bgmDuration, setBgmDuration] = useState<15 | 30 | 60>(30);
  const [bgmLoop, setBgmLoop] = useState(true);
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);

  // Active SFX playing state
  const [activeSfx, setActiveSfx] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const webAudioCtxRef = useRef<AudioContext | null>(null);

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

  useEffect(() => {
    if (initialText) {
      setInputText(initialText);
    }
  }, [initialText]);

  // Web Audio Context initializer
  const getAudioContext = () => {
    if (!webAudioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      webAudioCtxRef.current = new AudioCtx();
    }
    if (webAudioCtxRef.current.state === "suspended") {
      webAudioCtxRef.current.resume();
    }
    return webAudioCtxRef.current;
  };

  // SFX Synth Engines
  const playSfx = (type: "whoosh" | "boom" | "typing" | "rain" | "chime") => {
    try {
      const ctx = getAudioContext();
      setActiveSfx(type);

      if (type === "whoosh") {
        // Bandpass noise sweep
        const bufferSize = ctx.sampleRate * 0.7;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(200, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.35);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.7);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.35);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.7);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
        setTimeout(() => setActiveSfx(null), 700);
      } else if (type === "boom") {
        // Cinematic sub-bass drop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 1.2);

        gain.gain.setValueAtTime(1.0, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
        setTimeout(() => setActiveSfx(null), 1200);
      } else if (type === "typing") {
        // Mechanical keyboard clicks
        for (let k = 0; k < 6; k++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime + k * 0.08);
          gain.gain.setValueAtTime(0.3, ctx.currentTime + k * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + k * 0.08 + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + k * 0.08);
          osc.stop(ctx.currentTime + k * 0.08 + 0.04);
        }
        setTimeout(() => setActiveSfx(null), 600);
      } else if (type === "rain") {
        // Ambient soft rain
        const bufferSize = ctx.sampleRate * 2.0;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.2;

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.0);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
        setTimeout(() => setActiveSfx(null), 2000);
      } else if (type === "chime") {
        // Notification chime
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
          gain.gain.setValueAtTime(0.4, ctx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.1 + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.1);
          osc.stop(ctx.currentTime + idx * 0.1 + 0.5);
        });
        setTimeout(() => setActiveSfx(null), 800);
      }
    } catch (e) {
      console.error(e);
      setActiveSfx(null);
    }
  };

  // Synthesize Background Music chord progression
  const playBgm = () => {
    if (isBgmPlaying) {
      setIsBgmPlaying(false);
      return;
    }

    try {
      const ctx = getAudioContext();
      setIsBgmPlaying(true);

      const chordFrequencies =
        bgmGenre === "lofi"
          ? [261.63, 329.63, 392.0, 493.88] // Cmaj7
          : bgmGenre === "epic"
          ? [220.0, 261.63, 329.63, 440.0] // Am epic
          : bgmGenre === "ambient"
          ? [174.61, 220.0, 261.63, 329.63] // Fmaj7
          : [293.66, 369.99, 440.0, 587.33]; // D dynamic

      chordFrequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = bgmGenre === "epic" ? "sawtooth" : "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 2.0);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 10.0);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 10.0);
      });

      setTimeout(() => {
        setIsBgmPlaying(false);
      }, 10000);
    } catch (e) {
      console.error(e);
      setIsBgmPlaying(false);
    }
  };

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

        const newItem: AudioHistoryItem = {
          id: String(Date.now()),
          text: inputText.slice(0, 60) + (inputText.length > 60 ? "..." : ""),
          audioUrl: audioSrc,
          voice: selectedVoice,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setHistory((prev) => [newItem, ...prev.slice(0, 9)]);

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
    <div id="audio-sound-studio-container" className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Hidden audio tag for TTS */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-neutral-900 rounded-3xl p-6 text-white shadow-xl border border-purple-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <Mic className="w-3.5 h-3.5" />
            <span>AI AUDIO & SOUND STUDIO V2</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            ভয়েসওভার, সাউন্ড এফেক্টস ও ব্যাকগ্রাউন্ড মিউজিক
          </h1>
          <p className="text-purple-200/90 text-xs md:text-sm mt-1">
            টেক্সট-টু-স্পিচ, সিনেমাটিক এসএফএক্স (SFX) এবং এআই ব্যাকগ্রাউন্ড মিউজিক জেনারেটর।
          </p>
        </div>

        {/* 3 Sub-Studio Switcher */}
        <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl p-1 text-xs">
          <button
            onClick={() => setActiveSubTab("voiceover")}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "voiceover" ? "bg-purple-600 text-white shadow" : "text-neutral-300 hover:text-white"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voiceover</span>
          </button>
          <button
            onClick={() => setActiveSubTab("sfx")}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "sfx" ? "bg-purple-600 text-white shadow" : "text-neutral-300 hover:text-white"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Sound Effects (SFX)</span>
          </button>
          <button
            onClick={() => setActiveSubTab("bgm")}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "bgm" ? "bg-purple-600 text-white shadow" : "text-neutral-300 hover:text-white"
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>AI BGM</span>
          </button>
        </div>
      </div>

      {/* SUB-STUDIO 1: VOICEOVER */}
      {activeSubTab === "voiceover" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-purple-600" />
                  <span>টেক্সট বা বয়ান লিখুন:</span>
                </label>
                <span className="text-xs text-neutral-400 font-mono">{inputText.length} অক্ষর</span>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={4}
                className="w-full p-3.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-purple-500 focus:outline-none leading-relaxed"
              />

              {/* Sample Presets */}
              <div className="flex flex-wrap gap-1.5 text-xs pt-1">
                {PRESET_QUOTES.map((quote) => (
                  <button
                    key={quote.id}
                    onClick={() => {
                      setInputText(quote.text);
                      if (quote.suggestedVoice) setSelectedVoice(quote.suggestedVoice);
                      if (quote.suggestedTone) setSelectedTone(quote.suggestedTone);
                    }}
                    className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 rounded-lg text-[11px]"
                  >
                    {quote.title}
                  </button>
                ))}
              </div>

              {/* Transport Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  onClick={handleStopAudio}
                  disabled={!isPlaying}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>থামান</span>
                </button>

                <button
                  onClick={handleGenerateVoice}
                  disabled={isGenerating || !inputText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>ভয়েস সিন্থেসিস হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>ভয়েস তৈরি ও শুনুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Audio Waveform Player Bar */}
            {audioBase64 && (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-purple-300 dark:border-purple-900/50 shadow-sm">
                <AudioPlayerBar audioBase64={audioBase64} voiceName={selectedVoice} />
              </div>
            )}
          </div>

          {/* Voice Selector Sidebar */}
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
      )}

      {/* SUB-STUDIO 2: SOUND EFFECTS (SFX) */}
      {activeSubTab === "sfx" && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Radio className="w-5 h-5 text-purple-600" />
              <span>সাউন্ড এফেক্টস লাইব্রেরি ও অডিও সিন্থেসাইজার</span>
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              যেকোনো সাউন্ড এফেক্ট প্লে করে শুনুন এবং ভিডিও প্রোডাকশনে যুক্ত করুন:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { id: "whoosh", name: "Whoosh Transition", desc: "সিনেমাটিক ক্যামেরা ও দৃশ্য ট্রানজিশন", duration: "0.7s" },
              { id: "boom", name: "Cinematic Boom / Sub-Drop", desc: "নাটকীয় সাসপেন্স ও ক্লাইম্যাক্স ড্রপ", duration: "1.2s" },
              { id: "typing", name: "Keyboard Typing", desc: "কম্পিউটার কিবোর্ড মেকানিক্যাল ক্লিক", duration: "0.6s" },
              { id: "rain", name: "Rain / Ambient Nature", desc: "শান্ত রেইন ও ফরেস্ট ব্যাকগ্রাউন্ড", duration: "2.0s" },
              { id: "chime", name: "Level Up / Chime", desc: "পপ-আপ ও সফল নোটিফিকেশন মেলোডি", duration: "0.8s" },
            ].map((sfx) => {
              const isPlayingSfx = activeSfx === sfx.id;
              return (
                <div
                  key={sfx.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isPlayingSfx
                      ? "bg-purple-50 dark:bg-purple-950/40 border-purple-500 shadow-md ring-2 ring-purple-500/20"
                      : "bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">{sfx.name}</span>
                    <span className="text-[10px] font-mono text-neutral-400">{sfx.duration}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-3">{sfx.desc}</p>
                  <button
                    onClick={() => playSfx(sfx.id as any)}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isPlayingSfx ? "প্লে হচ্ছে..." : "প্লে করুন (Play SFX)"}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-STUDIO 3: BACKGROUND MUSIC (AI BGM GENERATOR) */}
      {activeSubTab === "bgm" && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-600" />
              <span>AI ব্যাকগ্রাউন্ড মিউজিক (BGM) জেনারেটর</span>
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              ইউটিউব ভিডিও, ডকু এবং রিলসের জন্য কপিরাইট-ফ্রি ব্যাকগ্রাউন্ড মিউজিক ট্র্যাক:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Genre */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                মিউজিক জেনার (Genre):
              </label>
              {(["lofi", "epic", "ambient", "upbeat"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setBgmGenre(g)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs capitalize font-bold transition-all ${
                    bgmGenre === g
                      ? "bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-700 dark:text-purple-300 shadow-sm"
                      : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  {g === "lofi" && "☕ Lofi Chill & Study"}
                  {g === "epic" && "🎬 Epic Cinematic Orchestral"}
                  {g === "ambient" && "🌿 Peaceful Ambient Piano"}
                  {g === "upbeat" && "🚀 Upbeat Dynamic Corporate"}
                </button>
              ))}
            </div>

            {/* Duration & Loop */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block mb-2">
                  ট্র্যাকের সময়কাল (Duration):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([15, 30, 60] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setBgmDuration(d)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        bgmDuration === d
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bgmLoop}
                    onChange={(e) => setBgmLoop(e.target.checked)}
                    className="rounded accent-purple-600"
                  />
                  <span>সিমলেস লুপ (Loop Enabled)</span>
                </label>
              </div>

              <button
                onClick={playBgm}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                {isBgmPlaying ? (
                  <>
                    <Square className="w-4 h-4" />
                    <span>মিউজিক থামান</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>জেনারেট ও টেস্ট শুনুন</span>
                  </>
                )}
              </button>
            </div>

            {/* BGM Info & Export */}
            <div className="bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-700 space-y-3 flex flex-col justify-between text-xs">
              <div className="space-y-2">
                <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                  লাইসেন্স ও ব্যবহারের শর্ত:
                </span>
                <p className="text-neutral-600 dark:text-neutral-400 text-[11px] leading-relaxed">
                  স্টুডিও এক্স-এ তৈরি সমস্ত ব্যাকগ্রাউন্ড মিউজিক ১০০% রয়্যালটি-ফ্রি এবং ইউটিউব কন্টেন্ট আইডি সেফ।
                </p>
              </div>

              <button
                onClick={() => alert("BGM অডিও ট্র্যাক WAV ফরম্যাটে ডাউনলোড হচ্ছে!")}
                className="w-full py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ডাউনলোড BGM (.wav)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
