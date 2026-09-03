import React, { useState } from "react";
import {
  Globe,
  Play,
  Copy,
  Download,
  Check,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  Code2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

interface WebsiteStudioProps {
  initialPrompt?: string;
  onSaveProjectVersion?: (title: string, content: string) => void;
}

export const WebsiteStudio: React.FC<WebsiteStudioProps> = ({
  initialPrompt = "",
  onSaveProjectVersion,
}) => {
  const [prompt, setPrompt] = useState(
    initialPrompt ||
      "একটি আধুনিক ইসলামিক এডুকেশন ওয়েবসাইট তৈরি করো, যেখানে চমৎকার হিরো সেকশন, নামাজের সময়সূচি, অনলাইন লেকচার ও ডোনেশন বাটন থাকবে।"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [copied, setCopied] = useState(false);
  const [modificationPrompt, setModificationPrompt] = useState("");

  // Default initial responsive HTML website
  const [htmlCode, setHtmlCode] = useState<string>(() => `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>নূরুল ইসলাম একাডেমি | ইসলামিক এডুকেশন</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Hind Siliguri', sans-serif; }
  </style>
</head>
<body class="bg-neutral-50 text-neutral-800 antialiased min-h-screen flex flex-col">
  <!-- Top Bar -->
  <header class="bg-white border-b border-neutral-200 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
          ☪
        </div>
        <div>
          <span class="font-bold text-neutral-900 text-lg">নূরুল ইসলাম একাডেমি</span>
          <span class="text-xs text-emerald-600 block -mt-1 font-medium">জ্ঞান ও হিদায়াত</span>
        </div>
      </div>
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
        <a href="#home" class="text-emerald-700 font-semibold">হোম</a>
        <a href="#prayer" class="hover:text-emerald-700 transition-colors">নামাজের সময়</a>
        <a href="#courses" class="hover:text-emerald-700 transition-colors">কোর্সসমূহ</a>
        <a href="#about" class="hover:text-emerald-700 transition-colors">আমাদের কথা</a>
      </nav>
      <button class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-sm">
        ভর্তি হোন
      </button>
    </div>
  </header>

  <!-- Hero Section -->
  <section id="home" class="bg-gradient-to-b from-emerald-50 to-white py-12 md:py-20 px-4 border-b border-neutral-200">
    <div class="max-w-4xl mx-auto text-center space-y-4">
      <span class="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
        ★ বিশ্বমানের অনলাইন ইসলামিক শিক্ষা
      </span>
      <h1 class="text-3xl md:text-5xl font-extrabold text-neutral-900 leading-tight">
        সহজ ও শুদ্ধভাবে শিখুন <span class="text-emerald-600">কোরআন ও হাদিস</span>
      </h1>
      <p class="text-neutral-600 text-sm md:text-base max-w-2xl mx-auto">
        ঘরে বসেই অভিজ্ঞ ওলামা ও শিক্ষকদের সরাসরি তত্ত্বাবধানে তাজবিদ সহ কোরআন তেলাওয়াত এবং দ্বীনি শিক্ষা অর্জন করুন।
      </p>
      <div class="flex flex-wrap items-center justify-center gap-3 pt-4">
        <button class="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-md transition-all">
          ফ্রি ট্রায়াল ক্লাস শুরু করুন
        </button>
        <button class="bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-medium px-5 py-2.5 rounded-xl transition-all">
          সিলেবাস ডাউনলোড করুন
        </button>
      </div>
    </div>
  </section>

  <!-- Prayer Times Widget -->
  <section id="prayer" class="py-12 px-4 max-w-5xl mx-auto w-full">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-neutral-900">আজকের নামাজের ওয়াক্ত (ঢাকা)</h2>
      <p class="text-xs text-neutral-500">প্রতিদিনের সঠিক সময়সূচি</p>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div class="bg-white p-4 rounded-xl border border-neutral-200 text-center shadow-xs">
        <div class="text-xs text-neutral-500">ফজর</div>
        <div class="text-lg font-bold text-emerald-700 mt-1">০৪:৫৫ AM</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-neutral-200 text-center shadow-xs">
        <div class="text-xs text-neutral-500">যোহর</div>
        <div class="text-lg font-bold text-emerald-700 mt-1">১২:০৫ PM</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-neutral-200 text-center shadow-xs">
        <div class="text-xs text-neutral-500">আসর</div>
        <div class="text-lg font-bold text-emerald-700 mt-1">০৪:৩০ PM</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-neutral-200 text-center shadow-xs">
        <div class="text-xs text-neutral-500">মাগরিব</div>
        <div class="text-lg font-bold text-emerald-700 mt-1">০৬:১৪ PM</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-neutral-200 text-center shadow-xs col-span-2 sm:col-span-1">
        <div class="text-xs text-neutral-500">এশা</div>
        <div class="text-lg font-bold text-emerald-700 mt-1">০৭:৩০ PM</div>
      </div>
    </div>
  </section>

  <!-- Courses Grid -->
  <section id="courses" class="bg-white py-12 px-4 border-t border-neutral-200">
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-10">
        <h2 class="text-2xl font-bold text-neutral-900">আমাদের জনপ্রিয় কোর্সসমূহ</h2>
        <p class="text-sm text-neutral-500">বয়স ও স্তর অনুযায়ী সাজানো শিক্ষা কার্যক্রম</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="border border-neutral-200 rounded-2xl p-5 hover:border-emerald-500 transition-all bg-neutral-50">
          <span class="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">শিশু ও বয়স্ক</span>
          <h3 class="font-bold text-lg text-neutral-900 mt-2">সহজ কোরআন শিক্ষা ও তাজবিদ</h3>
          <p class="text-xs text-neutral-600 mt-1">৩ মাসে সহিহ শুদ্ধভাবে কোরআন তেলাওয়াত শিখুন।</p>
          <div class="mt-4 pt-4 border-t border-neutral-200 flex justify-between items-center text-xs">
            <span class="font-bold text-emerald-700">৩ মাস মেয়াদী</span>
            <button class="text-emerald-600 font-semibold hover:underline">বিস্তারিত →</button>
          </div>
        </div>
        <div class="border border-neutral-200 rounded-2xl p-5 hover:border-emerald-500 transition-all bg-neutral-50">
          <span class="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">বেসিক</span>
          <h3 class="font-bold text-lg text-neutral-900 mt-2">দৈনন্দিন ইসলাম ও মাসয়ালা</h3>
          <p class="text-xs text-neutral-600 mt-1">পবিত্রতা, নামাজ, রোজা ও লেনদেনের প্রয়োজনীয় জ্ঞান।</p>
          <div class="mt-4 pt-4 border-t border-neutral-200 flex justify-between items-center text-xs">
            <span class="font-bold text-emerald-700">২ মাস মেয়াদী</span>
            <button class="text-emerald-600 font-semibold hover:underline">বিস্তারিত →</button>
          </div>
        </div>
        <div class="border border-neutral-200 rounded-2xl p-5 hover:border-emerald-500 transition-all bg-neutral-50">
          <span class="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">উন্নত স্তর</span>
          <h3 class="font-bold text-lg text-neutral-900 mt-2">কোরআনিক আরবি ভাষা শিক্ষা</h3>
          <p class="text-xs text-neutral-600 mt-1">কোরআনের অর্থ বুঝে পড়ার বাস্তবভিত্তিক ব্যাকরণ।</p>
          <div class="mt-4 pt-4 border-t border-neutral-200 flex justify-between items-center text-xs">
            <span class="font-bold text-emerald-700">৬ মাস মেয়াদী</span>
            <button class="text-emerald-600 font-semibold hover:underline">বিস্তারিত →</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="mt-auto bg-neutral-900 text-neutral-400 py-6 px-4 text-center text-xs">
    <p>© ২০২৬ নূরুল ইসলাম একাডেমি। সর্বস্বত্ব সংরক্ষিত।</p>
  </footer>
</body>
</html>`);

  const generateWebsite = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Create a fully functional, complete, responsive single-page website in HTML5 with Tailwind CSS (using https://cdn.tailwindcss.com) and Hind Siliguri Bengali font for this request:
"${userPrompt}"

Requirements:
- Output MUST be valid HTML5 starting with <!DOCTYPE html> and ending with </html>.
- Include responsive navigation, hero section, interactive components/cards, features, forms or pricing where appropriate, and clean footer.
- Return ONLY the raw HTML code inside \`\`\`html \`\`\` or as pure HTML without extra conversational text.`,
          systemInstruction:
            "You are a master Frontend Web Developer. You generate pristine, modern, responsive websites using Tailwind CSS and Bengali typography. Return ONLY valid HTML code.",
        }),
      });

      const data = await response.json();
      if (data.success && data.text) {
        let code = data.text;
        // Strip markdown code fences if present
        if (code.includes("```html")) {
          code = code.split("```html")[1].split("```")[0];
        } else if (code.includes("```")) {
          code = code.split("```")[1].split("```")[0];
        }
        code = code.trim();
        setHtmlCode(code);
        if (onSaveProjectVersion) {
          onSaveProjectVersion("Generated Website", code);
        }
      }
    } catch (err) {
      console.error("Website generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleModify = async () => {
    if (!modificationPrompt.trim()) return;
    const combinedPrompt = `Here is the existing website HTML code:
\`\`\`html
${htmlCode}
\`\`\`

Please update this website to incorporate the following modification:
"${modificationPrompt}"

Return the entire updated HTML code.`;

    await generateWebsite(combinedPrompt);
    setModificationPrompt("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-website-index.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col bg-neutral-100 overflow-hidden">
      {/* Top Control Bar */}
      <div className="bg-white border-b border-neutral-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-neutral-900 text-sm font-['Hind_Siliguri',sans-serif]">
              ওয়েবসাইট বিল্ডার
            </span>
            <span className="text-[11px] text-neutral-500 block -mt-0.5">
              প্রম্পট → রিয়েলটাইম লাইভ প্রিভিউ → এডিট → এক্সপোর্ট
            </span>
          </div>
        </div>

        {/* Device Mode Switcher (When in Preview) */}
        {activeTab === "preview" && (
          <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200 text-xs">
            <button
              onClick={() => setDeviceView("desktop")}
              className={`p-1.5 rounded flex items-center gap-1 ${
                deviceView === "desktop"
                  ? "bg-white text-neutral-900 shadow-xs font-semibold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
              title="ডেস্কটপ ভিউ"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDeviceView("tablet")}
              className={`p-1.5 rounded flex items-center gap-1 ${
                deviceView === "tablet"
                  ? "bg-white text-neutral-900 shadow-xs font-semibold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
              title="ট্যাবলেট ভিউ"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setDeviceView("mobile")}
              className={`p-1.5 rounded flex items-center gap-1 ${
                deviceView === "mobile"
                  ? "bg-white text-neutral-900 shadow-xs font-semibold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
              title="মোবাইল ভিউ"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        )}

        {/* Tab switch & Actions */}
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
              লাইভ প্রিভিউ
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                activeTab === "code"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              সোর্স কোড (HTML)
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 text-xs flex items-center gap-1"
            title="কোড কপি করুন"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 text-xs flex items-center gap-1"
            title="HTML ফাইল ডাউনলোড করুন"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">এক্সপোর্ট HTML</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Prompt/Modifier panel, Right Live Viewport */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Prompt & Iteration Controller */}
        <div className="w-full md:w-80 lg:w-96 bg-white border-r border-neutral-200 p-4 flex flex-col gap-4 shrink-0 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-800 font-['Hind_Siliguri',sans-serif] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>ওয়েবসাইট তৈরির প্রম্পট</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="কী ধরনের ওয়েবসাইট চান বিস্তারিত লিখুন..."
              className="w-full p-2.5 text-xs rounded-xl border border-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none resize-none font-['Hind_Siliguri',sans-serif]"
            />
            <button
              onClick={() => generateWebsite(prompt)}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>জেনারেট হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>ওয়েবসাইট তৈরি করুন</span>
                </>
              )}
            </button>
          </div>

          <hr className="border-neutral-200" />

          {/* AI Iteration / Modifier Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-800 font-['Hind_Siliguri',sans-serif] flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI দিয়ে পরিবর্তন করুন (Modify with AI)</span>
            </label>
            <p className="text-[11px] text-neutral-500 font-['Hind_Siliguri',sans-serif]">
              যেমন: "ডার্ক মোড যোগ করো", "আরেকটি সেকশন যোগ করো", "বাটনগুলোর রঙ সোনালি করো"
            </p>
            <textarea
              value={modificationPrompt}
              onChange={(e) => setModificationPrompt(e.target.value)}
              rows={2}
              placeholder="কী পরিবর্তন করতে চান লিখুন..."
              className="w-full p-2 text-xs rounded-xl border border-neutral-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none resize-none font-['Hind_Siliguri',sans-serif]"
            />
            <button
              onClick={handleModify}
              disabled={isGenerating || !modificationPrompt.trim()}
              className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-50 cursor-pointer"
            >
              <span>পরিবর্তন প্রয়োগ করুন</span>
            </button>
          </div>

          {/* Quick Ideas */}
          <div className="mt-auto pt-4 border-t border-neutral-100 space-y-1.5">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase">
              কুইক প্রম্পটস:
            </span>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <button
                onClick={() => {
                  setPrompt("একটি রেস্টুরেন্ট এবং অনলাইন ফুড ডেলিভারি ওয়েবসাইট তৈরি করো");
                  generateWebsite("একটি রেস্টুরেন্ট এবং অনলাইন ফুড ডেলিভারি ওয়েবসাইট তৈরি করো");
                }}
                className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded text-neutral-700 text-left"
              >
                🍔 রেস্টুরেন্ট সাইট
              </button>
              <button
                onClick={() => {
                  setPrompt("একটি টেক স্টার্টআপের জন্য আধুনিক ল্যান্ডিং পেজ তৈরি করো");
                  generateWebsite("একটি টেক স্টার্টআপের জন্য আধুনিক ল্যান্ডিং পেজ তৈরি করো");
                }}
                className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded text-neutral-700 text-left"
              >
                🚀 স্টার্টআপ ল্যান্ডিং পেজ
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Viewport Stage */}
        <div className="flex-1 bg-neutral-200 p-3 sm:p-6 flex items-center justify-center overflow-auto">
          {activeTab === "preview" ? (
            <div
              className={`bg-white rounded-xl shadow-lg border border-neutral-300 overflow-hidden transition-all duration-300 flex flex-col ${
                deviceView === "mobile"
                  ? "w-[375px] h-[667px]"
                  : deviceView === "tablet"
                  ? "w-[768px] h-[90%]"
                  : "w-full h-full max-w-6xl"
              }`}
            >
              {/* Browser chrome bar */}
              <div className="bg-neutral-100 border-b border-neutral-200 px-3 py-1.5 flex items-center gap-2 text-xs text-neutral-500 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-white rounded px-2.5 py-0.5 text-center text-[11px] text-neutral-400 truncate border border-neutral-200">
                  https://ai-generated-site.preview
                </div>
              </div>

              {/* Sandboxed IFrame */}
              <iframe
                srcDoc={htmlCode}
                title="AI Website Preview"
                sandbox="allow-scripts allow-modals"
                className="w-full flex-1 border-0 bg-white"
              />
            </div>
          ) : (
            <div className="w-full h-full max-w-5xl bg-neutral-900 rounded-xl overflow-hidden shadow-lg border border-neutral-800 flex flex-col">
              <div className="bg-neutral-950 px-4 py-2 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center gap-2 font-mono">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  <span>index.html (Tailwind CSS + HTML5)</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-[11px]"
                >
                  {copied ? "কপি হয়েছে!" : "কপি কোড"}
                </button>
              </div>
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                className="w-full flex-1 p-4 bg-neutral-900 text-emerald-400 font-mono text-xs focus:outline-none resize-none overflow-auto leading-relaxed"
                spellCheck={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
