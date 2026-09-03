import React, { useState } from "react";
import {
  Code2,
  Play,
  Copy,
  Download,
  Check,
  Sparkles,
  Bug,
  HelpCircle,
  RefreshCw,
  Terminal,
} from "lucide-react";

interface CodeStudioProps {
  initialPrompt?: string;
}

export const CodeStudio: React.FC<CodeStudioProps> = ({ initialPrompt = "" }) => {
  const [prompt, setPrompt] = useState(
    initialPrompt ||
      "Node.js Express এবং TypeScript দিয়ে একটি সুরক্ষিত JWT Authentication ও ইউজার লগইন API তৈরি করো।"
  );
  const [language, setLanguage] = useState("typescript");
  const [isProcessing, setIsProcessing] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [code, setCode] = useState<string>(() => `import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "super-secure-key-2026";
const usersDB: any[] = []; // In-memory database

// 1. User Registration Route
app.post("/api/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const existing = usersDB.find((u) => u.email === email);
    if (existing) {
      return res.status(409).json({ error: "User already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), name, email, password: hashedPassword };
    usersDB.push(newUser);

    res.status(201).json({ success: true, message: "User created successfully." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. User Login Route
app.post("/api/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = usersDB.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Auth Server running on port 3000"));
`);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    setExplanation(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write clean, production-ready, well-commented ${language} code for:
"${prompt}"

Return ONLY the raw code inside code blocks, or pure code without markdown chatter.`,
          systemInstruction:
            "You are an Elite Senior Software Architect. Return clean, bug-free, modern code.",
        }),
      });

      const data = await res.json();
      if (data.success && data.text) {
        let clean = data.text;
        if (clean.includes("```")) {
          const parts = clean.split("```");
          clean = parts[1] || parts[0];
          if (clean.startsWith(language)) {
            clean = clean.slice(language.length);
          }
        }
        setCode(clean.trim());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExplain = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Explain this ${language} code clearly in Bengali (বাংলা) with bullet points and best practice tips:
\`\`\`${language}
${code}
\`\`\``,
        }),
      });

      const data = await res.json();
      if (data.success && data.text) {
        setExplanation(data.text);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFixBugs = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Review this ${language} code, identify any bugs or security flaws, and fix them. Return the improved code and brief fixes in Bengali:
\`\`\`${language}
${code}
\`\`\``,
        }),
      });

      const data = await res.json();
      if (data.success && data.text) {
        setExplanation(data.text);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col bg-neutral-900 text-white overflow-hidden">
      {/* Top Bar */}
      <div className="bg-neutral-950 border-b border-neutral-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm font-['Hind_Siliguri',sans-serif]">
              কোড স্টুডিও
            </span>
            <span className="text-[11px] text-neutral-400 block -mt-0.5">
              মাল্টি-ল্যাঙ্গুয়েজ কোড জেনারেশন, ডিবাগিং ও ব্যাখ্যা
            </span>
          </div>
        </div>

        {/* Language selector & actions */}
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="typescript">TypeScript / Node.js</option>
            <option value="javascript">JavaScript (ES6+)</option>
            <option value="python">Python 3</option>
            <option value="php">PHP / Laravel</option>
            <option value="html">HTML / Tailwind</option>
            <option value="sql">SQL / PostgreSQL</option>
          </select>

          <button
            onClick={handleExplain}
            disabled={isProcessing}
            className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center gap-1 font-['Hind_Siliguri',sans-serif]"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>বাংলায় ব্যাখ্যা</span>
          </button>

          <button
            onClick={handleFixBugs}
            disabled={isProcessing}
            className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center gap-1 font-['Hind_Siliguri',sans-serif]"
          >
            <Bug className="w-3.5 h-3.5 text-amber-400" />
            <span>বাগ ফিক্স</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">কপি</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Prompt & Instructions */}
        <div className="w-full md:w-80 lg:w-96 bg-neutral-950 border-r border-neutral-800 p-4 flex flex-col gap-4 shrink-0 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-300 font-['Hind_Siliguri',sans-serif] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>কী কোড তৈরি করতে চান?</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full p-2.5 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none font-['Hind_Siliguri',sans-serif]"
            />
            <button
              onClick={handleGenerate}
              disabled={isProcessing || !prompt.trim()}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>কোড লেখা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>কোড তৈরি করুন</span>
                </>
              )}
            </button>
          </div>

          {/* Explanation Output if any */}
          {explanation && (
            <div className="space-y-1.5 pt-2 border-t border-neutral-800">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400 font-['Hind_Siliguri',sans-serif]">
                <span>এআই রিভিউ ও ব্যাখ্যা:</span>
                <button
                  onClick={() => setExplanation(null)}
                  className="text-neutral-500 hover:text-neutral-300 text-[10px]"
                >
                  বন্ধ করুন
                </button>
              </div>
              <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto font-['Hind_Siliguri',sans-serif]">
                {explanation}
              </div>
            </div>
          )}

          {/* Quick Snippet Buttons */}
          <div className="mt-auto pt-3 border-t border-neutral-800 space-y-1.5 text-xs">
            <span className="text-neutral-400 font-semibold font-['Hind_Siliguri',sans-serif]">
              কুইক টেমপ্লেট:
            </span>
            <div className="flex flex-col gap-1 text-[11px]">
              <button
                onClick={() => {
                  setLanguage("python");
                  setPrompt("Python দিয়ে একটি ফাস্টএপিআই (FastAPI) ক্রুড (CRUD) ব্যাকএন্ড তৈরি করো।");
                }}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-800 rounded text-neutral-300 text-left"
              >
                🐍 Python FastAPI CRUD
              </button>
              <button
                onClick={() => {
                  setLanguage("sql");
                  setPrompt("ই-কমার্স অর্ডারিং ও ইনভেন্টরির জন্য রিলেশনাল SQL ডেটাবেস স্কিমা তৈরি করো।");
                }}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-800 rounded text-neutral-300 text-left"
              >
                🗄️ E-Commerce SQL Schema
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Code Editor Workspace */}
        <div className="flex-1 bg-neutral-900 flex flex-col overflow-hidden">
          <div className="bg-neutral-950 px-4 py-1.5 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>main.{language === "typescript" ? "ts" : language === "python" ? "py" : language}</span>
            </span>
            <span className="text-[11px] text-neutral-500">
              {code.split("\n").length} লাইন • UTF-8
            </span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full flex-1 p-4 bg-neutral-900 text-emerald-300 font-mono text-xs focus:outline-none resize-none overflow-auto leading-relaxed selection:bg-emerald-900"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};
