import React, { useState } from "react";
import {
  Smartphone,
  Play,
  Copy,
  Download,
  Check,
  Sparkles,
  Code2,
  RefreshCw,
  Home,
  Compass,
  Bell,
  User,
  Heart,
  Calendar,
  Flame,
} from "lucide-react";

interface AppStudioProps {
  initialPrompt?: string;
}

export const AppStudio: React.FC<AppStudioProps> = ({ initialPrompt = "" }) => {
  const [prompt, setPrompt] = useState(
    initialPrompt ||
      "একটি আধুনিক ফিটনেস ও হেলথ ট্র্যাকার মোবাইল অ্যাপ (ডার্ক ও নিয়ন একসেন্ট থিম, দৈনিক স্টেপ ট্র্যাকার, ওয়ার্কআউট রুটিন এবং হার্টরেট সহ)।"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [activeScreen, setActiveScreen] = useState<"home" | "workouts" | "profile">("home");
  const [copied, setCopied] = useState(false);

  // App interactive states
  const [waterGlasses, setWaterGlasses] = useState(5);
  const [workoutChecked, setWorkoutChecked] = useState<{ [k: string]: boolean }>({
    "1": true,
    "2": false,
    "3": false,
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Call API for app logic / code
      await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate an interactive mobile app UI specification for: "${prompt}". Explain screen hierarchy and component structure in Bengali.`,
        }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const sampleReactCode = `// React Native / Expo App Component
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function FitnessApp() {
  const [waterCount, setWaterCount] = useState(5);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>শুভ সকাল, তানভীর 👋</Text>
        <Text style={styles.sub}>আজকের ফিটনেস লক্ষ্য: ৮৫% অর্জিত</Text>
      </View>

      {/* Main Stats Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>দৈনিক পদক্ষেপ (Steps)</Text>
        <Text style={styles.statBig}>৭,৪২০ / ১০,০০০</Text>
      </View>

      {/* Water Counter */}
      <View style={styles.waterBox}>
        <Text style={styles.boxTitle}>পানি পান: {waterCount} গ্লাস</Text>
        <TouchableOpacity onPress={() => setWaterCount(c => c + 1)} style={styles.btn}>
          <Text style={styles.btnText}>+ ১ গ্লাস যোগ করুন</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  header: { marginTop: 40, marginBottom: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  sub: { fontSize: 14, color: '#94a3b8' },
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 16 },
  cardTitle: { color: '#38bdf8', fontSize: 14, fontWeight: '600' },
  statBig: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: 8 },
  waterBox: { backgroundColor: '#1e293b', padding: 20, borderRadius: 16 },
  boxTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  btn: { backgroundColor: '#0284c7', padding: 12, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleReactCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col bg-neutral-100 overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-neutral-200 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-neutral-900 text-sm font-['Hind_Siliguri',sans-serif]">
              মোবাইল অ্যাপ বিল্ডার
            </span>
            <span className="text-[11px] text-neutral-500 block -mt-0.5">
              ইন্টারেক্টিভ ফোন প্রোটোটাইপ ও React Native/Flutter কোড
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-200 text-xs">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                activeTab === "preview"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              ইন্টারেক্টিভ প্রোটোটাইপ
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                activeTab === "code"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              React Native কোড
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 text-xs flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">কপি কোড</span>
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Prompt & Screen selector */}
        <div className="w-full md:w-80 lg:w-96 bg-white border-r border-neutral-200 p-4 flex flex-col gap-4 shrink-0 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-800 font-['Hind_Siliguri',sans-serif] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>মোবাইল অ্যাপ প্রম্পট</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full p-2.5 text-xs rounded-xl border border-neutral-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none resize-none font-['Hind_Siliguri',sans-serif]"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>অ্যাপ তৈরি হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>নতুন অ্যাপ তৈরি করুন</span>
                </>
              )}
            </button>
          </div>

          <hr className="border-neutral-200" />

          {/* Screen Navigation Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-800 font-['Hind_Siliguri',sans-serif]">
              অ্যাপের সক্রিয় স্ক্রিন
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => setActiveScreen("home")}
                className={`p-2 rounded-lg border text-center font-medium ${
                  activeScreen === "home"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                    : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                ড্যাশবোর্ড
              </button>
              <button
                onClick={() => setActiveScreen("workouts")}
                className={`p-2 rounded-lg border text-center font-medium ${
                  activeScreen === "workouts"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                    : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                রুটিন
              </button>
              <button
                onClick={() => setActiveScreen("profile")}
                className={`p-2 rounded-lg border text-center font-medium ${
                  activeScreen === "profile"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                    : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                প্রোফাইল
              </button>
            </div>
          </div>

          <div className="mt-auto bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs text-neutral-600 space-y-1 font-['Hind_Siliguri',sans-serif]">
            <span className="font-bold text-neutral-900">💡 টিপস:</span>
            <p>
              ডানপাশের ফোনে বাটনগুলোতে ক্লিক করে আপনি সরাসরি অ্যাপের সাথে
              ইন্টারঅ্যাক্ট করতে পারবেন!
            </p>
          </div>
        </div>

        {/* Right Side: Realistic Phone Mockup */}
        <div className="flex-1 bg-neutral-200 p-4 sm:p-6 flex items-center justify-center overflow-auto">
          {activeTab === "preview" ? (
            /* Smartphone Frame */
            <div className="w-[340px] sm:w-[360px] h-[680px] bg-neutral-950 rounded-[44px] p-3 shadow-2xl border-4 border-neutral-800 ring-1 ring-neutral-700/50 flex flex-col relative select-none">
              {/* Dynamic Island / Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-20 flex items-center justify-between px-3">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Phone Screen Canvas */}
              <div className="w-full flex-1 bg-slate-900 rounded-[36px] overflow-hidden flex flex-col text-white font-sans text-xs">
                {/* Status Bar */}
                <div className="pt-3 px-6 pb-2 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>০৯:৪১</span>
                  <div className="flex items-center gap-1.5">
                    <span>5G</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Screen Content Container */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                  {activeScreen === "home" && (
                    <>
                      {/* User Welcome */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[11px] text-neutral-400">
                            শুভ সকাল
                          </div>
                          <div className="text-base font-bold text-white">
                            তানভীর আহমেদ 👋
                          </div>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/40">
                          TA
                        </div>
                      </div>

                      {/* Main Metric: Steps */}
                      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-4 text-white shadow-lg space-y-2">
                        <div className="flex items-center justify-between text-[11px] opacity-90">
                          <span>আজকের স্টেপ লক্ষ্য</span>
                          <span className="bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                            ৭৪% সম্পন্ন
                          </span>
                        </div>
                        <div className="text-2xl font-extrabold tracking-tight">
                          ৭,৪২০ <span className="text-xs font-normal">/ ১০,০০০ কদম</span>
                        </div>
                        <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                          <div className="bg-white h-full w-[74%] rounded-full" />
                        </div>
                      </div>

                      {/* Health Grid */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
                          <div className="flex items-center gap-1 text-rose-400 text-[10px]">
                            <Heart className="w-3.5 h-3.5" />
                            <span>হার্টরেট</span>
                          </div>
                          <div className="text-lg font-bold">৭৮ BPM</div>
                          <div className="text-[10px] text-slate-400">স্বাভাবিক ছন্দ</div>
                        </div>
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
                          <div className="flex items-center gap-1 text-amber-400 text-[10px]">
                            <Flame className="w-3.5 h-3.5" />
                            <span>ক্যালোরি বার্ন</span>
                          </div>
                          <div className="text-lg font-bold">৫২০ Kcal</div>
                          <div className="text-[10px] text-slate-400">লক্ষ্য: ৬০০ Kcal</div>
                        </div>
                      </div>

                      {/* Interactive Water Tracker */}
                      <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sky-400">
                            💧 পানি পান ট্র্যাকার
                          </span>
                          <span className="text-xs font-bold text-white">
                            {waterGlasses} / ৮ গ্লাস
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div
                              key={i}
                              onClick={() => setWaterGlasses(i + 1)}
                              className={`flex-1 h-6 rounded-md cursor-pointer transition-colors ${
                                i < waterGlasses
                                  ? "bg-sky-500 shadow-xs"
                                  : "bg-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => setWaterGlasses((c) => Math.min(c + 1, 8))}
                          className="w-full py-1.5 bg-sky-600 hover:bg-sky-500 rounded-lg font-medium text-[11px] transition-colors"
                        >
                          + ১ গ্লাস যোগ করুন
                        </button>
                      </div>
                    </>
                  )}

                  {activeScreen === "workouts" && (
                    <div className="space-y-3">
                      <div className="font-bold text-sm text-white">
                        আজকের ওয়ার্কআউট প্ল্যান
                      </div>
                      {[
                        { id: "1", title: "সকালের ওয়ার্মআপ ও স্ট্রেচিং", time: "১৫ মিনিট", cal: "৮০ Kcal" },
                        { id: "2", title: "হালকা জগিং ও কার্ডিও", time: "২০ মিনিট", cal: "১৮০ Kcal" },
                        { id: "3", title: "কোর ও অ্যাবস এক্সারসাইজ", time: "১৫ মিনিট", cal: "১২০ Kcal" },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() =>
                            setWorkoutChecked((prev) => ({
                              ...prev,
                              [item.id]: !prev[item.id],
                            }))
                          }
                          className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <div
                              className={`font-semibold ${
                                workoutChecked[item.id]
                                  ? "line-through text-slate-400"
                                  : "text-white"
                              }`}
                            >
                              {item.title}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {item.time} • {item.cal}
                            </div>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                              workoutChecked[item.id]
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : "border-slate-600"
                            }`}
                          >
                            {workoutChecked[item.id] && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeScreen === "profile" && (
                    <div className="space-y-4 text-center py-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-600 text-white text-xl font-bold flex items-center justify-center mx-auto ring-4 ring-slate-800">
                        TA
                      </div>
                      <div>
                        <div className="text-base font-bold text-white">তানভীর আহমেদ</div>
                        <div className="text-xs text-slate-400">ঢাকা, বাংলাদেশ • প্রো মেম্বার</div>
                      </div>
                      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-left space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">উচ্চতা:</span>
                          <span className="font-semibold text-white">৫ ফুট ১০ ইঞ্চি</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">ওজন:</span>
                          <span className="font-semibold text-white">৬৮ কেজি</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">স্ট্রিক:</span>
                          <span className="font-semibold text-amber-400">🔥 ১২ দিন একটানা</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Navigation Bar */}
                <div className="bg-slate-950/80 border-t border-slate-800 px-6 py-2.5 flex items-center justify-between text-neutral-400">
                  <button
                    onClick={() => setActiveScreen("home")}
                    className={`flex flex-col items-center gap-0.5 ${
                      activeScreen === "home" ? "text-emerald-400 font-bold" : "hover:text-white"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span className="text-[10px]">হোম</span>
                  </button>
                  <button
                    onClick={() => setActiveScreen("workouts")}
                    className={`flex flex-col items-center gap-0.5 ${
                      activeScreen === "workouts" ? "text-emerald-400 font-bold" : "hover:text-white"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="text-[10px]">রুটিন</span>
                  </button>
                  <button
                    onClick={() => setActiveScreen("profile")}
                    className={`flex flex-col items-center gap-0.5 ${
                      activeScreen === "profile" ? "text-emerald-400 font-bold" : "hover:text-white"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-[10px]">প্রোফাইল</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full max-w-4xl bg-neutral-900 rounded-xl overflow-hidden shadow-lg border border-neutral-800 flex flex-col">
              <div className="bg-neutral-950 px-4 py-2 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center gap-2 font-mono">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>FitnessApp.tsx (React Native / Expo)</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-[11px]"
                >
                  {copied ? "কপি হয়েছে!" : "কপি কোড"}
                </button>
              </div>
              <textarea
                value={sampleReactCode}
                readOnly
                className="w-full flex-1 p-4 bg-neutral-900 text-emerald-400 font-mono text-xs focus:outline-none resize-none overflow-auto leading-relaxed"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
