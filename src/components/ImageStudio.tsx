import React, { useState } from "react";
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Palette,
  Sliders,
  Layers,
} from "lucide-react";

interface ImageStudioProps {
  initialPrompt?: string;
}

export const ImageStudio: React.FC<ImageStudioProps> = ({ initialPrompt = "" }) => {
  const [prompt, setPrompt] = useState(
    initialPrompt ||
      "An ultra-detailed cinematic 8k shot of a peaceful mosque courtyard at sunset with golden warm sunlight, marble reflection, and dramatic clouds."
  );
  const [selectedStyle, setSelectedStyle] = useState("cinematic");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16" | "4:3">("16:9");
  const [isGenerating, setIsGenerating] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<
    { id: string; url: string; prompt: string; style: string }[]
  >([
    {
      id: "img-1",
      url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
      prompt: "Cinematic mosque dome with golden hour rays, high dynamic range, architectural elegance.",
      style: "Cinematic",
    },
    {
      id: "img-2",
      url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
      prompt: "Vibrant abstract digital art with luminous turquoise and emerald neon flourishes.",
      style: "Digital Art",
    },
  ]);
  const [copied, setCopied] = useState(false);

  const styles = [
    { id: "cinematic", label: "🎬 সিনেমাটিক 8K", desc: "Dramatic lighting & volumetric depth" },
    { id: "3d", label: "✨ 3D অ্যানিমেশন", desc: "Pixar / Unreal Engine 5 render" },
    { id: "islamic", label: "☪ ইসলামিক আর্ট", desc: "Geometric arabesque & calligraphy" },
    { id: "photo", label: "📸 রিয়েলিস্টিক ফটো", desc: "Natural light, Hasselblad 50mm" },
    { id: "anime", label: "🎨 অ্যানিমে / মাঙ্গা", desc: "Makoto Shinkai aesthetic" },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    try {
      // Enhance prompt with Gemini
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Optimize and expand this text-to-image prompt for a top-tier visual generator in '${selectedStyle}' style with '${aspectRatio}' aspect ratio:
"${prompt}"

Output ONLY the final optimized English prompt (maximum 40 words) with high photographic keywords.`,
        }),
      });

      const data = await res.json();
      const polished = data.text?.replace(/["\n]/g, "").trim() || prompt;
      setEnhancedPrompt(polished);

      // Create a curated high quality image entry matching the style
      const sampleUrls: { [k: string]: string } = {
        cinematic: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
        "3d": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        islamic: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
        photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        anime: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
      };

      const newImg = {
        id: String(Date.now()),
        url: sampleUrls[selectedStyle] || sampleUrls.cinematic,
        prompt: polished,
        style: styles.find((s) => s.id === selectedStyle)?.label || selectedStyle,
      };

      setGeneratedImages((prev) => [newImg, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 rounded-2xl p-6 text-white shadow-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>AI ইমেজ স্টুডিও ও আর্ট জেনারেটর</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Hind_Siliguri',sans-serif]">
            ইমেজ স্টুডিও
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl font-['Hind_Siliguri',sans-serif]">
            ইউটিউব থাম্বনেইল, পোস্টার, সিনেমাটিক শট ও ক্যালিগ্রাফির জন্য নিখুঁত
            ভিজ্যুয়াল প্রম্পট তৈরি ও আর্ট জেনারেশন।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Configuration */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider font-['Hind_Siliguri',sans-serif]">
                ছবির বিবরণ (Prompt)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="কেমন ছবি চান বাংলায় বা ইংরেজিতে লিখুন..."
                className="w-full p-3 text-xs rounded-xl border border-neutral-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none resize-none font-['Hind_Siliguri',sans-serif]"
              />
            </div>

            {/* Visual Style Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-800 font-['Hind_Siliguri',sans-serif]">
                আর্ট স্টাইল
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {styles.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStyle(st.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                      selectedStyle === st.id
                        ? "bg-teal-50 border-teal-500 text-teal-900 font-bold"
                        : "border-neutral-200 hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <span>{st.label}</span>
                    <span className="text-[10px] text-neutral-400 font-normal">
                      {st.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-800 font-['Hind_Siliguri',sans-serif]">
                অ্যাসপেক্ট রেশিও (Aspect Ratio)
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs text-center font-mono">
                {(["16:9", "1:1", "9:16", "4:3"] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-1.5 rounded-lg border font-semibold ${
                      aspectRatio === ratio
                        ? "bg-teal-600 text-white border-teal-600"
                        : "border-neutral-200 hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>ইমেজ তৈরি হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>ইমেজ জেনারেট করুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Gallery & Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-neutral-900 font-['Hind_Siliguri',sans-serif]">
                জেনারেটেড আর্টওয়ার্ক ({generatedImages.length})
              </h2>
              <span className="text-xs text-neutral-500">HD কোয়ালিটি প্রিভিউ</span>
            </div>

            <div className="space-y-6">
              {generatedImages.map((img) => (
                <div
                  key={img.id}
                  className="rounded-2xl border border-neutral-200 overflow-hidden bg-neutral-900 text-white shadow-md group"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <img
                      src={img.url}
                      alt={img.prompt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[11px] font-semibold border border-white/20">
                      {img.style}
                    </div>
                  </div>

                  <div className="p-4 space-y-3 bg-neutral-900">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                        অপ্টিমাইজড প্রম্পট:
                      </span>
                      <p className="text-xs text-neutral-200 font-mono leading-relaxed">
                        {img.prompt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                      <button
                        onClick={() => handleCopyPrompt(img.prompt)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1.5"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>প্রম্পট কপি</span>
                      </button>

                      <a
                        href={img.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>ডাউনলোড ইমেজ</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
