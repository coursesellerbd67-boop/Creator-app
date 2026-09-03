import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { UniversalPrompt } from "./components/UniversalPrompt";
import { WebsiteStudio } from "./components/WebsiteStudio";
import { AppStudio } from "./components/AppStudio";
import { AgentStudio } from "./components/AgentStudio";
import { AudioStudio } from "./components/AudioStudio";
import { VideoStudio } from "./components/VideoStudio";
import { ImageStudio } from "./components/ImageStudio";
import { CodeStudio } from "./components/CodeStudio";
import { ChatStudio } from "./components/ChatStudio";
import { DocStudio } from "./components/DocStudio";
import { WorkflowStudio } from "./components/WorkflowStudio";
import { CustomAgentStudio } from "./components/CustomAgentStudio";
import { AdminPanel } from "./components/AdminPanel";
import { AdminApp } from "./components/AdminApp";
import { TemplatesModal } from "./components/TemplatesModal";
import { ProjectHistoryModal } from "./components/ProjectHistoryModal";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { StudioType, SavedProject, AdminConfig } from "./types";

export const App: React.FC = () => {
  // App mode: "creator" is the main Studio X App, "admin" is the dedicated Admin App
  const [appMode, setAppMode] = useState<"creator" | "admin">("creator");
  const [currentStudio, setCurrentStudio] = useState<StudioType>("universal");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Cross-studio initial prompts and context
  const [activePrompt, setActivePrompt] = useState<string>("");
  const [audioInitialText, setAudioInitialText] = useState<string>("");

  // Modals
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  // Backend capabilities
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);

  // Admin and configuration state
  const [adminConfig, setAdminConfig] = useState<AdminConfig>({
    isAdminAuthenticated: false,
    activeModel: "gemini-3.8-flash",
    systemPrompt:
      "You are STUDIO X, an affectionate, exceptionally genius AI partner. Your tone is respectful, insightful, and brilliant. You can do tasks spanning website building, app prototyping, autonomous agent workflow, voiceover synthesis, video storyboarding, and coding with utmost craftsmanship.",
    temperature: 0.7,
    creditBalance: 2500,
    safetyLevel: "standard",
    activityLogs: [
      {
        id: "log-1",
        timestamp: "আজ, সকাল ১০:১৫",
        action: "সিস্টেম ইনিশিয়ালাইজেশন",
        user: "Admin (মামা)",
        details: "STUDIO X অল-ইন-ওয়ান এআই ইঞ্জিন ও বাংলা ভয়েস সক্রিয়",
      },
    ],
    auditLog: [
      {
        id: "log-1",
        timestamp: "আজ, সকাল ১০:১৫",
        action: "সিস্টেম ইনিশিয়ালাইজেশন",
        user: "Admin (মামা)",
        details: "STUDIO X অল-ইন-ওয়ান এআই ইঞ্জিন ও বাংলা ভয়েস সক্রিয়",
      },
    ],
  });

  // Saved Projects state with initial sample projects
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([
    {
      id: "proj-1",
      title: "ইসলামিক দাওয়াহ ও বুকস্টোর পোর্টাল",
      studio: "website",
      versions: [
        {
          version: 1,
          timestamp: "আজ, সকাল ০৯:৩০",
          name: "ভার্সন ১",
          content: "ইসলামিক বই ও দাওয়াহ পোর্টাল",
          type: "website",
          data: {
            title: "ইসলামিক বই ও দাওয়াহ পোর্টাল",
            theme: "emerald",
          },
        },
      ],
      createdAt: "2026-09-03",
    },
    {
      id: "proj-2",
      title: "ইউটিউব ভয়েসওভার ও ইসলামিক ওয়াজ অডিও",
      studio: "audio",
      versions: [
        {
          version: 1,
          timestamp: "গতকাল",
          name: "ভার্সন ১",
          content: "আল্লাহর স্মরণেই কেবল মানুষের অন্তর প্রশান্তি পায়...",
          type: "audio",
          data: {
            text: "আল্লাহর স্মরণেই কেবল মানুষের অন্তর প্রশান্তি পায়...",
            voice: "Fenrir",
          },
        },
      ],
      createdAt: "2026-09-02",
    },
  ]);

  // Check URL query params for direct launcher (e.g. ?app=admin or ?studio=audio)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("app") === "admin") {
        setAppMode("admin");
      }
      const studioParam = params.get("studio") as StudioType;
      if (
        studioParam &&
        [
          "universal",
          "agent",
          "website",
          "app",
          "audio",
          "video",
          "image",
          "code",
          "chat",
          "doc",
          "admin",
        ].includes(studioParam)
      ) {
        setCurrentStudio(studioParam);
      }
    } catch {
      // Ignore query param parse failure in sandboxed frames
    }
  }, []);

  // Health check on mount
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setHasGeminiKey(Boolean(data.hasGeminiKey));
      })
      .catch((err) => console.log("Health check status:", err));
  }, []);

  // Universal Prompt router
  const handleExecutePrompt = (prompt: string, targetStudio: StudioType) => {
    setActivePrompt(prompt);
    setCurrentStudio(targetStudio);

    // If audio is targeted, set its text
    if (targetStudio === "audio") {
      setAudioInitialText(prompt);
    }

    // Log activity
    const newLog = {
      id: String(Date.now()),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      action: `${targetStudio.toUpperCase()} স্টুডিওতে রিকোয়েস্ট`,
      user: "Admin (মামা)",
      details: prompt.slice(0, 60) + (prompt.length > 60 ? "..." : ""),
    };
    setAdminConfig((prev) => ({
      ...prev,
      creditBalance: Math.max(0, prev.creditBalance - 5),
      activityLogs: [newLog, ...(prev.activityLogs || []).slice(0, 19)],
      auditLog: [newLog, ...(prev.auditLog || []).slice(0, 19)],
    }));
  };

  // Route text from any studio to Audio Studio
  const handleSendToAudio = (text: string) => {
    setAudioInitialText(text);
    setCurrentStudio("audio");
  };

  // Save new project version
  const handleSaveProjectVersion = (
    title: string,
    studio: StudioType,
    data: any
  ) => {
    setSavedProjects((prev) => {
      const existing = prev.find((p) => p.title === title && p.studio === studio);
      if (existing) {
        const nextVersion = existing.versions.length + 1;
        const newVer = {
          version: nextVersion,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          name: `ভার্সন ${nextVersion}`,
          content: typeof data === "string" ? data : JSON.stringify(data),
          type: studio,
          data,
        };
        return prev.map((p) =>
          p.id === existing.id
            ? { ...p, versions: [...p.versions, newVer] }
            : p
        );
      } else {
        const newProject: SavedProject = {
          id: String(Date.now()),
          title,
          studio,
          versions: [
            {
              version: 1,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              name: "ভার্সন ১",
              content: typeof data === "string" ? data : JSON.stringify(data),
              type: studio,
              data,
            },
          ],
          createdAt: new Date().toISOString().split("T")[0],
        };
        return [newProject, ...prev];
      }
    });
  };

  const handleLoadProject = (project: SavedProject, versionIndex?: number) => {
    const ver =
      versionIndex !== undefined
        ? project.versions[versionIndex]
        : project.versions[project.versions.length - 1];

    setCurrentStudio(project.studio);
    if (project.studio === "audio" && ver?.data?.text) {
      setAudioInitialText(ver.data.text);
    }
  };

  const handleDeleteProject = (id: string) => {
    setSavedProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // If user is in standalone Admin App mode
  if (appMode === "admin") {
    return (
      <div className="min-h-screen bg-neutral-950">
        <OfflineIndicator />
        <AdminApp
          config={adminConfig}
          onUpdateConfig={(newConf) =>
            setAdminConfig((prev) => ({ ...prev, ...newConf }))
          }
          onAuthenticate={(success) =>
            setAdminConfig((prev) => ({
              ...prev,
              isAdminAuthenticated: success,
            }))
          }
          onSwitchToMainApp={() => setAppMode("creator")}
        />
      </div>
    );
  }

  // Otherwise, render the Creator App
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col antialiased text-neutral-900 font-sans selection:bg-emerald-200">
      <OfflineIndicator />

      {/* Global Header */}
      <Header
        currentStudio={currentStudio}
        onSelectStudio={(st) => setCurrentStudio(st)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenProjects={() => setIsProjectsOpen(true)}
        isAdminAuthenticated={adminConfig.isAdminAuthenticated}
        onOpenAdmin={() => setCurrentStudio("admin")}
        onOpenAdminApp={() => setAppMode("admin")}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        credits={adminConfig.creditBalance}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentStudio={currentStudio}
          onSelectStudio={(st) => {
            setCurrentStudio(st);
            setIsMobileSidebarOpen(false);
          }}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isAdminAuthenticated={adminConfig.isAdminAuthenticated}
          onOpenAdminApp={() => setAppMode("admin")}
        />

        {/* Studio Viewport */}
        <main className="flex-1 overflow-y-auto">
          {currentStudio === "universal" && (
            <UniversalPrompt
              onExecutePrompt={handleExecutePrompt}
              onSelectStudio={(st) => setCurrentStudio(st)}
            />
          )}

          {currentStudio === "agent" && (
            <AgentStudio
              initialPrompt={activePrompt}
              onSendToAudio={handleSendToAudio}
            />
          )}

          {currentStudio === "website" && (
            <WebsiteStudio
              initialPrompt={activePrompt}
              onSaveProjectVersion={(title, content) =>
                handleSaveProjectVersion(title, "website", content)
              }
            />
          )}

          {currentStudio === "app" && (
            <AppStudio initialPrompt={activePrompt} />
          )}

          {currentStudio === "audio" && (
            <AudioStudio
              initialText={audioInitialText}
              hasGeminiKey={hasGeminiKey}
            />
          )}

          {currentStudio === "video" && (
            <VideoStudio
              initialPrompt={activePrompt}
              onSendToAudio={handleSendToAudio}
            />
          )}

          {currentStudio === "image" && (
            <ImageStudio initialPrompt={activePrompt} />
          )}

          {currentStudio === "code" && (
            <CodeStudio initialPrompt={activePrompt} />
          )}

          {currentStudio === "chat" && (
            <ChatStudio
              initialPrompt={activePrompt}
              onSendToAudio={handleSendToAudio}
            />
          )}

          {currentStudio === "doc" && (
            <DocStudio initialPrompt={activePrompt} />
          )}

          {currentStudio === "workflow" && (
            <WorkflowStudio />
          )}

          {currentStudio === "custom_agent" && (
            <CustomAgentStudio />
          )}

          {currentStudio === "admin" && (
            <AdminPanel
              config={adminConfig}
              onUpdateConfig={(newConf) =>
                setAdminConfig((prev) => ({ ...prev, ...newConf }))
              }
              onAuthenticate={(success) =>
                setAdminConfig((prev) => ({
                  ...prev,
                  isAdminAuthenticated: success,
                }))
              }
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleExecutePrompt}
      />

      <ProjectHistoryModal
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        projects={savedProjects}
        onLoadProject={handleLoadProject}
        onDeleteProject={handleDeleteProject}
      />
    </div>
  );
};

export default App;
