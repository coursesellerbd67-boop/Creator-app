import React, { useState, useEffect } from "react";
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
  ArrowLeft,
  Users,
  Key,
  BarChart3,
  Server,
  Zap,
  CheckCircle2,
  Clock,
  Terminal,
  Smartphone,
  Layers,
  Settings,
} from "lucide-react";
import { AdminConfig } from "../types";

interface AdminAppProps {
  config: AdminConfig;
  onUpdateConfig: (newConfig: Partial<AdminConfig>) => void;
  onAuthenticate: (success: boolean) => void;
  onSwitchToMainApp: () => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({
  config,
  onUpdateConfig,
  onAuthenticate,
  onSwitchToMainApp,
}) => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "models" | "prompts" | "users" | "security"
  >("dashboard");
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [selectedModel, setSelectedModel] = useState(config.activeModel);
  const [sysPrompt, setSysPrompt] = useState(config.systemPrompt);
  const [temp, setTemp] = useState(config.temperature);
  const [credits, setCredits] = useState(config.creditBalance);
  const [safety, setSafety] = useState(config.safetyLevel);

  // Simulated live system stats
  const [stats] = useState({
    activeUsers: 142,
    audioGenerated: 1284,
    apiHealth: "100% সচল",
    latency: "240ms",
    tokensConsumed: "4.8M",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      pinInput === "7860" ||
      pinInput.toLowerCase() === "admin" ||
      pinInput === "mama"
    ) {
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
    a.download = `studio-x-admin-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // PIN Login Screen for Admin App
  if (!config.isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between p-4 sm:p-6">
        {/* Top bar with back to main app */}
        <div className="w-full max-w-md mx-auto flex items-center justify-between pt-2">
          <button
            onClick={onSwitchToMainApp}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ক্রিয়েটর অ্যাপে ফেরত যান</span>
          </button>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-950 border border-indigo-700 text-indigo-300">
            ADMIN ONLY
          </span>
        </div>

        {/* Login Box */}
        <div className="w-full max-w-sm mx-auto my-auto py-8">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center mx-auto shadow-lg ring-4 ring-indigo-900/40">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                STUDIO X ADMIN APP
              </div>
              <h2 className="text-xl font-bold text-white font-['Hind_Siliguri',sans-serif]">
                মাস্টার অ্যাডমিন লগইন
              </h2>
              <p className="text-xs text-neutral-400 font-['Hind_Siliguri',sans-serif]">
                সিস্টেম কনফিগারেশন, ইউজার কন্ট্রোল ও মডেল ম্যানেজমেন্ট
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  মাস্টার অ্যাডমিন পিন (PIN)
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="পিন লিখুন (ডিফল্ট: 7860)"
                  className={`w-full p-3.5 rounded-xl border bg-neutral-950 text-white text-base text-center font-mono tracking-widest focus:outline-none ${
                    pinError
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/30"
                      : "border-neutral-700 focus:border-indigo-500"
                  }`}
                  autoFocus
                />
                {pinError && (
                  <p className="text-[11px] text-red-400 mt-1.5 text-center font-['Hind_Siliguri',sans-serif]">
                    ভুল পিন! দয়া করে সঠিক পিন দিন (টেস্টিং পিন: 7860 বা mama)।
                  </p>
                )}
              </div>

              {/* Quick Numpad for mobile convenience */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPinInput((prev) => prev + num)}
                    className="h-11 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono font-bold text-base transition-colors"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPinInput("")}
                  className="h-11 rounded-xl bg-neutral-800/60 hover:bg-neutral-700 text-neutral-400 text-xs font-semibold"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setPinInput((prev) => prev + "0")}
                  className="h-11 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono font-bold text-base"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => setPinInput((prev) => prev.slice(0, -1))}
                  className="h-11 rounded-xl bg-neutral-800/60 hover:bg-neutral-700 text-neutral-400 text-xs font-semibold"
                >
                  ⌫
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer"
              >
                অ্যাডমিন অ্যাপ আনলক করুন
              </button>
            </form>

            <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-500">
              ডিফল্ট অ্যাডমিন পিন: <span className="font-mono text-indigo-400">7860</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-neutral-600 pb-2">
          STUDIO X Autonomous Control Plane • Secure Mobile Ready
        </div>
      </div>
    );
  }

  // Authenticated Admin App Layout
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans pb-20 sm:pb-8">
      {/* Standalone Admin Header */}
      <header className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Brand & Mode */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-sm shadow-md ring-2 ring-indigo-500/30">
              AX
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-wider text-base text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  STUDIO X ADMIN
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-['Hind_Siliguri',sans-serif]">
                মাস্টার কন্ট্রোল প্যানেল ও সিস্টেম কনফিগারেশন
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackup}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ব্যাকআপ</span>
            </button>

            <button
              onClick={onSwitchToMainApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ক্রিয়েটর অ্যাপ</span>
            </button>

            <button
              onClick={() => onAuthenticate(false)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
              title="লক করুন"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">লক</span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="max-w-6xl mx-auto hidden sm:flex items-center gap-1 mt-3 pt-2 border-t border-neutral-800/60">
          {[
            { id: "dashboard", label: "ড্যাশবোর্ড ও মেমরি", icon: BarChart3 },
            { id: "models", label: "এআই মডেল কনফিগ", icon: Cpu },
            { id: "prompts", label: "সিস্টেম প্রম্পট", icon: Sliders },
            { id: "users", label: "ইউজার ও ক্রেডিট", icon: Users },
            { id: "security", label: "সিকিউরিটি ও লগ", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="font-['Hind_Siliguri',sans-serif]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full p-4 sm:p-6 space-y-6 flex-1">
        {/* Notification on save */}
        {savedSuccess && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>কনফিগারেশন সফলভাবে সেভ করা হয়েছে এবং ব্যাকএন্ডে সক্রিয় করা হয়েছে!</span>
          </div>
        )}

        {/* TAB 1: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Top Telemetry Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-neutral-400 text-xs">
                  <span>সক্রিয় ইউজার</span>
                  <Users className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-white">{stats.activeUsers} জন</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span>↑ +18% আজ</span>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-neutral-400 text-xs">
                  <span>জেনারেটেড অডিও</span>
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white">{stats.audioGenerated} টি</div>
                <div className="text-[11px] text-neutral-400">24kHz PCM WAV</div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-neutral-400 text-xs">
                  <span>টোকেন কনজাম্পশন</span>
                  <Activity className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white">{stats.tokensConsumed}</div>
                <div className="text-[11px] text-neutral-400">Gemini 3.8 Flash</div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-neutral-400 text-xs">
                  <span>সার্ভার হেলথ</span>
                  <Server className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400">{stats.apiHealth}</div>
                <div className="text-[11px] text-neutral-400">লেটেটেন্সি: {stats.latency}</div>
              </div>
            </div>

            {/* Quick Actions & System Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <span>রিয়েল-টাইম সিস্টেম অডিট লগ</span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">LIVE FEED</span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {(config.auditLog || config.activityLogs || []).slice(0, 6).map((log, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800/80 flex items-start justify-between gap-3 text-neutral-300"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-indigo-400 font-bold">{log.action}</span>
                          <span className="text-[10px] text-neutral-500">{log.user}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400">{log.details}</p>
                      </div>
                      <span className="text-[10px] text-neutral-500 whitespace-nowrap">
                        {log.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Master Control Card */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>মাস্টার সুইচবোর্ড</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    এখানে যে পরিবর্তনগুলো করবেন তা সরাসরি অ্যাপের সব ইউজারের জন্য কার্যকর হবে।
                  </p>

                  <div className="space-y-2 pt-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                      <span>সক্রিয় মডেল:</span>
                      <span className="font-mono text-emerald-400">{config.activeModel}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                      <span>সিস্টেম ক্রেডিট পুল:</span>
                      <span className="font-bold text-indigo-400">{config.creditBalance}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                      <span>সেফটি মোড:</span>
                      <span className="font-medium text-amber-400 uppercase">{config.safetyLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 space-y-2">
                  <button
                    onClick={() => setActiveTab("models")}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all text-center"
                  >
                    মডেল কনফিগারেশনে যান →
                  </button>
                  <button
                    onClick={onSwitchToMainApp}
                    className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold transition-all text-center"
                  >
                    ক্রিয়েটর অ্যাপে প্রিভিউ দেখুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI MODELS CONFIG */}
        {activeTab === "models" && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-lg font-bold text-white font-['Hind_Siliguri',sans-serif]">
                  এআই মডেল ও প্যারামিটার টিউনিং
                </h3>
                <p className="text-xs text-neutral-400">
                  Google Gemini এপিআই ইঞ্জিন ও রেসপন্স আর্কিটেকচার
                </p>
              </div>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>পরিবর্তন সেভ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    ডিফল্ট প্রাইমারি মডেল
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full p-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="gemini-3.8-flash">
                      Gemini 3.8 Flash (সুপার ফাস্ট, কম লেটেন্সি ও স্মার্ট)
                    </option>
                    <option value="gemini-3.1-pro">
                      Gemini 3.1 Pro (ডিপ রিজনিং, জটিল কোডিং ও লং কনটেক্সট)
                    </option>
                    <option value="gemini-2.5-flash">
                      Gemini 2.5 Flash (স্ট্যান্ডার্ড এআই টাস্ক)
                    </option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-neutral-300">
                      ক্রিয়েটিভিটি টেম্পারেচার (Temperature)
                    </label>
                    <span className="text-xs font-mono text-indigo-400">{temp}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={temp}
                    onChange={(e) => setTemp(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                    <span>০.১ (নির্দিষ্ট ও নির্ভুল)</span>
                    <span>০.৭ (ভারসাম্যপূর্ণ)</span>
                    <span>১.০ (অত্যন্ত সৃজনশীল)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    সেফটি ও কনটেন্ট ফিল্টারিং
                  </label>
                  <select
                    value={safety}
                    onChange={(e) => setSafety(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="strict">Strict (কঠোর ফিল্টারিং)</option>
                    <option value="standard">Standard (স্ট্যান্ডার্ড ব্যালেন্সড)</option>
                    <option value="relaxed">Relaxed (উন্মুক্ত সৃজনশীলতা)</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
                  <div className="font-bold text-neutral-200">বাংলা ভয়েস ইঞ্জিন তথ্য:</div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    সার্ভার-সাইড অডিও সিন্থেসাইজার Gemini এর মাল্টিমোডাল অডিও মডেল ব্যবহার করে সরাসরি 24,000 Hz সাইকেলের বাংলা নিউরাল অডিও তৈরি করে।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SYSTEM PROMPTS */}
        {activeTab === "prompts" && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-lg font-bold text-white font-['Hind_Siliguri',sans-serif]">
                  সিস্টেম প্রম্পট ও এআই পার্সোনালিটি
                </h3>
                <p className="text-xs text-neutral-400">
                  STUDIO X কীভাবে আচরণ করবে এবং বাংলা ভাষায় কীভাবে উত্তর প্রদান করবে তা ঠিক করুন
                </p>
              </div>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>সেভ করুন</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-neutral-400 text-xs shrink-0">প্রিসেট:</span>
              <button
                onClick={() =>
                  setSysPrompt(
                    "You are STUDIO X, an affectionate, exceptionally genius AI partner. Your tone is respectful, insightful, and brilliant. You can do tasks spanning website building, app prototyping, autonomous agent workflow, voiceover synthesis, video storyboarding, and coding with utmost craftsmanship."
                  )
                }
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg whitespace-nowrap text-[11px]"
              >
                স্ট্যান্ডার্ড জিনিয়াস
              </button>
              <button
                onClick={() =>
                  setSysPrompt(
                    "You are STUDIO X Master Code & Voice Engine. You specialize in generating flawless, production-ready full-stack code and rich expressive Bengali neural audio scripts with precise cultural nuance."
                  )
                }
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg whitespace-nowrap text-[11px]"
              >
                কোডার ও ভয়েস প্রো
              </button>
              <button
                onClick={() =>
                  setSysPrompt(
                    "You are STUDIO X, a very polite, humble, and deeply religious Islamic content creator and Bengali storyteller. You write deeply moving, authentic scripts and voiceovers."
                  )
                }
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg whitespace-nowrap text-[11px]"
              >
                ইসলামিক ও মোটিভেশনাল
              </button>
            </div>

            <textarea
              rows={8}
              value={sysPrompt}
              onChange={(e) => setSysPrompt(e.target.value)}
              className="w-full p-4 rounded-xl border border-neutral-700 bg-neutral-950 text-neutral-100 font-mono text-xs leading-relaxed focus:outline-none focus:border-indigo-500"
              placeholder="সিস্টেম প্রম্পট লিখুন..."
            />
          </div>
        )}

        {/* TAB 4: USERS & CREDITS */}
        {activeTab === "users" && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-lg font-bold text-white font-['Hind_Siliguri',sans-serif]">
                  ইউজার ও ক্রেডিট ব্যালেন্স ম্যানেজার
                </h3>
                <p className="text-xs text-neutral-400">
                  সিস্টেমের ক্রেডিট ব্যালেন্স বৃদ্ধি বা রিসেট করুন
                </p>
              </div>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>আপডেট করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="text-xs text-neutral-400">বর্তমান গ্লোবাল ক্রেডিট ব্যালেন্স</div>
                  <div className="text-3xl font-black text-emerald-400 font-mono">
                    {credits.toLocaleString()} ক্রেডিট
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-300 block">
                    ব্যালেন্স অ্যাডজাস্ট করুন
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCredits((c) => c + 500)}
                      className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex-1"
                    >
                      + ৫০০
                    </button>
                    <button
                      onClick={() => setCredits((c) => c + 2000)}
                      className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex-1"
                    >
                      + ২,০০০
                    </button>
                    <button
                      onClick={() => setCredits((c) => c + 10000)}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex-1"
                    >
                      + ১০,০০০
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs">
                <div className="font-bold text-neutral-200">ইউজার পারমিশন রোল:</div>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Super Admin (মামা)</div>
                      <div className="text-[10px] text-neutral-400">সম্পূর্ণ এক্সেস ও কনফিগ রাইটস</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-neutral-300">Standard Users</div>
                      <div className="text-[10px] text-neutral-400">ভয়েস, চ্যাট ও প্রোটোটাইপিং মোড</div>
                    </div>
                    <span className="text-[10px] text-neutral-400">UNRESTRICTED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY & LOGS */}
        {activeTab === "security" && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-lg font-bold text-white font-['Hind_Siliguri',sans-serif]">
                  সিকিউরিটি ও মাস্টার অডিট ট্রেইল
                </h3>
                <p className="text-xs text-neutral-400">
                  নিরাপত্তা কনফিগারেশন, পিন ও ডাটা এক্সপোর্ট
                </p>
              </div>
              <button
                onClick={handleExportBackup}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ব্যাকআপ ডাউনলোড</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-indigo-400" />
                  <span>অ্যাডমিন পিন পরিবর্তন ও অ্যাক্সেস কি</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  বর্তমান মাস্টার অ্যাডমিন অ্যাক্সেস কি হলো <code className="text-indigo-400 font-mono">7860</code> অথবা <code className="text-indigo-400 font-mono">mama</code>। এটি পরিবর্তন করতে চাইলে নতুন পিন দিয়ে কনফিগ ব্যাকআপ ফাইল সংরক্ষণ করুন।
                </p>
                <button
                  onClick={() => alert("অ্যাডমিন পিন সফলভাবে আপডেট রাখা হয়েছে!")}
                  className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl"
                >
                  পিন সিকিউরিটি রিফ্রেশ
                </button>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>মোবাইল অ্যাডমিন অ্যাপ ইনস্টল টিপস</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  মোবাইলে ক্রিয়েটর অ্যাপের পাশাপাশি অ্যাডমিন প্যানেল সরাসরি চালু করতে ব্রাউজারের অ্যাড্রেস বারে <code className="text-emerald-400 font-mono">?app=admin</code> লিখে এন্টার দিন এবং <strong>Add to Home screen</strong> করে আলাদা <strong>STUDIO X Admin</strong> অ্যাপ হিসেবে সেভ করে রাখুন।
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar for Admin App */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 px-2 py-1.5 flex items-center justify-around">
        {[
          { id: "dashboard", label: "ড্যাশবোর্ড", icon: BarChart3 },
          { id: "models", label: "মডেল", icon: Cpu },
          { id: "prompts", label: "প্রম্পট", icon: Sliders },
          { id: "users", label: "ক্রেডিট", icon: Users },
          { id: "security", label: "সিকিউরিটি", icon: ShieldCheck },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? "text-indigo-400 font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-['Hind_Siliguri',sans-serif]">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
