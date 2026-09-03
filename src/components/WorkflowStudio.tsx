import React, { useState } from "react";
import {
  GitBranch,
  Play,
  RotateCcw,
  Sparkles,
  Plus,
  ArrowDown,
  CheckCircle2,
  Clock,
  Settings,
  Layers,
  FileText,
  Image as ImageIcon,
  Volume2,
  Film,
  Code,
  Download,
  Trash2,
  Check,
  AlertCircle,
} from "lucide-react";
import { WorkflowNode } from "../types";

export const WorkflowStudio: React.FC = () => {
  const [activeWorkflowTemplate, setActiveWorkflowTemplate] = useState<"video" | "webapp" | "social">("video");
  const [isRunning, setIsRunning] = useState(false);
  const [activeNodeIndex, setActiveNodeIndex] = useState<number | null>(null);

  // Workflow Pipeline Nodes
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: "node-1",
      title: "1. Input Concept",
      type: "input",
      status: "completed",
      config: { prompt: "সকালের মানসিক প্রশান্তি ও মেডিটেশন গাইড" },
      output: "কনসেপ্ট: সকালের মানসিক প্রশান্তি ও মেডিটেশন গাইড (৬০ সেকেন্ড শর্ট)",
    },
    {
      id: "node-2",
      title: "2. AI Script Generator",
      type: "text",
      status: "idle",
      config: { model: "gemini-2.5-flash", words: 120 },
      output: "স্ক্রিপ্ট: 'ভোরবেলা যখন পৃথিবী শান্ত থাকে, নিজেকে নতুন করে আবিষ্কারের সেরা সময় তখন শুরু হয়...'",
    },
    {
      id: "node-3",
      title: "3. Image Diffusion Generator",
      type: "image",
      status: "idle",
      config: { style: "Cinematic 8K", count: 3 },
      output: "৩টি হাই-রেজোলিউশন সিনেমাটিক ফ্রেম তৈরি হয়েছে (পদ্মা নদী, সকালের সূর্য ও শিশিরবিন্দু)",
    },
    {
      id: "node-4",
      title: "4. Neural Voiceover (TTS)",
      type: "audio",
      status: "idle",
      config: { voice: "Fenrir (Bangla Natural)", speed: "1.0x" },
      output: "অডিও সিন্থেসিস সম্পন্ন: 48kHz WAV ফাইল প্রস্তুত।",
    },
    {
      id: "node-5",
      title: "5. Video Timeline Compiler",
      type: "video",
      status: "idle",
      config: { resolution: "1080p", fps: 60, format: "MP4" },
      output: "ফাইনাল 1080p MP4 ভিডিও রেন্ডার সম্পন্ন হয়েছে।",
    },
  ]);

  const handleRunPipeline = async () => {
    setIsRunning(true);
    // Reset statuses
    setNodes((prev) => prev.map((n, i) => ({ ...n, status: i === 0 ? "completed" : "pending" })));

    for (let i = 1; i < nodes.length; i++) {
      setActiveNodeIndex(i);
      setNodes((prev) =>
        prev.map((n, idx) => (idx === i ? { ...n, status: "running" } : n))
      );

      // Simulate step execution with backend ping
      await new Promise((r) => setTimeout(r, 900));

      setNodes((prev) =>
        prev.map((n, idx) => (idx === i ? { ...n, status: "completed" } : n))
      );
    }

    setActiveNodeIndex(null);
    setIsRunning(false);
  };

  const handleAddNode = (type: "text" | "image" | "audio" | "video" | "code") => {
    const typeNames: Record<string, string> = {
      text: "AI Text Transformer",
      image: "Image Generator",
      audio: "Voice Synthesizer",
      video: "Video Compiler",
      code: "Code Runner",
    };

    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      title: `${nodes.length + 1}. ${typeNames[type]}`,
      type,
      status: "idle",
      config: {},
      output: "অ্যাকশন এখনো রান করা হয়নি।",
    };

    setNodes((prev) => [...prev, newNode]);
  };

  const handleDeleteNode = (id: string) => {
    if (nodes.length <= 2) return;
    setNodes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div id="workflow-studio-container" className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-blue-900 to-neutral-900 rounded-3xl p-6 text-white shadow-xl border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <GitBranch className="w-3.5 h-3.5" />
            <span>AI WORKFLOW ENGINE STUDIO V2</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            অটোমেটেড ওয়ার্কফ্লো ও পাইপলাইন ইঞ্জিন
          </h1>
          <p className="text-indigo-200/90 text-xs md:text-sm mt-1">
            Input → Prompt → Image → Voiceover → Video Compiler → Final Output সম্পূর্ণ চেইনিং।
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setNodes((prev) =>
                prev.map((n, i) => ({ ...n, status: i === 0 ? "completed" : "idle" }))
              );
              setActiveNodeIndex(null);
            }}
            className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            title="পাইপলাইন রিসেট"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            id="run-workflow-pipeline-btn"
            disabled={isRunning}
            onClick={handleRunPipeline}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs md:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRunning ? "পাইপলাইন চলছে..." : "রান পাইপলাইন (Execute All)"}</span>
          </button>
        </div>
      </div>

      {/* Main Workflow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Node Canvas */}
        <div className="lg:col-span-8 bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                নোড পাইপলাইন ক্যানভাস (Sequential Flow)
              </h3>
            </div>
            <span className="text-xs font-mono text-neutral-500">{nodes.length} টি নোড সক্রিয়</span>
          </div>

          {/* Sequential Pipeline Nodes */}
          <div className="space-y-3 relative">
            {nodes.map((node, index) => {
              const isExecuting = activeNodeIndex === index;
              const isDone = node.status === "completed";

              const getNodeIcon = (type: string) => {
                switch (type) {
                  case "input":
                    return <FileText className="w-4 h-4 text-neutral-400" />;
                  case "text":
                    return <Sparkles className="w-4 h-4 text-blue-500" />;
                  case "image":
                    return <ImageIcon className="w-4 h-4 text-pink-500" />;
                  case "audio":
                    return <Volume2 className="w-4 h-4 text-purple-500" />;
                  case "video":
                    return <Film className="w-4 h-4 text-red-500" />;
                  case "code":
                    return <Code className="w-4 h-4 text-emerald-500" />;
                  default:
                    return <Sparkles className="w-4 h-4 text-indigo-500" />;
                }
              };

              return (
                <div key={node.id} className="relative">
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isExecuting
                        ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30 shadow-md"
                        : isDone
                        ? "bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700"
                        : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 opacity-80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                          {getNodeIcon(node.type)}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                            {node.title}
                          </h4>
                          <span className="text-[10px] uppercase font-mono text-neutral-400">
                            Type: {node.type}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                            node.status === "completed"
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                              : node.status === "running"
                              ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 animate-pulse"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                          }`}
                        >
                          {node.status === "completed" && <CheckCircle2 className="w-3 h-3" />}
                          {node.status === "running" && <Clock className="w-3 h-3 animate-spin" />}
                          <span className="capitalize">{node.status}</span>
                        </span>

                        {nodes.length > 2 && index > 0 && (
                          <button
                            onClick={() => handleDeleteNode(node.id)}
                            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-neutral-400"
                            title="রিমুভ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Output display */}
                    {node.output && (
                      <div className="mt-3 p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 font-sans">
                        {node.output}
                      </div>
                    )}
                  </div>

                  {/* Flow Connector Arrow */}
                  {index < nodes.length - 1 && (
                    <div className="flex justify-center py-1">
                      <div className="w-0.5 h-4 bg-neutral-300 dark:bg-neutral-700 relative">
                        <ArrowDown className="w-3 h-3 text-neutral-400 dark:text-neutral-500 absolute -bottom-2 -left-1" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add New Node Bar */}
          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-neutral-600 dark:text-neutral-400 text-xs mr-1">
              + নোড যোগ করুন:
            </span>
            <button
              onClick={() => handleAddNode("text")}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 font-semibold"
            >
              + Text Prompt
            </button>
            <button
              onClick={() => handleAddNode("image")}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 font-semibold"
            >
              + Image Generator
            </button>
            <button
              onClick={() => handleAddNode("audio")}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 font-semibold"
            >
              + Voiceover
            </button>
            <button
              onClick={() => handleAddNode("code")}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 font-semibold"
            >
              + Code Runner
            </button>
          </div>
        </div>

        {/* Right: Pipeline Output & Templates */}
        <div className="lg:col-span-4 space-y-4">
          {/* Templates Panel */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              রেডিমেড পাইপলাইন টেমপ্লেট
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveWorkflowTemplate("video")}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                  activeWorkflowTemplate === "video"
                    ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-800 dark:text-indigo-200 font-bold"
                    : "bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <div className="font-bold">🎬 YouTube Video Automation</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">
                  Concept → Script → Image → Voice → Video MP4
                </div>
              </button>

              <button
                onClick={() => setActiveWorkflowTemplate("webapp")}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                  activeWorkflowTemplate === "webapp"
                    ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-800 dark:text-indigo-200 font-bold"
                    : "bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <div className="font-bold">🌐 Complete Web App Builder</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">
                  Idea → Architecture → HTML/Tailwind → React Export
                </div>
              </button>

              <button
                onClick={() => setActiveWorkflowTemplate("social")}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                  activeWorkflowTemplate === "social"
                    ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-800 dark:text-indigo-200 font-bold"
                    : "bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <div className="font-bold">📢 Social Media Content Factory</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">
                  Topic → Viral Copy → Thumbnail → Tags
                </div>
              </button>
            </div>
          </div>

          {/* Final Output Summary Package */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                ফাইনাল এক্সপোর্ট প্যাকেজ
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded font-bold">
                READY
              </span>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              পাইপলাইনের সমস্ত আউটপুট (স্ক্রিপ্ট, ইমেজ এসেট, অডিও ফাইল ও রেন্ডার কনফিগ) এক ক্লিকে ডাউনলোড করুন।
            </p>

            <button
              onClick={() => alert("সম্পূর্ণ ওয়ার্কফ্লো আউটপুট বান্ডল ডাউনলোড সম্পন্ন হয়েছে!")}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>ডাউনলোড অল এসেটস</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
