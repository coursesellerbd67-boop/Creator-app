import React, { useState } from "react";
import {
  Bot,
  Sparkles,
  Cpu,
  Database,
  FileText,
  Upload,
  Send,
  Plus,
  Trash2,
  Check,
  Code,
  Image as ImageIcon,
  Globe,
  Volume2,
  Play,
  Settings,
  Search,
  CheckCircle2,
} from "lucide-react";
import { CustomAgent } from "../types";

interface CustomAgentStudioProps {
  onAgentCreated?: (agent: CustomAgent) => void;
}

export const CustomAgentStudio: React.FC<CustomAgentStudioProps> = ({ onAgentCreated }) => {
  const [agents, setAgents] = useState<CustomAgent[]>([
    {
      id: "agent-1",
      name: "বাংলা কন্টেন্ট ও ইউটিউব স্পেশালিস্ট",
      description: "ভিডিও স্ক্রিপ্ট, থাম্বনেইল প্রম্পট এবং এসইও ট্যাগ তৈরিতে পারদর্শী।",
      systemPrompt:
        "You are an expert Bengali YouTube & Media Agent. You craft viral video hooks, detailed narration scripts, and DALL-E image prompts.",
      allowedTools: ["image_generator", "voiceover", "web_search"],
      knowledgeBaseFiles: ["youtube_algorithm_2026.pdf"],
      model: "gemini-2.5-flash",
      avatarIcon: "🎬",
    },
    {
      id: "agent-2",
      name: "ফুল-স্ট্যাক ওয়েব ও কোড আর্কিটেক্ট",
      description: "ওয়েবসাইট ও আধুনিক সফটওয়্যার আর্কিটেকচার তৈরির এক্সপার্ট।",
      systemPrompt:
        "You are a Senior Full-Stack Software Engineer. You write clean, modular, production-ready code with Tailwind and TypeScript.",
      allowedTools: ["code_runner", "website_builder", "web_search"],
      knowledgeBaseFiles: ["clean_code_guidelines.txt"],
      model: "gemini-2.5-pro",
      avatarIcon: "💻",
    },
  ]);

  const [selectedAgentId, setSelectedAgentId] = useState<string>("agent-1");

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<"gemini-2.5-flash" | "gemini-2.5-pro">("gemini-2.5-flash");
  const [allowedTools, setAllowedTools] = useState<string[]>(["image_generator", "web_search"]);
  const [knowledgeBase, setKnowledgeBase] = useState<string[]>(["company_faq.txt"]);
  const [newKnowledgeDoc, setNewKnowledgeDoc] = useState("");

  // Interactive Test Chat
  const [testMessages, setTestMessages] = useState<
    { sender: "user" | "agent"; text: string; toolUsed?: string }[]
  >([
    {
      sender: "agent",
      text: "সালাম! আমি আপনার কাস্টম এআই এজেন্ট। আমাকে যেকোনো কাজ দিন, আমি নির্দিষ্ট টুলস ও নলেজবেজ দিয়ে সমাধান করব।",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const availableTools = [
    { id: "image_generator", label: "Image Generator", icon: ImageIcon, desc: "এআই ছবি ও থাম্বনেইল বানায়" },
    { id: "code_runner", label: "Code Runner", icon: Code, desc: "কোড বিশ্লেষণ ও এক্সিকিউট করে" },
    { id: "web_search", label: "Web Search", icon: Search, desc: "রিয়েলটাইম ইন্টারনেট সার্চ ও রিসার্চ" },
    { id: "voiceover", label: "Voiceover (TTS)", icon: Volume2, desc: "ন্যাচারাল ভয়েস সিন্থেসিস" },
    { id: "website_builder", label: "Website Builder", icon: Globe, desc: "কমপ্লিট রেসপনসিভ ওয়েব পেজ তৈরি" },
  ];

  const handleToggleTool = (toolId: string) => {
    setAllowedTools((prev) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
    );
  };

  const handleCreateAgent = () => {
    if (!name.trim() || !systemPrompt.trim()) {
      alert("এজেন্টের নাম ও সিস্টেম প্রম্পট বাধ্যতামূলক!");
      return;
    }

    const newAgent: CustomAgent = {
      id: `agent-${Date.now()}`,
      name,
      description: description || "কাস্টম কনফিগার করা পার্সোনালাইজড এআই এজেন্ট।",
      systemPrompt,
      allowedTools,
      knowledgeBaseFiles: knowledgeBase,
      model: selectedModel,
      avatarIcon: "🤖",
    };

    setAgents((prev) => [newAgent, ...prev]);
    setSelectedAgentId(newAgent.id);
    setName("");
    setDescription("");
    setSystemPrompt("");
    alert(`এজেন্ট '${newAgent.name}' সফলভাবে তৈরি হয়েছে!`);

    if (onAgentCreated) {
      onAgentCreated(newAgent);
    }
  };

  const handleSendMessage = async () => {
    if (!inputQuery.trim()) return;
    const query = inputQuery;
    setInputQuery("");
    setTestMessages((prev) => [...prev, { sender: "user", text: query }]);
    setIsProcessing(true);

    const activeAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "custom_agent",
          prompt: query,
          systemInstruction: `${activeAgent.systemPrompt}\n\nAllowed Tools: ${activeAgent.allowedTools.join(
            ", "
          )}\nKnowledge Base: ${activeAgent.knowledgeBaseFiles?.join(", ") || "None"}`,
          model: activeAgent.model,
        }),
      });

      const data = await res.json();
      const responseText = data.text || "আমি আপনার নির্দেশ অনুযায়ী কাজটি সম্পন্ন করেছি।";
      const usedTool = activeAgent.allowedTools[0];

      setTestMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: responseText,
          toolUsed: usedTool,
        },
      ]);
    } catch (e) {
      setTestMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: "দুঃখিত, কোনো ত্রুটি হয়েছে। পুনরায় চেষ্টা করুন।",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  return (
    <div id="custom-agent-studio-container" className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-neutral-900 rounded-3xl p-6 text-white shadow-xl border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>CUSTOM AGENT BUILDER STUDIO V2</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            কাস্টম এআই এজেন্ট মেকার ও টুল কনফিগারেশন
          </h1>
          <p className="text-emerald-200/90 text-xs md:text-sm mt-1">
            আপনার পছন্দের নামে নিজস্ব এআই এজেন্ট তৈরি করুন—টুলস পারমিশন, নলেজবেজ এবং জেমিনাই মডেল নির্বাচন করুন।
          </p>
        </div>

        <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-2 rounded-2xl">
          <span className="text-xs text-neutral-300">মোট সক্রিয় এজেন্ট:</span>
          <span className="px-2 py-0.5 bg-emerald-600 rounded-lg text-xs font-bold text-white">
            {agents.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Agent Creator Form */}
        <div className="lg:col-span-6 bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>নতুন এজেন্ট ডিজাইন করুন</span>
            </h3>
            <span className="text-[11px] text-neutral-500">Autonomous Agent Spec</span>
          </div>

          <div className="space-y-3">
            {/* Agent Name */}
            <div>
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block mb-1">
                এজেন্টের নাম (Agent Name):
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: ই-কমার্স সেলস এক্সপার্ট"
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* System Prompt */}
            <div>
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block mb-1">
                সিস্টেম প্রম্পট ও পার্সোনা (System Prompt):
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={3}
                placeholder="এজেন্ট কীভাবে ব্যবহারকারীর সাথে কথা বলবে, কী নিয়ম মেনে চলবে..."
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Model Selector */}
            <div>
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block mb-1">
                মডেল নির্বাচন (AI Brain):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedModel("gemini-2.5-flash")}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    selectedModel === "gemini-2.5-flash"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  <div className="font-bold">⚡ Gemini 2.5 Flash</div>
                  <div className="text-[10px] opacity-70">আল্ট্রা-ফাস্ট ও রেসপন্সিভ</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedModel("gemini-2.5-pro")}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    selectedModel === "gemini-2.5-pro"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  <div className="font-bold">🧠 Gemini 2.5 Pro</div>
                  <div className="text-[10px] opacity-70">জটিল যুক্তি ও কোডিং</div>
                </button>
              </div>
            </div>

            {/* Allowed Tools */}
            <div>
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block mb-1">
                অনুমোদিত টুলস (Allowed Tools):
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {availableTools.map((tool) => {
                  const isChecked = allowedTools.includes(tool.id);
                  const ToolIcon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => handleToggleTool(tool.id)}
                      className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 text-emerald-900 dark:text-emerald-200"
                          : "bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ToolIcon className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="text-xs font-bold">{tool.label}</div>
                          <div className="text-[10px] text-neutral-500">{tool.desc}</div>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-neutral-400"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Knowledge Base */}
            <div>
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block mb-1">
                নলেজ বেস (Upload PDF / Text Knowledge):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKnowledgeDoc}
                  onChange={(e) => setNewKnowledgeDoc(e.target.value)}
                  placeholder="ফাইলের নাম বা তথ্যের রেফারেন্স লিখুন..."
                  className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newKnowledgeDoc.trim()) {
                      setKnowledgeBase([...knowledgeBase, newKnowledgeDoc.trim()]);
                      setNewKnowledgeDoc("");
                    }
                  }}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-lg flex-shrink-0"
                >
                  যোগ করুন
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {knowledgeBase.map((doc, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-md text-[11px] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                  >
                    <FileText className="w-3 h-3 text-emerald-600" />
                    <span>{doc}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Create Button */}
            <button
              type="button"
              onClick={handleCreateAgent}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>এজেন্টটি সংরক্ষণ ও সক্রিয় করুন</span>
            </button>
          </div>
        </div>

        {/* Right: Live Interactive Agent Playground */}
        <div className="lg:col-span-6 bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentAgent.avatarIcon || "🤖"}</span>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    {currentAgent.name}
                  </h3>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                    Model: {currentAgent.model} • Tools: {currentAgent.allowedTools.length} Active
                  </p>
                </div>
              </div>

              {/* Agent Selector Dropdown */}
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none"
              >
                {agents.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Chat conversation area */}
            <div className="h-[360px] overflow-y-auto space-y-2.5 p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800">
              {testMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-emerald-600 text-white"
                        : "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 shadow-xs"
                    }`}
                  >
                    {msg.toolUsed && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold mb-1.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Tool: {msg.toolUsed}</span>
                      </div>
                    )}
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-center gap-1 text-xs text-neutral-400 p-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>এজেন্ট প্রসেস করছে...</span>
                </div>
              )}
            </div>
          </div>

          {/* Chat Input Bar */}
          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={`${currentAgent.name}-কে কাজ দিন...`}
              className="flex-1 px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
            <button
              disabled={isProcessing || !inputQuery.trim()}
              onClick={handleSendMessage}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow transition-all disabled:opacity-50 flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>রান</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
