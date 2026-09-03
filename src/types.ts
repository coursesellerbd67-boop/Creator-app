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
  | "custom_agent"
  | "admin";

export type CreationMode = "simple" | "pro" | "agent";

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
  actionType?:
    | "planning"
    | "research"
    | "script"
    | "image"
    | "voice"
    | "video"
    | "subtitle"
    | "thumbnail"
    | "seo"
    | "final";
  audioBase64?: string;
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
  tags?: string[];
}

export interface ProjectMemoryItem {
  id: string;
  projectId?: string;
  projectTitle: string;
  studio: StudioType;
  summary: string;
  keyEntities: string[];
  lastContext: string;
  timestamp: string;
}

// Full Multi-File Project for Code Studio
export interface ProjectFile {
  id?: string;
  name?: string;
  path: string;
  content: string;
  language: string;
  description?: string;
}

// Video Timeline Editor Types
export interface VideoSceneItem {
  id: number;
  name: string;
  timeStart: number; // in seconds
  duration: number; // in seconds
  shotType: string;
  visualDescription: string;
  voiceoverScript: string;
  subtitle: string;
  bgImage: string;
  aspectRatio?: "16:9" | "9:16" | "1:1";
}

export interface VideoTimelineData {
  scenes: VideoSceneItem[];
  voiceTrack: {
    enabled: boolean;
    volume: number;
    voiceName: string;
    speed: number;
  };
  musicTrack: {
    enabled: boolean;
    volume: number;
    trackName: string;
    mood: string;
  };
  sfxTrack: {
    enabled: boolean;
    volume: number;
    effects: { time: number; name: string }[];
  };
  subtitleTrack: {
    enabled: boolean;
    fontSize: number;
    color: string;
  };
  aspectRatio: "16:9" | "9:16" | "1:1";
}

// Workflow Studio Types
export interface WorkflowNode {
  id: string;
  type: "prompt" | "research" | "script" | "image" | "voice" | "video" | "seo" | "input" | "text" | "audio" | "code";
  title: string;
  titleBn?: string;
  status: "idle" | "running" | "completed" | "error" | "pending";
  inputKey?: string;
  output?: string;
  config?: any;
}

// Custom AI Agent Types
export interface CustomAgent {
  id: string;
  name: string;
  role?: string;
  description?: string;
  instructions?: string;
  systemPrompt?: string;
  avatar?: string;
  avatarIcon?: string;
  model?: string;
  allowedTools?: string[];
  knowledgeBaseFiles?: string[];
  tools?: {
    webSearch?: boolean;
    imageGen?: boolean;
    voiceGen?: boolean;
    seoOptimizer?: boolean;
    docIntelligence?: boolean;
    [key: string]: boolean | undefined;
  };
  memoryEnabled?: boolean;
  createdAt?: string;
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
  category: "youtube" | "website" | "app" | "creative" | "business" | "workflow";
  description: string;
  prompt: string;
  targetStudio: StudioType;
  icon?: any;
}
