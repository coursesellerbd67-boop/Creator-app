import React, { useState } from "react";
import {
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  Circle,
  Copy,
  Download,
  Check,
  ChevronDown,
  ChevronUp,
  Volume2,
  Video,
  FileText,
  Share2,
  Layers,
  ArrowRight,
  ExternalLink,
  Cpu,
  RefreshCw,
  Image as ImageIcon,
  Tag,
  Subtitles,
  Zap,
} from "lucide-react";
import { AgentStep, StudioType } from "../types";

interface AgentStudioProps {
  initialPrompt?: string;
  onSendToAudio?: (text: string) => void;
  onSendToStudio?: (studio: StudioType, text: string) => void;
}

export const AgentStudio: React.FC<AgentStudioProps> = ({
  initialPrompt = "",
  onSendToAudio,
  onSendToStudio,
}) => {
  const [goal, setGoal] = useState(
    initialPrompt ||
      "একটা 60-second YouTube ভিডিও তৈরি করো—script, image prompt, voiceover, subtitle, thumbnail আর SEO সহ।"
  );
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [copiedStepId, setCopiedStepId] = useState<string | null>(null);
  const [expandedStepId, setExpandedStepId] = useState<string | null>("step-3");
  const [generatingVoiceStepId, setGeneratingVoiceStepId] = useState<string | null>(null);
  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);

  const defaultSteps: AgentStep[] = [
    {
      id: "step-1",
      title: "1. Planning & Strategic Roadmap",
      titleBn: "১. প্ল্যানিং ও কনটেন্ট স্ট্র্যাটেজি",
      status: "completed",
      actionType: "planning",
      output: `### টাস্ক প্ল্যান ও স্ট্র্যাটেজিক ফ্রেমওয়ার্ক:
- **ফরম্যাট:** ৬০ সেকেন্ড হাই-এনার্জি ভার্টিকাল শর্ট / রিল (9:16) অথবা ল্যান্ডস্কেপ (16:9)
- **উদ্দেশ্য:** প্রথম ৩ সেকেন্ডেই ভিউয়ার ধরে রাখা (Retention Hook) এবং ফুল ওয়াচটাইম অর্জন
- **প্যাসিং:** ৬০ সেকেন্ডে মোট ১৫০-১৭০ শব্দ, প্রতি ৫-৭ সেকেন্ডে ভিজ্যুয়াল কাট
- **অডিয়েন্স মনস্তত্ত্ব:** কৌতূহল উদ্দীপনা → নতুন তথ্য প্রদান → সহজ সমাধান → সরাসরি অ্যাকশন`,
    },
    {
      id: "step-2",
      title: "2. Deep Research & Audience Insights",
      titleBn: "২. ডিপ রিসার্চ ও কিওয়ার্ড বিশ্লেষণ",
      status: "completed",
      actionType: "research",
      output: `### মার্কেট গবেষণা ও ট্রেন্ডিং ইনসাইটস:
1. **টপ সার্চ ভলিউম:** "সকালে ৫ মিনিটে মন শান্ত করার উপায়" (Search Vol: 95k/mo)
2. **ভাইরাল কনসেপ্ট:** ডোপামিন ডিটক্স ও মর্নিং ফোকাস ফর্মুলা
3. **প্রতিদ্বন্দ্বী ভিডিও দুর্বলতা:** অধিকাংশ ভিডিও বেশি দীর্ঘ ও একঘেয়ে; আমাদের দরকার দ্রুতগতির বুলেট পয়েন্ট
4. **অডিয়েন্স ড্রাইভ:** ১৮-৩২ বছর বয়সী শিক্ষার্থী ও তরুণ কর্মজীবী যাদের মনোযোগ দ্রুত ছুটে যায়`,
    },
    {
      id: "step-3",
      title: "3. Master Script & Retention Hooks",
      titleBn: "৩. ৬০-সেকেন্ড পূর্ণাঙ্গ স্ক্রিপ্ট (হুক, বডি ও সিটিএ)",
      status: "completed",
      actionType: "script",
      output: `### ৬০-সেকেন্ড পূর্ণাঙ্গ স্ক্রিপ্ট:
**[0:00 - 0:05 | হুক]**
"আপনি কি জানেন—ঘুম থেকে ওঠার প্রথম ১০ মিনিটে আপনার মস্তিষ্কের সাথে কী ঘটে?"

**[0:05 - 0:20 | সমস্যা]**
"যখনই আপনি ঘুম ভেঙে ফোন স্ক্রল করেন, মস্তিষ্কে কর্টিসল এবং ডোপামিনের এক ক্ষতিকর ঝড় শুরু হয়। যার ফলে সারাদিন আপনি ক্লান্ত ও বিভ্রান্ত বোধ করেন।"

**[0:20 - 0:45 | ৩ সেকেন্ড ফর্মুলা সমাধান]**
"আজ থেকে শুধু ৩টি সহজ নিয়ম মেনে চলুন:
১. চোখ খুলে এক গ্লাস ঠান্ডা পানি পান করুন।
২. প্রথম ২০ মিনিট কোনো স্ক্রিনের দিকে তাকাবেন না।
৩. জানালার সামনে গিয়ে ৩ বার গভীর নিশ্বাস নিন।"

**[0:45 - 1:00 | কনক্লুশন ও কল টু অ্যাকশন]**
"এই ছোট্ট পরিবর্তনটি আপনার প্রোডাক্টিভিটি বাড়িয়ে দেবে ২০০%! নিজের ওপর পরীক্ষা করে দেখুন এবং বন্ধুদের সাথে শেয়ার করে তাদেরও দিনটি সুন্দর করতে সাহায্য করুন।"`,
    },
    {
      id: "step-4",
      title: "4. Cinematic Image & Scene Prompts",
      titleBn: "৪. সিনেমাটিক ইমেজ ও সিন প্রম্পটস",
      status: "completed",
      actionType: "image",
      output: `### সিন বাই সিন ভিজ্যুয়াল প্রম্পটস (Midjourney / Imagen):
1. **শট ১ (০-৫ সে.):** "Cinematic close up of glowing smartphone alarm in dark bedroom, blue light illuminating tired face, shallow depth of field, 8k, moody atmosphere."
2. **শট ২ (৫-২০ সে.):** "Abstract glowing neural network firing chaotic electrical pulses inside brain silhouette, vibrant red and neon blue hues, volumetric lighting."
3. **শট ৩ (২০-৪৫ সে.):** "Serene morning sunlight rays breaking through wooden window, water droplets on glass, peaceful aesthetic, warm golden hour tones, photorealistic."
4. **শট ৪ (৪৫-৬০ সে.):** "Energetic person walking confidently toward sunlight, smiling with clarity, cinematic depth, inspirational composition."`,
    },
    {
      id: "step-5",
      title: "5. Voiceover Audio Script & Directives",
      titleBn: "৫. ভয়েসওভার অডিও স্ক্রিপ্ট ও নির্দেশনা",
      status: "completed",
      actionType: "voice",
      output: `### ভয়েসওভার প্যারামিটার:
- **প্রস্তাবিত ভয়েস:** Fenrir (গম্ভীর ও আত্মবিশ্বাসী) অথবা Kore (শান্ত ও স্পষ্ট)
- **টোন:** ভাবগম্ভীর, ধীরস্থির ও আকর্ষণীয় (Engaging & Authoritative)
- **স্পিড:** 1.0x স্বাভাবিক গতি
- **মিউজিক বেড:** সফট অ্যাম্বিয়েন্ট সিন্থ ও সাব-বাস যা কথাকে প্রাধান্য দেবে`,
    },
    {
      id: "step-6",
      title: "6. Video Storyboard & Timeline Cues",
      titleBn: "৬. ভিডিও স্টোরিবোর্ড ও এডিটিং কিউস",
      status: "completed",
      actionType: "video",
      output: `### ভিডিও টাইমলাইন গাইড:
- **০:০০ - ০:০৫:** ফাস্ট জুম-ইন শট + টেক্সট পপ-আপ অ্যানিমেশন ("১০ মিনিটের ভুল!")
- **০:০৫ - ০:২০:** রেড ওভারলে গ্লিচ এফেক্ট এবং লো-ফ্রিকোয়েন্সি থাড সাউন্ড এফেক্ট
- **০:২০ - ০:৪৫:** ক্লিন ট্রানজিশন, স্ক্রিনে ১, ২, ৩ নম্বর পয়েন্ট কার্ড স্লাইড-ইন
- **০:৪৫ - ১:০০:** ব্যাকগ্রাউন্ড মিউজিক ক্রেসেন্ডো + সাবস্ক্রাইব বাটন অ্যানিমেশন`,
    },
    {
      id: "step-7",
      title: "7. Timecoded Subtitles (SRT)",
      titleBn: "৭. টাইমকোডেড সাবটাইটেল ট্র্যাক (SRT)",
      status: "completed",
      actionType: "subtitle",
      output: `### টাইমকোডেড সাবটাইটেল (SRT ফরম্যাট):
1
00:00:00,000 --> 00:00:05,200
ঘুম থেকে ওঠার প্রথম ১০ মিনিটে আপনার মস্তিষ্কে কী ঘটে?

2
00:00:05,200 --> 00:00:12,500
ঘুম ভেঙে ফোন স্ক্রল করলে কর্টিসল ও ডোপামিনের ক্ষতিকর ঝড় শুরু হয়।

3
00:00:12,500 --> 00:00:20,800
যার কারণে সারাদিন আপনি ক্লান্ত ও বিভ্রান্ত বোধ করেন।

4
00:00:20,800 --> 00:00:35,000
আজ থেকেই মেনে চলুন এই ৩টি সহজ সোনালী নিয়ম!

5
00:00:35,000 --> 00:00:48,000
১. ঠান্ডা পানি পান করুন | ২. স্ক্রিন এড়িয়ে চলুন | ৩. মুক্ত বাতাসে নিশ্বাস নিন

6
00:00:48,000 --> 00:01:00,000
এই ছোট্ট পরিবর্তন বাড়িয়ে দেবে ২০০% প্রোডাক্টিভিটি! শেয়ার করুন প্রিয়জনের সাথে।`,
    },
    {
      id: "step-8",
      title: "8. High-CTR Thumbnail Concepts",
      titleBn: "৮. হাই-সিটিআর থাম্বনেইল কনসেপ্ট ও গ্রাফিক্স",
      status: "completed",
      actionType: "thumbnail",
      output: `### ৩টি হাই-সিটিআর থাম্বনেইল আইডিয়া:
- **অপশন ১ (শক ভ্যালু):**
  - ভিজ্যুয়াল: বড় লাল ক্রস সাইন ও চিন্তিত মুখের এক্সপ্রেশন
  - টেক্সট: "সকালে এই ভুল কখনোই নয়!" (বোল্ড হলুদ ফন্ট, কালো ড্রপ শ্যাডো)
- **অপশন ২ (ট্রান্সফর্মেশন):**
  - ভিজ্যুয়াল: দুইভাগে বিভক্ত স্প্লিট স্ক্রিন (ক্লান্ত সকাল vs প্রাণবন্ত দিন)
  - টেক্সট: "১টি অভ্যাস = পুরো দিন জয়!"
- **অপশন ৩ (কৌতূহল):**
  - ভিজ্যুয়াল: বড় ডিজিটাল ঘড়িতে 06:00 AM জ্বলজ্বল করছে
  - টেক্সট: "প্রথম ১০ মিনিটের জাদু!"`,
    },
    {
      id: "step-9",
      title: "9. YouTube SEO, Tags & Hashtags",
      titleBn: "৯. ইউটিউব এসইও টাইটেল, ডেসক্রিপশন ও ট্যাগস",
      status: "completed",
      actionType: "seo",
      output: `### এসইও প্যাকেজ:
- **টাইটেল ১:** সকালে এই ৩টি ভুল করছেন না তো? | 60-Second Life Changing Habits
- **টাইটেল ২:** ঘুম থেকে উঠে ভুলেও এই কাজটি করবেন না! | Morning Routine Bangla
- **ডেসক্রিপশন:**
  সকালে ঘুম থেকে ওঠার পর মস্তিষ্কের কার্যক্ষমতা বজায় রাখতে কোন ভুলগুলো এড়িয়ে চলা উচিত? এই ৬০ সেকেন্ডের ভিডিওতে জানুন ৩টি বৈজ্ঞানিক নিয়ম।
- **ট্যাগস:**
  \`#BanglaShorts, #MorningRoutine, #ProductivityHacks, #SelfImprovement, #HealthTipsBangla, #DopamineDetox, #BanglaMotivation\``,
    },
    {
      id: "step-10",
      title: "10. Final Master Delivery Package",
      titleBn: "১০. চূড়ান্ত মাস্টার প্যাকেজ ও ওয়ান-ক্লিক এক্সপোর্ট",
      status: "completed",
      actionType: "final",
      output: `### ডেলিভারি কমপ্লিট!
★ পুরো ভিডিও প্রোডাকশন প্যাকেজটি প্রস্তুত।
- স্ক্রিপ্ট, সাবটাইটেল, ইমেজ প্রম্পট এবং এসইও ট্যাগ এক ক্লিকে ডাউনলোড করতে নিচে 'ডাউনলোড সম্পূর্ণ প্যাকেজ' বাটনে ক্লিক করুন।
- সরাসরি এডিটর দেখতে 'ভিডিও স্টুডিওতে পাঠান' বা 'ভয়েস সিন্থেসিস' বাটন ব্যবহার করুন।`,
    },
  ];

  const [steps, setSteps] = useState<AgentStep[]>(defaultSteps);

  const goalPresets = [
    {
      title: "৬০-সেকেন্ড YouTube শর্টস",
      text: "একটা 60-second YouTube ভিডিও তৈরি করো—script, image prompt, voiceover, subtitle, thumbnail আর SEO সহ।",
    },
    {
      title: "ইসলামিক ভিডিও প্যাকেজ",
      text: "একটি ইসলামিক মোটিভেশনাল চ্যানেলের জন্য পূর্ণাঙ্গ ভিডিও তৈরি করো: আত্মিক প্রশান্তি ও সকালের বরকত নিয়ে script, image, voiceover ও SEO সহ।",
    },
    {
      title: "টেক প্রোডাক্ট লঞ্চ ভিডিও",
      text: "একটি নতুন এআই মোবাইল অ্যাপ লঞ্চের জন্য ৬০ সেকেন্ডের হাইপ ভিডিও স্ক্রিপ্ট, স্টোরিবোর্ড, ভয়েসওভার ও থাম্বনেইল তৈরি করো।",
    },
    {
      title: "ই-কমার্স ক্যাম্পেইন প্যাকেজ",
      text: "ঈদ কালেকশনের ফ্যাশন ব্রান্ডের জন্য একটি কনভার্সন-ফোকাসড রিল ভিডিও প্যাকেজ তৈরি করো (স্ক্রিপ্ট, বি-রোল, ভয়েস ও প্রমোশনাল অফার)।",
    },
  ];

  const runAutonomousAgent = async () => {
    if (!goal.trim()) return;
    setIsRunning(true);

    // Reset step status
    const initialPendingSteps = steps.map((s, idx) => ({
      ...s,
      status: (idx === 0 ? "running" : "pending") as any,
    }));
    setSteps(initialPendingSteps);
    setActiveStepIndex(0);

    try {
      for (let i = 0; i < steps.length; i++) {
        setActiveStepIndex(i);
        setSteps((prev) =>
          prev.map((step, idx) => ({
            ...step,
            status: idx === i ? "running" : idx < i ? "completed" : "pending",
          }))
        );

        const currentStep = steps[i];
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "agent_step",
            prompt: `You are the STUDIO X Super Agent executing Step ${i + 1} of 10: "${currentStep.title} (${currentStep.titleBn})" for the user's project goal:
"${goal}"

Output exceptionally detailed, production-ready, beautifully formatted Markdown in Bengali (বাংলা).
Include exact scripts, timing, visual prompts, timecoded subtitles, or SEO tags according to the step.`,
          }),
        });

        const data = await res.json();
        if (data.success && data.text) {
          setSteps((prev) =>
            prev.map((step, idx) =>
              idx === i ? { ...step, status: "completed", output: data.text } : step
            )
          );
        } else {
          setSteps((prev) =>
            prev.map((step, idx) => (idx === i ? { ...step, status: "completed" } : step))
          );
        }
      }
    } catch (err) {
      console.error("Super Agent execution error:", err);
    } finally {
      setIsRunning(false);
      setActiveStepIndex(-1);
    }
  };

  const handleGenerateVoiceForStep = async (stepId: string, textToSpeak: string) => {
    try {
      setGeneratingVoiceStepId(stepId);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSpeak.slice(0, 400),
          voiceName: "Fenrir",
        }),
      });
      const data = await res.json();
      if (data.success && data.audioBase64) {
        const audioUrl = `data:audio/wav;base64,${data.audioBase64}`;
        setActiveAudioUrl(audioUrl);
        const audio = new Audio(audioUrl);
        audio.play();
        setSteps((prev) =>
          prev.map((s) => (s.id === stepId ? { ...s, audioBase64: data.audioBase64 } : s))
        );
      }
    } catch (e) {
      console.error("Failed to generate voice:", e);
    } finally {
      setGeneratingVoiceStepId(null);
    }
  };

  const handleCopyStep = (stepId: string, content?: string) => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopiedStepId(stepId);
    setTimeout(() => setCopiedStepId(null), 2000);
  };

  const handleExportAll = () => {
    const fullText = steps
      .map((s) => `# ${s.titleBn} (${s.title})\n\n${s.output || ""}\n\n---\n`)
      .join("\n");

    const blob = new Blob([fullText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `studio-x-super-agent-package-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div id="super-agent-container" className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-purple-500/20">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
              <span>SUPER AGENT V2 • AUTONOMOUS EXECUTION ENGINE</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
              ১০-ধাপের স্বয়ংক্রিয় এআই সুপার এজেন্ট
            </h1>
            <p className="text-purple-200/90 text-sm md:text-base leading-relaxed">
              শুধু আপনার লক্ষ্যটি বলুন—এজেন্ট নিজে প্ল্যানিং, রিসার্চ, স্ক্রিপ্ট, ইমেজ প্রম্পট, ভয়েসওভার, ভিডিও স্টোরিবোর্ড, সাবটাইটেল, থাম্বনেইল এবং এসইও সহ সম্পূর্ণ রেডি প্যাকেজ তৈরি করবে।
            </p>
          </div>

          <button
            id="super-agent-export-btn"
            onClick={handleExportAll}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs md:text-sm font-semibold text-white transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>সম্পূর্ণ প্যাকেজ ডাউনলোড</span>
          </button>
        </div>
      </div>

      {/* Goal Input Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 md:p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200">
          🎯 আপনার প্রজেক্ট বা লক্ষ্য নির্ধারণ করুন:
        </label>
        <div className="relative">
          <textarea
            id="super-agent-goal-input"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={3}
            placeholder="যেমন: একটা 60-second YouTube ভিডিও তৈরি করো—script, image prompt, voiceover, subtitle, thumbnail আর SEO সহ।"
            className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none transition-all resize-none"
          />
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            রেডি প্রম্পটস:
          </span>
          {goalPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setGoal(preset.text)}
              className="text-xs px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-neutral-700 dark:text-neutral-300 hover:text-purple-700 dark:hover:text-purple-300 rounded-lg transition-colors border border-neutral-200 dark:border-neutral-700"
            >
              {preset.title}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <Cpu className="w-4 h-4 text-purple-600" />
            <span>১০টি সম্পূর্ণ সমান্তরাল ও ধারাবাহিক পর্যায় রান হবে</span>
          </div>

          <button
            id="run-super-agent-btn"
            disabled={isRunning}
            onClick={runAutonomousAgent}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
              isRunning
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/20 active:scale-95"
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>এজেন্ট কাজ করছে ({activeStepIndex + 1}/১০)...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>সুপার এজেন্ট রান করুন</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 10-Phase Pipeline Progress Bar */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <h3 className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-4">
          ১০-ধাপের এক্সিকিউশন পাইপলাইন
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {steps.map((step, idx) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "running";
            return (
              <button
                key={step.id}
                onClick={() => setExpandedStepId(step.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? "bg-purple-100 dark:bg-purple-900/40 border-purple-500 ring-2 ring-purple-400/40 text-purple-800 dark:text-purple-300"
                    : isCompleted
                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300"
                    : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                <span className="text-[10px] font-bold">
                  {idx + 1}. {step.actionType?.toUpperCase()}
                </span>
                <div className="mt-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-spin" />
                  ) : (
                    <Circle className="w-4 h-4 text-neutral-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Accordion of All 10 Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isExpanded = expandedStepId === step.id;
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "running";

          return (
            <div
              key={step.id}
              id={`agent-step-${step.id}`}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isCurrent
                  ? "bg-purple-50/50 dark:bg-purple-950/20 border-purple-500/40 shadow-md"
                  : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm"
              }`}
            >
              <div
                onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                className="px-5 py-4 flex items-center justify-between cursor-pointer select-none hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isCompleted
                        ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                        : isCurrent
                        ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 animate-pulse"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100">
                      {step.titleBn}
                    </h4>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      {step.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {step.actionType === "voice" && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 px-2.5 py-1 rounded-md">
                      <Volume2 className="w-3.5 h-3.5" />
                      ভয়েস রেডি
                    </span>
                  )}
                  {step.actionType === "image" && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-pink-700 dark:text-pink-300 bg-pink-100 dark:bg-pink-900/40 px-2.5 py-1 rounded-md">
                      <ImageIcon className="w-3.5 h-3.5" />
                      ইমেজ প্রম্পট
                    </span>
                  )}
                  {step.actionType === "subtitle" && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 px-2.5 py-1 rounded-md">
                      <Subtitles className="w-3.5 h-3.5" />
                      SRT সাবটাইটেল
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
                  {/* Output content box */}
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl text-neutral-800 dark:text-neutral-200 text-sm whitespace-pre-wrap leading-relaxed font-sans border border-neutral-200/60 dark:border-neutral-700/60">
                    {step.output || "ফলাফল লোড হচ্ছে..."}
                  </div>

                  {/* Actions for this specific step */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Copy step button */}
                      <button
                        onClick={() => handleCopyStep(step.id, step.output)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors"
                      >
                        {copiedStepId === step.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>কপি হয়েছে</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>কপি করুন</span>
                          </>
                        )}
                      </button>

                      {/* Direct TTS generation if voice or script step */}
                      {(step.actionType === "voice" || step.actionType === "script") && (
                        <button
                          disabled={generatingVoiceStepId === step.id}
                          onClick={() =>
                            handleGenerateVoiceForStep(step.id, step.output || "")
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 text-purple-800 dark:text-purple-300 text-xs font-semibold transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>
                            {generatingVoiceStepId === step.id
                              ? "অডিও তৈরি হচ্ছে..."
                              : "ভয়েস শুনুন (TTS)"}
                          </span>
                        </button>
                      )}

                      {/* Transfer to other Studio */}
                      {onSendToStudio && step.actionType === "video" && (
                        <button
                          onClick={() => onSendToStudio("video", step.output || "")}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 hover:bg-indigo-200 text-indigo-800 dark:text-indigo-300 text-xs font-semibold transition-colors"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>ভিডিও স্টুডিওতে পাঠান</span>
                        </button>
                      )}

                      {onSendToStudio && step.actionType === "image" && (
                        <button
                          onClick={() => onSendToStudio("image", step.output || "")}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-100 dark:bg-pink-900/40 hover:bg-pink-200 text-pink-800 dark:text-pink-300 text-xs font-semibold transition-colors"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>ইমেজ স্টুডিওতে পাঠান</span>
                        </button>
                      )}
                    </div>

                    <span className="text-[11px] text-neutral-600 dark:text-neutral-400 font-mono">
                      Phase {index + 1} / 10 • Ready
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
