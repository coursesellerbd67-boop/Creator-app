import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, Modality } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

let aiInstance: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiInstance && process.env.GEMINI_API_KEY) {
    aiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

function pcmToWav(
  pcmData: Buffer,
  sampleRate = 24000,
  numChannels = 1,
  bitsPerSample = 16
): Buffer {
  if (pcmData.length >= 4 && pcmData.toString("utf8", 0, 4) === "RIFF") {
    return pcmData;
  }

  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmData.length;
  const chunkSize = 36 + dataSize;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(chunkSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM = 1
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmData]);
}

// API Route: Health & Capabilities
app.get("/api/health", (_req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: "ok",
    hasGeminiKey: hasKey,
    activeModel: "gemini-3.8-flash",
    voices: [
      { id: "Kore", name: "কোরি (Kore - সুমধুর ও শান্ত)", gender: "Female", tone: "Calm, soothing, natural" },
      { id: "Fenrir", name: "ফেনরির (Fenrir - গম্ভীর ও বলিষ্ঠ)", gender: "Male", tone: "Deep, resonant, authoritative" },
      { id: "Puck", name: "পাক (Puck - প্রাণবন্ত ও তারুণ্যদীপ্ত)", gender: "Male", tone: "Energetic, expressive" },
      { id: "Zephyr", name: "জেফির (Zephyr - স্পষ্ট ও মার্জিত)", gender: "Female", tone: "Clear, graceful, articulate" },
      { id: "Charon", name: "শ্যারন (Charon - ধীরস্থির ও গম্ভীর)", gender: "Male", tone: "Reflective, serious, measured" },
    ],
  });
});

// API Route: AI Gateway / Model Router for STUDIO X (Text, Code, Agent, Website, App, Video, Image, Doc)
app.post("/api/generate", async (req, res) => {
  try {
    const {
      prompt,
      systemInstruction,
      type = "text",
      model = "gemini-3.8-flash",
      context,
      options,
    } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "কোনো প্রম্পট প্রদান করা হয়নি।" });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API কনফিগার করা নেই। অনুগ্রহ করে সেটিংস থেকে API Key দিন।",
      });
    }

    // Determine domain-specific system instruction and model routing via AI Gateway
    let gatewaySystemPrompt = "";
    let selectedModel = model || "gemini-3.8-flash";

    switch (type) {
      case "agent_step":
        gatewaySystemPrompt = `You are the STUDIO X Autonomous Super Agent Execution Engine.
You execute deep, highly structured, production-ready steps for creative, coding, or business goals.
Communicate clearly in Bengali (বাংলা) with high precision, ready-to-use output, and zero fluff.`;
        break;

      case "website_builder":
        gatewaySystemPrompt = `You are the STUDIO X Master Web Architect.
You create and modify responsive, modern, production-ready websites using HTML5, Tailwind CSS, and clean vanilla JS.
When asked to modify a section (e.g., navbar color, hero layout, adding a component), retain the overall structure and update the specified parts seamlessly.
Output clean, full HTML or the exact requested snippet without conversational markdown.`;
        break;

      case "app_prototype":
        gatewaySystemPrompt = `You are the STUDIO X Mobile App Prototyper.
You specialize in designing complete multi-screen app flows (Home, Login, Register, Tournament, Leaderboard, Profile, Wallet, Settings, etc.).
Provide structured, beautiful specifications, screen hierarchy, and interactive React Native / Flutter code.`;
        break;

      case "code_project":
        gatewaySystemPrompt = `You are the STUDIO X Master Software Engineer & Project Architect.
You generate complete, multi-file software projects (frontend, backend, database schema, config, README).
Always structure multi-file projects clearly with file paths and complete production-grade source code.`;
        break;

      case "doc_intelligence":
        gatewaySystemPrompt = `You are the STUDIO X Document Intelligence Specialist.
You excel at summarization, question answering, data extraction, multilingual translation, rewriting, quiz creation, and report generation in fluent Bengali and English.`;
        break;

      case "image_editor":
        gatewaySystemPrompt = `You are the STUDIO X Visual & Image AI Director.
You understand lighting, aspect ratios (16:9, 9:16, 1:1), background modifications, subject isolation, and YouTube thumbnail composition.
Output pristine, high-detail visual generation & editing instructions.`;
        break;

      case "video_editor":
        gatewaySystemPrompt = `You are the STUDIO X Cinema & Video Editor Engine.
You direct scene timelines, shot types, B-roll pacing, voiceover cues, background music mood, sound effects (SFX), and timecoded subtitles.`;
        break;

      case "workflow":
        gatewaySystemPrompt = `You are the STUDIO X Workflow Orchestrator.
You take inputs from upstream pipeline nodes and generate polished outputs for downstream nodes.`;
        break;

      default:
        gatewaySystemPrompt = `You are STUDIO X, the AI Creation Operating System.
You are exceptionally genius, helpful, creative, and fast.
You communicate fluently in both Bengali (বাংলা) and English.`;
        break;
    }

    const finalSystemPrompt = systemInstruction || gatewaySystemPrompt;
    const finalPrompt = context
      ? `Project Context & Memory:\n${JSON.stringify(context, null, 2)}\n\nUser Request:\n${prompt.trim()}`
      : prompt.trim();

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: [{ parts: [{ text: finalPrompt }] }],
      config: {
        systemInstruction: finalSystemPrompt,
      },
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    res.json({
      success: true,
      text,
      gatewayRoute: type,
      model: selectedModel,
    });
  } catch (error: any) {
    console.error("AI Generation error:", error);
    res.status(500).json({
      error: error?.message || "এআই জেনারেশনে সমস্যা হয়েছে।",
    });
  }
});

// API Route: Generate Voice using Gemini TTS
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voiceName = "Kore", tonePrompt } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "কোনো টেক্সট প্রদান করা হয়নি।" });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API কনফিগার করা নেই। অনুগ্রহ করে ব্রাউজার স্পিচ ইঞ্জিন ব্যবহার করুন অথবা সেটিংস থেকে API Key দিন।",
      });
    }

    const validVoices = ["Kore", "Fenrir", "Puck", "Zephyr", "Charon"];
    const selectedVoice = validVoices.includes(voiceName) ? voiceName : "Kore";

    const promptText = tonePrompt
      ? `${tonePrompt}: ${text.trim()}`
      : text.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice },
          },
        },
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    const base64Audio = part?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({
        error: "ভয়েস জেনারেশন সফল হয়নি। কোনো অডিও সিগন্যাল পাওয়া যায়নি।",
      });
    }

    const rawBuffer = Buffer.from(base64Audio, "base64");
    const wavBuffer = pcmToWav(rawBuffer, 24000, 1, 16);
    const wavBase64 = wavBuffer.toString("base64");

    res.json({
      success: true,
      audioBase64: wavBase64,
      mimeType: "audio/wav",
      format: "wav",
      voice: selectedVoice,
    });
  } catch (error: any) {
    console.error("TTS generation error:", error);
    res.status(500).json({
      error: error?.message || "ভয়েস তৈরিতে সমস্যা হয়েছে।",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
