import React, { useState } from "react";
import {
  Workflow,
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
      "একটি ইসলামিক ও লাইফস্টাইল YouTube চ্যানেলের জন্য ১০টি আকর্ষণীয় ভিডিওর কমপ্লিট প্যাকেজ তৈরি করো (রিসার্চ, স্ক্রিপ্ট, ভয়েস, থাম্বনেইল ও এসইও সহ)।"
  );
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [copiedStepId, setCopiedStepId] = useState<string | null>(null);
  const [expandedStepId, setExpandedStepId] = useState<string | null>("step-3");

  const defaultSteps: AgentStep[] = [
    {
      id: "step-1",
      title: "Task Breakdown & Strategy",
      titleBn: "১. টাস্ক প্ল্যানিং ও লক্ষ্য নির্ধারণ",
      status: "completed",
      actionType: "research",
      output: `### লক্ষ্য: ১০টি হাই-কনভার্টিং ভিডিও তৈরি
- **টার্গেট অডিয়েন্স:** ১৮-৩৫ বছর বয়সী বাংলা ভাষাভাষী দর্শক
- **ক্যাটাগরি:** মোটিভেশনাল, আত্মোন্নয়ন ও ইসলামিক দৃষ্টিভঙ্গি
- **ভিডিও ফরম্যাট:** ৫-৮ মিনিটের লং ভিডিও + ৬০ সেকেন্ডের ৩টি করে শর্টস
- **টোন:** শান্ত, বলিষ্ঠ, অনুপ্রেরণাদায়ক ও তথ্যবহুল`,
    },
    {
      id: "step-2",
      title: "Market & Keyword Research",
      titleBn: "২. বিষয় গবেষণা ও অডিয়েন্স ইন্টারেস্ট",
      status: "completed",
      actionType: "research",
      output: `### টপ সার্চ ভলিউম ও ট্রেন্ডিং বিষয়সমূহ:
1. "মানসিক শান্তি অর্জনের উপায়" (Search Vol: 120k/mo)
2. "সকালের রুটিন ও বারাকা" (Search Vol: 85k/mo)
3. "রাগ নিয়ন্ত্রণের কার্যকর কৌশল" (Search Vol: 95k/mo)
4. "ডিপ্রেশন ও একাকীত্ব থেকে মুক্তির উপায়" (Search Vol: 150k/mo)
5. "সাফল্য ও নিয়তের শুদ্ধতা" (Search Vol: 60k/mo)`,
    },
    {
      id: "step-3",
      title: "10 Video Concepts & Viral Hooks",
      titleBn: "৩. ১০টি ভিডিওর আইডিয়া ও ভাইরাল হুক",
      status: "completed",
      actionType: "script",
      output: `### ১০টি ভিডিওর তালিকা:
1. **ভিডিও ১:** "প্রতিদিন সকালে এই ৩টি ভুল আপনার সারাদিনের বারাকা কেড়ে নিচ্ছে!"
   - *হুক:* "আপনি কি জানেন, সকালের প্রথম ১৫ মিনিট ঠিক করে আপনার আগামী ১৫ বছর কেমন যাবে?"
2. **ভিডিও ২:** "অতিরিক্ত দুশ্চিন্তা ও ওভারথিঙ্কিং থামানোর ইসলামিক ও সাইকোলজিক্যাল উপায়"
3. **ভিডিও ৩:** "যে ৫টি অভ্যাস একজন মানুষকে ভেতর থেকে অটুট ও অপরাজেয় করে তোলে"
4. **ভিডিও ৪:** "রিযিক বৃদ্ধির গোপন রহস্য: যা ধনী মানুষেরা মেনে চলে"
5. **ভিডিও ৫:** "মানুষের কথায় কষ্ট পাওয়া বন্ধ করবেন যেভাবে"
6. **ভিডিও ৬:** "কঠিন সময়ে কীভাবে নিজের বিশ্বাস ও আশা ধরে রাখবেন?"
7. **ভিডিও ৭:** "অলস্য ও কাজের দীর্ঘসূত্রিতা কাটানোর ৩ সেকেন্ডের ফর্মুলা"
8. **ভিডিও ৮:** "আত্মবিশ্বাস বাড়ানোর ৫টি পরীক্ষিত ধাপ"
9. **ভিডিও ৯:** "যে দোয়া ও আমল মানুষের অন্তরের শূন্যতা দূর করে দেয়"
10. **ভিডিও ১০:** "মৃত্যুর কথা স্মরণ কীভাবে আমাদের জীবনকে অর্থপূর্ণ করে?"`,
    },
    {
      id: "step-4",
      title: "Detailed Production Scripts",
      titleBn: "৪. মাস্টার স্ক্রিপ্ট (ভিডিও ১ ও ২)",
      status: "completed",
      actionType: "script",
      output: `### ভিডিও ১: পূর্ণাঙ্গ ভয়েসওভার স্ক্রিপ্ট
**[হুক - প্রথম ১০ সেকেন্ড]**
"প্রতিদিন সকালে ঘুম থেকে উঠে আপনি সবার আগে কী করেন? মুঠোফোনে সোশ্যাল মিডিয়া স্ক্রল? যদি উত্তর হ্যাঁ হয়, তবে জেনে রাখুন—নিজের অজান্তেই আপনি দিনের শুরুতেই মনের শান্তি নষ্ট করছেন।"

**[মূল বক্তব্য - ২য় মিনিট]**
"ইসলাম ও আধুনিক বিজ্ঞান উভয়েই বলে—সকালের সময়টুকু হলো সবচেয়ে মূল্যবান বরকতের সময়। আল্লাহর রাসুল (সা.) দোয়া করেছিলেন: 'হে আল্লাহ! আমার উম্মতের জন্য সকালের সময়ে বরকত দান করুন।' যখন আপনি অলসতা ত্যাগ করে দিনের প্রথম ভাগে সৃষ্টিশীল কোনো কাজে মনোযোগ দেন, আপনার নিউরোট্রান্সমিটারগুলো ইতিবাচক শক্তিতে ভরে ওঠে।"

**[কল টু অ্যাকশন (CTA)]**
"আজ থেকেই এই অভ্যাস পরিবর্তন করার সংকল্প নিন। ভিডিওটি ভালো লাগলে লাইক দিন এবং প্রিয়জনকে শেয়ার করে বরকত ভাগ করে নিন।"`,
    },
    {
      id: "step-5",
      title: "AI Image & Thumbnail Prompts",
      titleBn: "৫. থাম্বনেইল প্রম্পট ও ভিজ্যুয়াল গাইড",
      status: "completed",
      actionType: "image",
      output: `### ফটো ও থাম্বনেইল জেনারেশন প্রম্পট:
1. **থাম্বনেইল ১:** "Ultra-realistic cinematic 8k close-up shot of a thoughtful young South Asian man looking at golden morning sunlight streaming through a window, serene expression, dramatic lighting, high contrast, golden hour glow."
   - **থাম্বনেইল টেক্সট:** "সকালের ৩টি মারাত্মক ভুল!" (হলুদ ও সাদা বোল্ড বাংলা ফন্ট)
2. **থাম্বনেইল ২:** "A glowing illuminated hourglass floating over calm ocean at twilight, mystical atmosphere, 3D volumetric light, 4K resolution."
   - **থাম্বনেইল টেক্সট:** "দুশ্চিন্তা বন্ধের উপায়!"`,
    },
    {
      id: "step-6",
      title: "Voiceover Directives & Audio Script",
      titleBn: "৬. ভয়েসওভার টোন ও অডিও নির্দেশনা",
      status: "completed",
      actionType: "voice",
      output: `### অডিও নির্দেশনা:
- **নির্বাচিত ভয়েস:** Fenrir / কোরি (শান্ত ও গম্ভীর)
- **টোন:** ভাবগম্ভীর, ধীরস্থির ও অনুপ্রেরণাদায়ক (Reflective & Inspiring)
- **স্পিড:** 0.95x (একটু ধীর ও স্পষ্ট উচ্চারণ)
- **ব্যাকগ্রাউন্ড স্কোর:** লো-ভলিউম সফট অ্যাম্বিয়েন্ট পিয়ানো ও প্যাড`,
    },
    {
      id: "step-7",
      title: "Video Storyboard & B-Roll Shots",
      titleBn: "৭. ভিডিও স্টোরিবোর্ড ও বি-রোল শট লিস্ট",
      status: "completed",
      actionType: "video",
      output: `### ভিডিও ১ এর শট লিস্ট:
- **০:০০ - ০:০৮:** একজন মানুষের বিছানায় শুয়ে স্মার্টফোন স্ক্রল করার স্লো মোশন শট (শ্যাডোড লাইটিং)।
- **০:০৮ - ০:২০:** দ্রুত ঘড়ির কাঁটা ঘোরার সিনেমাটিক ম্যাক্রো শট।
- **০:২০ - ১:১০:** ভোরের শান্ত প্রকৃতি, কুয়াশাচ্ছন্ন সবুজ মাঠ এবং সূর্যের কিরণ পড়ার দৃশ্য।
- **১:১০ - ২:৩০:** ক্যালিগ্রাফি স্টাইলে স্ক্রিনে মূল পয়েন্টগুলোর ড্রপ-ইন অ্যানিমেশন।`,
    },
    {
      id: "step-8",
      title: "YouTube SEO, Tags & Meta",
      titleBn: "৮. হাই-র‍্যাংকিং এসইও টাইটেল ও ট্যাগ",
      status: "completed",
      actionType: "seo",
      output: `### এসইও মেটাডাটা:
- **প্রস্তাবিত টাইটেল:** প্রতিদিন সকালে এই ৩টি ভুল করছেন না তো? | Morning Habits for Success & Peace
- **ডেসক্রিপশন:**
  "সকালের বরকত ও মানসিক শান্তি নিয়ে বিস্তারিত আলোচনা। জেনে নিন কোন ভুলগুলো আমাদের দৈনন্দিন প্রোডাক্টিভিটি ধ্বংস করে দেয়।"
- **হাই-র‍্যাংক ট্যাগস:**
  \`#BanglaMotivation, #MorningRoutine, #IslamicReminders, #SelfImprovement, #MentalPeace, #ProductivityHacks\``,
    },
    {
      id: "step-9",
      title: "Final Master Project Package",
      titleBn: "৯. চূড়ান্ত প্রজেক্ট প্যাকেজ ও রিলিজ শিডিউল",
      status: "completed",
      actionType: "final",
      output: `### রিলিজ শিডিউল ও এক্সিকিউশন প্ল্যান:
- **সপ্তাহ ১:** ভিডিও ১ ও ভিডিও ২ রিলিজ + প্রতিটিতে ২টি শর্টস
- **সপ্তাহ ২:** ভিডিও ৩ ও ভিডিও ৪ রিলিজ
- **সপ্তাহ ৩:** ভিডিও ৫ ও ভিডিও ৬ রিলিজ
- **সপ্তাহ ৪:** ভিডিও ৭, ৮, ৯ এবং ১০ রিলিজ

★ সমস্ত স্ক্রিপ্ট, থাম্বনেইল প্রম্পট এবং এসইও ট্যাগ রেডি! নিচে থেকে ফুল প্রজেক্ট ফাইল ডাউনলোড করতে পারেন।`,
    },
  ];

  const [steps, setSteps] = useState<AgentStep[]>(defaultSteps);

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
      // Step-by-step sequential AI agent execution simulation / generation
      for (let i = 0; i < steps.length; i++) {
        setActiveStepIndex(i);
        setSteps((prev) =>
          prev.map((step, idx) => ({
            ...step,
            status: idx === i ? "running" : idx < i ? "completed" : "pending",
          }))
        );

        // Fetch intelligent output from /api/generate for the goal and current step
        const currentStep = steps[i];
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `You are an Autonomous AI Project Agent executing Step ${i + 1} of 9: "${currentStep.title} (${currentStep.titleBn})" for this user project goal:
"${goal}"

Please output thorough, professional, actionable results in Bengali (বাংলা) formatted with Markdown headers and bullet points.`,
          }),
        });

        const data = await res.json();
        if (data.success && data.text) {
          setSteps((prev) =>
            prev.map((step, idx) =>
              idx === i
                ? { ...step, status: "completed", output: data.text }
                : step
            )
          );
        } else {
          // Keep current fallback output
          setSteps((prev) =>
            prev.map((step, idx) =>
              idx === i ? { ...step, status: "completed" } : step
            )
          );
        }
      }
    } catch (err) {
      console.error("Agent execution error:", err);
    } finally {
      setIsRunning(false);
      setActiveStepIndex(-1);
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
    a.download = `ai-agent-package-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
              <Workflow className="w-3.5 h-3.5" />
              <span>অটোনোমাস মাল্টি-স্টেপ ওয়ার্কফ্লো</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Hind_Siliguri',sans-serif]">
              এআই এজেন্ট ওয়ার্কস্পেস
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl font-['Hind_Siliguri',sans-serif]">
              শুধু একটি উদ্দেশ্য বা প্রজেক্টের নাম দিন। এআই নিজে কাজগুলোকে ভাগ
              করে রিসার্চ, স্ক্রিপ্ট, অডিও, ভিডিও এবং এসইও ধাপে ধাপে তৈরি করবে।
            </p>
          </div>

          <button
            onClick={handleExportAll}
            className="self-start md:self-center px-4 py-2 bg-white text-amber-900 hover:bg-amber-50 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>সম্পূর্ণ প্যাকেজ ডাউনলোড</span>
          </button>
        </div>
      </div>

      {/* Goal Input Box */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-neutral-900 font-['Hind_Siliguri',sans-serif] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>আপনার প্রজেক্ট বা এজেন্টের মূল লক্ষ্য</span>
          </label>
          <span className="text-xs text-neutral-500 font-['Hind_Siliguri',sans-serif]">
            টাস্ক → রিসার্চ → স্ক্রিপ্ট → অডিও → ভিডিও → এসইও
          </span>
        </div>

        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows={2}
          placeholder="যেমন: 'একটি YouTube চ্যানেলের জন্য ১০টি ভিডিও তৈরির কমপ্লিট প্যাকেজ বানাও'..."
          className="w-full p-3 rounded-xl border border-neutral-200 text-neutral-800 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100 focus:outline-none resize-none font-['Hind_Siliguri',sans-serif]"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Preset Prompts */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() =>
                setGoal(
                  "একটি ইসলামিক ও লাইফস্টাইল YouTube চ্যানেলের জন্য ১০টি আকর্ষণীয় ভিডিওর কমপ্লিট প্যাকেজ তৈরি করো"
                )
              }
              className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[11px]"
            >
              📺 YouTube ১০ ভিডিও
            </button>
            <button
              onClick={() =>
                setGoal(
                  "একটি নতুন টেক ও এআই স্টার্টআপের জন্য পূর্ণাঙ্গ লঞ্চিং প্ল্যান ও ব্র্যান্ডিং প্যাকেজ তৈরি করো"
                )
              }
              className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[11px]"
            >
              🚀 স্টার্টআপ লঞ্চ প্ল্যান
            </button>
          </div>

          <button
            onClick={runAutonomousAgent}
            disabled={isRunning || !goal.trim()}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isRunning ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>ধাপে ধাপে সম্পন্ন হচ্ছে ({activeStepIndex + 1}/{steps.length})...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>এজেন্ট এক্সিকিউট করুন</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Steps Execution Pipeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-neutral-900 font-['Hind_Siliguri',sans-serif] flex items-center gap-2">
            <Workflow className="w-4 h-4 text-amber-600" />
            <span>অটোনোমাস এক্সিকিউশন পাইপলাইন (৯টি ধাপ)</span>
          </h2>
          <span className="text-xs text-neutral-500">
            {steps.filter((s) => s.status === "completed").length} / {steps.length} ধাপ সম্পন্ন
          </span>
        </div>

        {/* Step Cards List */}
        <div className="space-y-3">
          {steps.map((step, idx) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "running";
            const isExpanded = expandedStepId === step.id;

            return (
              <div
                key={step.id}
                className={`bg-white rounded-xl border transition-all ${
                  isCurrent
                    ? "border-amber-500 ring-2 ring-amber-100 shadow-sm"
                    : isCompleted
                    ? "border-neutral-200 hover:border-neutral-300"
                    : "border-neutral-200 opacity-60"
                }`}
              >
                {/* Step Header Bar */}
                <div
                  onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                  className="p-3.5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : isCurrent ? (
                        <Clock className="w-5 h-5 text-amber-600 animate-spin" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-300" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-neutral-900 font-['Hind_Siliguri',sans-serif]">
                        {step.titleBn}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        {step.title}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? "bg-emerald-100 text-emerald-800"
                          : isCurrent
                          ? "bg-amber-100 text-amber-800 animate-pulse"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {isCompleted ? "সম্পন্ন ✓" : isCurrent ? "চলমান ⏳" : "অপেক্ষমাণ"}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>
                </div>

                {/* Step Expanded Content */}
                {isExpanded && step.output && (
                  <div className="px-4 pb-4 pt-1 border-t border-neutral-100 text-xs text-neutral-800 space-y-3 font-['Hind_Siliguri',sans-serif]">
                    <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200 font-sans whitespace-pre-wrap leading-relaxed">
                      {step.output}
                    </div>

                    {/* Action buttons on this step */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => handleCopyStep(step.id, step.output)}
                        className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] flex items-center gap-1"
                      >
                        {copiedStepId === step.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>কপি হয়েছে!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>টেক্সট কপি</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        {step.actionType === "voice" && onSendToAudio && (
                          <button
                            onClick={() => onSendToAudio(step.output || "")}
                            className="px-2.5 py-1 rounded bg-purple-100 hover:bg-purple-200 text-purple-800 text-[11px] font-semibold flex items-center gap-1"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>ভয়েস স্টুডিওতে পাঠান</span>
                          </button>
                        )}

                        {step.actionType === "video" && onSendToStudio && (
                          <button
                            onClick={() => onSendToStudio("video", step.output || "")}
                            className="px-2.5 py-1 rounded bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-[11px] font-semibold flex items-center gap-1"
                          >
                            <Video className="w-3 h-3" />
                            <span>ভিডিও স্টুডিওতে পাঠান</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
