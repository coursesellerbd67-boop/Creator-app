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

// API Route: Smart AI Generation for All Studios (Chat, Code, Website, Agent, Video, Document)
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, systemInstruction, type = "text", model = "gemini-3.8-flash" } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "কোনো প্রম্পট প্রদান করা হয়নি।" });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API কনফিগার করা নেই। অনুগ্রহ করে সেটিংস থেকে API Key দিন।",
      });
    }

    // Default system prompt
    const defaultSysPrompt = `You are STUDIO X, the master AI Engine and All-in-One Creation Studio.
You are exceptionally genius, helpful, creative, and fast.
You can communicate fluently in both Bengali (বাংলা) and English.
Respond with high quality, structured Markdown, clean code, or precise steps as requested.`;

    const response = await ai.models.generateContent({
      model: model || "gemini-3.8-flash",
      contents: [{ parts: [{ text: prompt.trim() }] }],
      config: {
        systemInstruction: systemInstruction || defaultSysPrompt,
      },
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    res.json({
      success: true,
      text,
      model: model || "gemini-3.8-flash",
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
