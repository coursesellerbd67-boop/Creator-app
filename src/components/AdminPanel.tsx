import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Unlock,
  Sliders,
  Cpu,
  Save,
  RotateCcw,
  Download,
  AlertTriangle,
  Activity,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { AdminConfig } from "../types";

interface AdminPanelProps {
  config: AdminConfig;
  onUpdateConfig: (newConfig: Partial<AdminConfig>) => void;
  onAuthenticate: (success: boolean) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  config,
  onUpdateConfig,
  onAuthenticate,
}) => {
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Local form states
  const [selectedModel, setSelectedModel] = useState(config.activeModel);
  const [sysPrompt, setSysPrompt] = useState(config.systemPrompt);
  const [temp, setTemp] = useState(config.temperature);
  const [credits, setCredits] = useState(config.creditBalance);
  const [safety, setSafety] = useState(config.safetyLevel);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 7860 or 'admin'
    if (pinInput === "7860" || pinInput.toLowerCase() === "admin" || pinInput === "mama") {
      onAuthenticate(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSave = () => {
    onUpdateConfig({
      activeModel: selectedModel,
      systemPrompt: sysPrompt,
      temperature: temp,
      creditBalance: credits,
      safetyLevel: safety,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportBackup = () => {
    const dataStr = JSON.stringify(
      { config, exportedAt: new Date().toISOString() },
      null,
      2
    );
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-studio-admin-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!config.isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-neutral-900 font-['Hind_Siliguri',sans-serif]">
              অ্যাডমিন কন্ট্রোল সেন্টারে প্রবেশ
            </h2>
            <p className="text-xs text-neutral-500 font-['Hind_Siliguri',sans-serif]">
              এই সিস্টেমের মাস্টার কন্ট্রোল শুধুমাত্র অ্যাডমিনের হাতে সংরক্ষিত।
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                মাস্টার অ্যাডমিন পিন (PIN / পাসওয়ার্ড)
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="পিন লিখুন (ডিফল্ট: 7860 বা mama)"
                className={`w-full p-3 rounded-xl border text-sm text-center font-mono tracking-widest focus:outline-none ${
                  pinError
                    ? "border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-neutral-200 focus:border-neutral-900"
                }`}
              />
              {pinError && (
                <p className="text-[11px] text-red-600 mt-1 text-center font-['Hind_Siliguri',sans-serif]">
                  ভুল পিন! দয়া করে সঠিক পিন দিন (টেস্টিং পিন: 7860 বা mama)।
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-semibold text-xs transition-all shadow-sm cursor-pointer"
            >
              অ্যাডমিন হিসেবে লগইন করুন
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-100 text-[11px] text-neutral-400">
            ডিফল্ট অ্যাডমিন কি: <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-700">7860</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-neutral-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>মাস্টার অ্যাডমিন মোড সক্রিয়</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Hind_Siliguri',sans-serif]">
              অ্যাডমিন কন্ট্রোল সিস্টেম
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-['Hind_Siliguri',sans-serif]">
              এআই মডেল কনফিগারেশন, সিস্টেম প্রম্পট পার্সোনালিটি ও রিসোর্স
              ম্যানেজমেন্ট।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackup}
              className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>কনফিগ ব্যাকআপ</span>
            </button>
            <button
              onClick={() => onAuthenticate(false)}
              className="px-3.5 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-xl text-xs font-semibold border border-red-500/30 transition-colors"
            >
              লগআউট
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Core AI Model Configuration */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 font-['Hind_Siliguri',sans-serif]">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>মূল এআই ইঞ্জিন ও মডেল নির্বাচন</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  সক্রিয় মডেল (Active Model)
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs bg-neutral-50 focus:outline-none"
                >
                  <option value="gemini-3.8-flash">
                    Gemini 3.8 Flash (সুপার ফাস্ট, স্মার্ট ও স্ট্যান্ডার্ড)
                  </option>
                  <option value="gemini-3.1-pro-preview">
                    Gemini 3.1 Pro (ডিপ লজিক, কোডিং ও হাই রিজনিং)
                  </option>
                  <option value="gemini-3.1-flash-tts-preview">
                    Gemini 3.1 Flash TTS (নিউরাল বাংলা ভয়েস স্পিচ)
                  </option>
                </select>
              </div>

              {/* Temperature */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1 font-semibold text-neutral-700">
                  <span>ক্রিয়েটিভিটি লেভেল (Temperature):</span>
                  <span className="font-mono text-emerald-700">{temp}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-neutral-400">
                  <span>সুনির্দিষ্ট ও তথ্যবহুল (0.0)</span>
                  <span>সৃজনশীল ও উন্মুক্ত (1.0)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Master System Prompt */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-neutral-900 font-['Hind_Siliguri',sans-serif] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>মাস্টার সিস্টেম প্রম্পট ও পার্সোনালিটি</span>
              </span>
              <button
                onClick={() =>
                  setSysPrompt(
                    "You are an affectionate, exceptionally genius AI partner. Your tone is respectful, insightful, and brilliant. You can do tasks spanning website building, app prototyping, autonomous agent workflow, voiceover synthesis, video storyboarding, and coding with utmost craftsmanship."
                  )
                }
                className="text-[11px] text-neutral-500 hover:text-neutral-800"
              >
                রিসেট করুন
              </button>
            </div>

            <textarea
              value={sysPrompt}
              onChange={(e) => setSysPrompt(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-xl border border-neutral-200 text-xs font-mono focus:border-neutral-900 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>সেটিংস সেভ করুন</span>
            </button>

            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-700 animate-fade-in">
                ✓ সকল সেটিংস সফলভাবে আপডেট হয়েছে!
              </span>
            )}
          </div>
        </div>

        {/* Right Col: Quota, Safety & Activity Log */}
        <div className="space-y-6">
          {/* Credit & Rate Limits */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider font-['Hind_Siliguri',sans-serif]">
              রিসোর্স ও লিমিট কন্ট্রোল
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-600 block mb-1">
                  ক্রেডিট ব্যালেন্স
                </label>
                <input
                  type="number"
                  value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-neutral-200 font-semibold"
                />
              </div>

              <div>
                <label className="text-neutral-600 block mb-1">
                  কনটেন্ট সেফটি লেভেল
                </label>
                <select
                  value={safety}
                  onChange={(e) => setSafety(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-neutral-200 bg-neutral-50"
                >
                  <option value="standard">স্ট্যান্ডার্ড ফিল্টারিং</option>
                  <option value="strict">কড়া ফিল্টারিং (Strict)</option>
                  <option value="permissive">ওপেন / ফ্লেক্সিবল</option>
                </select>
              </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 font-['Hind_Siliguri',sans-serif]">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>লাইভ এক্টিভিটি ও অডিট লগ</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto text-[11px]">
              {config.activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2 rounded-lg bg-neutral-50 border border-neutral-200 space-y-0.5"
                >
                  <div className="flex items-center justify-between text-neutral-900 font-semibold">
                    <span>{log.action}</span>
                    <span className="text-neutral-400 font-mono text-[10px]">
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-neutral-500 line-clamp-1">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
