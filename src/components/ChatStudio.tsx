import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  Zap,
  Brain,
  User,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ChatMessage } from "../types";

interface ChatStudioProps {
  initialPrompt?: string;
  onSendToAudio?: (text: string) => void;
}

export const ChatStudio: React.FC<ChatStudioProps> = ({
  initialPrompt = "",
  onSendToAudio,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      role: "assistant",
      content: `আসসালামু আলাইকুম! আমি **STUDIO X** — আপনার অল-ইন-ওয়ান এআই ক্রিয়েশন স্টুডিওর সুপার ইন্টেলিজেন্ট এআই পার্টনার। 

আমি আপনাকে সাহায্য করতে পারি:
- 💡 যেকোনো জটিল প্রশ্নের ব্যাখ্যা, গবেষণা ও পরিকল্পনা তৈরি
- 📝 হাই-কোয়ালিটি স্ক্রিপ্ট, ব্লগ, আর্টিকেল বা সোশ্যাল মিডিয়া কনটেন্ট তৈরি
- 💻 কোডিং, সমস্যা সমাধান ও অ্যালগরিদম ডিজাইন
- 🎬 ইউটিউব ভিডিও আইডিয়া, এসইও ও মার্কেটিং স্ট্র্যাটেজি

আজ আপনি কী তৈরি করতে চান বা কী বিষয়ে জানতে চান বলুন!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      model: "gemini-3.8-flash",
    },
  ]);

  const [input, setInput] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeepReasoning, setIsDeepReasoning] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Handle initial prompt if provided
  useEffect(() => {
    if (initialPrompt && messages.length === 1) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend.trim(),
          systemInstruction: isDeepReasoning
            ? "You are a Deep Reasoning Super-Genius AI. Analyze with high intellect, mathematical logic, step-by-step thinking, and thoroughness. Respond fluently in Bengali or English as appropriate."
            : "You are an affectionate, genius, helpful AI assistant named 'বাংলা ভয়েস ও ক্রিয়েশন স্টুডিও মাস্টার'. Provide structured, clean, engaging answers in Bengali with formatting.",
        }),
      });

      const data = await response.json();
      if (data.success && data.text) {
        const assistantMsg: ChatMessage = {
          id: String(Date.now() + 1),
          role: "assistant",
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          model: data.model,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col bg-neutral-50 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-neutral-900 text-sm font-['Hind_Siliguri',sans-serif]">
              এআই চ্যাট ও রিযনিং হাব
            </span>
            <span className="text-[11px] text-neutral-500 block -mt-0.5">
              মাল্টিমডাল প্ল্যানিং, ব্যাখ্যা ও কনটেন্ট স্ট্র্যাটেজি
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Deep Reasoning Switcher */}
          <button
            onClick={() => setIsDeepReasoning(!isDeepReasoning)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              isDeepReasoning
                ? "bg-purple-50 text-purple-800 border-purple-300 shadow-xs"
                : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200"
            }`}
          >
            {isDeepReasoning ? (
              <>
                <Brain className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                <span>ডিপ রিজনিং মোড অন</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>ফাস্ট রেসপন্স মোড</span>
              </>
            )}
          </button>

          <button
            onClick={() =>
              setMessages([
                {
                  id: "msg-1",
                  role: "assistant",
                  content: "নতুন কথোপকথন শুরু হলো। আজ কীভাবে সাহায্য করতে পারি?",
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
              ])
            }
            className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-xs"
            title="নতুন চ্যাট শুরু করুন"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-2 text-sm leading-relaxed ${
                  isUser
                    ? "bg-emerald-600 text-white shadow-xs rounded-tr-none"
                    : "bg-white border border-neutral-200 text-neutral-800 shadow-xs rounded-tl-none font-['Hind_Siliguri',sans-serif]"
                }`}
              >
                {/* Content */}
                {isUser ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <div className="prose prose-sm max-w-none text-neutral-800">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}

                {/* Footer Controls on assistant msg */}
                <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-400">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 rounded hover:bg-neutral-100 text-neutral-500 flex items-center gap-0.5"
                        title="কপি করুন"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>

                      {onSendToAudio && (
                        <button
                          onClick={() => onSendToAudio(msg.content)}
                          className="p-1 rounded hover:bg-neutral-100 text-purple-700 flex items-center gap-0.5"
                          title="ভয়েস তৈরি করুন"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span className="text-[10px]">ভয়েস শুনুন</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-neutral-200 rounded-2xl rounded-tl-none p-4 shadow-xs flex items-center gap-2 text-xs text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              <span className="font-['Hind_Siliguri',sans-serif] ml-1">
                চিন্তা ও উত্তর তৈরি হচ্ছে...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="bg-white border-t border-neutral-200 p-3 sm:p-4 shrink-0">
        <div className="max-w-4xl mx-auto flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="আপনার প্রশ্ন বা নির্দেশনা বাংলায় লিখুন..."
            rows={2}
            className="flex-1 p-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none resize-none text-sm font-['Hind_Siliguri',sans-serif]"
          />
          <button
            onClick={() => handleSend()}
            disabled={isGenerating || !input.trim()}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs disabled:opacity-50 transition-all cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
