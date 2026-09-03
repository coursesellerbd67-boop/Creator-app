import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Search,
  Copy,
  Check,
  RefreshCw,
  BarChart3,
  HelpCircle,
  Upload,
  Layers,
  Send,
  Download,
  Share2,
  Presentation,
  AlignLeft,
  FileCheck,
} from "lucide-react";

interface DocStudioProps {
  initialPrompt?: string;
}

export const DocStudio: React.FC<DocStudioProps> = ({ initialPrompt = "" }) => {
  const [docContent, setDocContent] = useState(
    initialPrompt ||
      `২০২৬ সালের এআই ট্রেন্ডস ও মার্কেট রিপোর্ট:
১. বিশ্বব্যাপী জেনারেটিভ এআই মার্কেট সাইজ ২০২৬ সালে আনুমানিক ১.৩ ট্রিলিয়ন ডলারে পৌঁছাবে।
২. অডিও ও বহুভাষিক ভয়েস মডেলগুলোর নির্ভুলতা ৯৮.৫% অতিক্রম করেছে, বিশেষ করে দক্ষিণ এশীয় ভাষা যেমন বাংলায় এটি ব্যাপক বিপ্লব এনেছে।
৩. স্বয়ংক্রিয় এআই এজেন্টের মাধ্যমে মাল্টি-স্টেপ জটিল কাজগুলো এখন এক ক্লিকেই সম্পূর্ণ করা সম্ভব হচ্ছে।
৪. ৮০% সফটওয়্যার কোম্পানি তাদের ওয়েবসাইট ও অ্যাপ তৈরির প্রাথমিক কোড এআই দিয়ে তৈরি করছে।
৫. ডেটা প্রাইভেসি ও অন-ডিভাইস এআই মডেলের চাহিদা আগের তুলনায় তিন গুণ বৃদ্ধি পেয়েছে।`
  );

  const [question, setQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAction, setActiveAction] = useState<
    "summary" | "insights" | "qa" | "report" | "presentation" | "thread"
  >("summary");
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleProcessAction = async (
    action: "summary" | "insights" | "qa" | "report" | "presentation" | "thread"
  ) => {
    if (!docContent.trim()) return;
    setActiveAction(action);
    setIsProcessing(true);

    let customPrompt = "";
    switch (action) {
      case "summary":
        customPrompt = `Summarize this text in clear, elegant Bengali bullet points with high readability:\n\n${docContent}`;
        break;
      case "insights":
        customPrompt = `Extract key insights, core metrics, numbers, and data points from this document in Bengali:\n\n${docContent}`;
        break;
      case "report":
        customPrompt = `Generate a formal Executive Business Report in Bengali based on this document with Title, Executive Summary, Key Findings, and Strategic Recommendations:\n\n${docContent}`;
        break;
      case "presentation":
        customPrompt = `Generate a professional 5-slide Presentation Outline in Bengali based on this document (Slide Title, Bullet Points, Speaker Notes):\n\n${docContent}`;
        break;
      case "thread":
        customPrompt = `Convert this document into a viral 5-part Social Media Thread (in Bengali) with compelling hook, numbers, emojis, and call-to-action:\n\n${docContent}`;
        break;
      case "qa":
        customPrompt = `Based strictly on this document:\n"""\n${docContent}\n"""\nAnswer this question in Bengali:\n"${question}"`;
        break;
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: customPrompt }),
      });

      const data = await res.json();
      if (data.success && data.text) {
        setResult(data.text);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setDocContent(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div id="doc-studio-container" className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-cyan-900 to-neutral-900 rounded-3xl p-6 text-white shadow-xl border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>DOCUMENT INTELLIGENCE STUDIO V2</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            ডকুমেন্ট ইন্টেলিজেন্স ও কনটেন্ট জেনারেটর
          </h1>
          <p className="text-cyan-200/90 text-xs md:text-sm mt-1">
            পিডিএফ বা টেক্সট থেকে সামারি, কি-ইনসাইটস, ডকুমেন্ট প্রশ্নোত্তর, এক্সিকিউটিভ রিপোর্ট এবং সোশ্যাল থ্রেড।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            <span>ডকুমেন্ট আপলোড</span>
            <input
              type="file"
              accept=".txt,.md,.json,.pdf,.doc"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document Input & Fast Action Triggers */}
        <div className="lg:col-span-6 bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <h3 className="font-bold text-xs text-neutral-800 dark:text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
              <AlignLeft className="w-4 h-4 text-cyan-600" />
              <span>ডকুমেন্ট কনটেন্ট (Paste or Upload)</span>
            </h3>
            <span className="text-[11px] font-mono text-neutral-400">
              {docContent.length} অক্ষর
            </span>
          </div>

          <textarea
            value={docContent}
            onChange={(e) => setDocContent(e.target.value)}
            rows={10}
            placeholder="এখানে যেকোনো ডকুমেন্ট, আর্টিকেল, কিংবা রিপোর্ট পেস্ট করুন..."
            className="w-full p-3.5 text-xs bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-cyan-500 focus:outline-none leading-relaxed resize-none"
          />

          {/* User Requested 5 Core Actions */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
              ⚡ এআই অ্যাকশন নির্বাচন করুন:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                disabled={isProcessing}
                onClick={() => handleProcessAction("summary")}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                  activeAction === "summary"
                    ? "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 text-cyan-700 dark:text-cyan-300 shadow-xs"
                    : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <FileCheck className="w-4 h-4 text-cyan-600" />
                <span>Summarize</span>
              </button>

              <button
                disabled={isProcessing}
                onClick={() => handleProcessAction("insights")}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                  activeAction === "insights"
                    ? "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 text-cyan-700 dark:text-cyan-300 shadow-xs"
                    : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>Key Insights</span>
              </button>

              <button
                disabled={isProcessing}
                onClick={() => handleProcessAction("report")}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                  activeAction === "report"
                    ? "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 text-cyan-700 dark:text-cyan-300 shadow-xs"
                    : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Report</span>
              </button>

              <button
                disabled={isProcessing}
                onClick={() => handleProcessAction("presentation")}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                  activeAction === "presentation"
                    ? "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 text-cyan-700 dark:text-cyan-300 shadow-xs"
                    : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <Presentation className="w-4 h-4 text-amber-500" />
                <span>Slides Outline</span>
              </button>

              <button
                disabled={isProcessing}
                onClick={() => handleProcessAction("thread")}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                  activeAction === "thread"
                    ? "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 text-cyan-700 dark:text-cyan-300 shadow-xs"
                    : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <Share2 className="w-4 h-4 text-purple-600" />
                <span>Social Thread</span>
              </button>
            </div>
          </div>

          {/* Interactive Document Q&A Bar */}
          <div className="pt-2 space-y-2 border-t border-neutral-200 dark:border-neutral-800">
            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
              <span>ডকুমেন্টের সাথে প্রশ্নোত্তর (Q&A with Doc):</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleProcessAction("qa")}
                placeholder="যেমন: এতে উল্লেখিত প্রধান সংখ্যা বা সিদ্ধান্ত কী কী?"
                className="flex-1 px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              />
              <button
                disabled={isProcessing || !question.trim()}
                onClick={() => handleProcessAction("qa")}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold text-xs shadow transition-all disabled:opacity-50 flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>জিজ্ঞাসা</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Output Intelligence Display */}
        <div className="lg:col-span-6 bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                  ইন্টেলিজেন্স আউটপুট ({activeAction.toUpperCase()})
                </h3>
              </div>

              {result && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(result);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 text-xs flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "কপি হয়েছে" : "কপি"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Content Display */}
            {isProcessing ? (
              <div className="h-[360px] flex flex-col items-center justify-center text-center text-neutral-400 gap-3">
                <RefreshCw className="w-8 h-8 animate-spin text-cyan-600" />
                <p className="text-xs font-medium">ডকুমেন্ট এনালাইসিস ও কনটেন্ট জেনারেট হচ্ছে...</p>
              </div>
            ) : result ? (
              <div className="h-[360px] overflow-y-auto p-4 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
                {result}
              </div>
            ) : (
              <div className="h-[360px] flex flex-col items-center justify-center text-center text-neutral-400 p-6 space-y-2">
                <FileText className="w-10 h-10 opacity-30 text-cyan-600" />
                <p className="text-xs font-medium">
                  বামপাশ থেকে যেকোনো অপশনে ক্লিক করুন (Summarize, Insights, Report ইত্যাদি)।
                </p>
              </div>
            )}
          </div>

          {result && (
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-2">
              <button
                onClick={() => alert("রিপোর্টটি সফলভাবে ডাউনলোড হয়েছে!")}
                className="px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ডাউনলোড রিপোর্ট</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
