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
৪. ৮০% সফটওয়্যার কোম্পানি তাদের ওয়েবসাইট ও অ্যাপ তৈরির প্রাথমিক কোড এআই দিয়ে তৈরি করছে।`
  );

  const [question, setQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!docContent.trim()) return;
    setIsProcessing(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Summarize this text/document in clear, professional Bengali (বাংলা) bullet points, highlighting the key takeaways:
"""
${docContent}
"""`,
        }),
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

  const handleAskQuestion = async () => {
    if (!docContent.trim() || !question.trim()) return;
    setIsProcessing(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Based strictly on this document:
"""
${docContent}
"""

Answer this question in Bengali: "${question}"`,
        }),
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-800 rounded-2xl p-6 text-white shadow-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
            <FileText className="w-3.5 h-3.5" />
            <span>ডকুমেন্ট ও ডেটা ইন্টেলিজেন্স</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Hind_Siliguri',sans-serif]">
            ডকুমেন্ট ও ডেটা AI
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl font-['Hind_Siliguri',sans-serif]">
            বড় লেখা, রিপোর্ট বা গবেষণাপত্রের সারসংক্ষেপ তৈরি এবং ডকুমেন্ট থেকে
            সরাসরি প্রশ্নোত্তর অনুসন্ধান।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Text / Document */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider font-['Hind_Siliguri',sans-serif]">
              ডকুমেন্টের টেক্সট বা ডেটা পেস্ট করুন
            </label>
            <span className="text-xs text-neutral-400 font-mono">
              {docContent.length} অক্ষর
            </span>
          </div>

          <textarea
            value={docContent}
            onChange={(e) => setDocContent(e.target.value)}
            rows={10}
            placeholder="এখানে বড় আর্টিকেল, মিটিং নোট বা রিপোর্ট পেস্ট করুন..."
            className="w-full p-3 text-xs rounded-xl border border-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none resize-none font-['Hind_Siliguri',sans-serif] leading-relaxed"
          />

          <div className="pt-2 border-t border-neutral-100 flex flex-wrap gap-2">
            <button
              onClick={handleSummarize}
              disabled={isProcessing || !docContent.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>মূল সারসংক্ষেপ তৈরি করুন</span>
            </button>
          </div>
        </div>

        {/* Right: Q&A and Output */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-800 font-['Hind_Siliguri',sans-serif] flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-blue-600" />
              <span>ডকুমেন্ট থেকে সরাসরি প্রশ্ন করুন</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
                placeholder="যেমন: 'মার্কেট সাইজ কত হবে?'..."
                className="flex-1 p-2.5 text-xs rounded-xl border border-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none font-['Hind_Siliguri',sans-serif]"
              />
              <button
                onClick={handleAskQuestion}
                disabled={isProcessing || !question.trim()}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold disabled:opacity-50"
              >
                খুঁজুন
              </button>
            </div>
          </div>

          {/* Result Output */}
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-900 font-['Hind_Siliguri',sans-serif]">
              <span>বিশ্লেষণ ফলাফল:</span>
              {result && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-neutral-500 hover:text-neutral-800 flex items-center gap-1 text-[11px]"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>কপি</span>
                </button>
              )}
            </div>

            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 min-h-[160px] text-xs text-neutral-800 leading-relaxed font-['Hind_Siliguri',sans-serif] whitespace-pre-wrap">
              {result ? (
                result
              ) : (
                <span className="text-neutral-400 italic">
                  বামপাশের বাটন ক্লিক করে সারসংক্ষেপ তৈরি করুন অথবা সরাসরি প্রশ্ন
                  করুন।
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
