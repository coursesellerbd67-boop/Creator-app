export type StudioType =
  | "universal"
  | "chat"
  | "website"
  | "app"
  | "agent"
  | "image"
  | "video"
  | "audio"
  | "code"
  | "doc"
  | "workflow"
  | "admin";

export type EngineType = "gemini" | "browser";

export interface VoiceOption {
  id: string;
  name: string;
  gender: "Male" | "Female";
  tone: string;
}

export interface ToneOption {
  id: string;
  label: string;
  promptInstruction: string;
}

export interface PresetQuote {
  id: string;
  category: string;
  title: string;
  text: string;
  suggestedVoice?: string;
  suggestedTone?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  model?: string;
  hasAudio?: boolean;
  audioBase64?: string;
}

export interface AgentStep {
  id: string;
  title: string;
  titleBn: string;
  status: "pending" | "running" | "completed" | "failed";
  output?: string;
  details?: string[];
  actionType?: "research" | "script" | "image" | "voice" | "video" | "seo" | "final";
}

export interface ProjectVersion {
  version: number;
  timestamp: string;
  name?: string;
  content?: string;
  type?: StudioType;
  data?: any;
}

export interface SavedProject {
  id: string;
  title: string;
  studio: StudioType;
  lastModified?: string;
  createdAt?: string;
  versions: ProjectVersion[];
  currentVersionIndex?: number;
  previewSnippet?: string;
}

export interface AdminConfig {
  isAdminAuthenticated: boolean;
  activeModel: string;
  systemPrompt: string;
  temperature: number;
  rateLimitPerMinute?: number;
  creditBalance: number;
  safetyLevel: "standard" | "strict" | "permissive" | "relaxed";
  activityLogs: { id: string; timestamp: string; action: string; user?: string; details: string }[];
  auditLog?: { id?: string; timestamp: string; action: string; user?: string; details: string }[];
}

export interface TemplateItem {
  id: string;
  title: string;
  category: "youtube" | "website" | "app" | "creative" | "business";
  description: string;
  prompt: string;
  targetStudio: StudioType;
  icon?: any;
}
