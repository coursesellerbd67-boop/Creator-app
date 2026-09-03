import React from "react";
import {
  Sparkles,
  Bot,
  Globe,
  Smartphone,
  Workflow,
  Mic,
  Video,
  Image as ImageIcon,
  Code2,
  FileText,
  ShieldCheck,
  X,
  ChevronRight,
  GitBranch,
  Cpu,
} from "lucide-react";
import { StudioType } from "../types";
import { PWAInstallButton } from "./PWAInstallButton";

interface SidebarProps {
  currentStudio: StudioType;
  onSelectStudio: (studio: StudioType) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isAdminAuthenticated: boolean;
  onOpenAdminApp?: () => void;
}

interface MenuItem {
  id: StudioType;
  label: string;
  sub: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentStudio,
  onSelectStudio,
  isOpenMobile,
  onCloseMobile,
  isAdminAuthenticated,
  onOpenAdminApp,
}) => {
  const menuItems: MenuItem[] = [
    {
      id: "universal",
      label: "ক্রিয়েট এনিথিং (হোম)",
      sub: "ইউনিভার্সাল প্রম্পট ও হাব",
      icon: Sparkles,
      badge: "Master",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      id: "agent",
      label: "অটোনোমাস এআই এজেন্ট",
      sub: "১০-স্টেপ মাল্টি-টাস্ক এক্সিকিউশন",
      icon: Workflow,
      badge: "V2 সুপার এজেন্ট",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      id: "workflow",
      label: "ওয়ার্কফ্লো ইঞ্জিন",
      sub: "ড্র্যাগ-অ্যান্ড-ড্রপ নোড পাইপলাইন",
      icon: GitBranch,
      badge: "Pipeline",
      badgeColor: "bg-indigo-100 text-indigo-800",
    },
    {
      id: "custom_agent",
      label: "কাস্টম এজেন্ট বিল্ডার",
      sub: "নিজস্ব এআই এজেন্ট তৈরি ও ডিপ্লয়",
      icon: Cpu,
      badge: "Agent Lab",
      badgeColor: "bg-cyan-100 text-cyan-800",
    },
    {
      id: "chat",
      label: "এআই চ্যাট ও রিজনিং",
      sub: "স্মার্ট অ্যাসিস্ট্যান্ট ও প্ল্যানার",
      icon: Bot,
    },
    {
      id: "website",
      label: "ওয়েবসাইট বিল্ডার",
      sub: "লাইভ প্রিভিউ ও কোড এক্সপোর্ট",
      icon: Globe,
      badge: "লাইভ প্রিভিউ",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      id: "app",
      label: "মোবাইল অ্যাপ বিল্ডার",
      sub: "ইন্টারেক্টিভ ফোন প্রোটোটাইপ",
      icon: Smartphone,
    },
    {
      id: "audio",
      label: "বাংলা ভয়েস স্টুডিও",
      sub: "ন্যাচারাল TTS ও ওয়াজ/খবর টোন",
      icon: Mic,
      badge: "TTS",
      badgeColor: "bg-purple-100 text-purple-800",
    },
    {
      id: "video",
      label: "ভিডিও স্টুডিও",
      sub: "স্টোরিবোর্ড, সাবটাইটেল ও সিন",
      icon: Video,
    },
    {
      id: "image",
      label: "ইমেজ স্টুডিও",
      sub: "প্রম্পট অপ্টিমাইজ ও স্টাইলস",
      icon: ImageIcon,
    },
    {
      id: "code",
      label: "কোড স্টুডিও",
      sub: "মাল্টি-ল্যাঙ্গুয়েজ জেনারেটর ও ডিবাগার",
      icon: Code2,
    },
    {
      id: "doc",
      label: "ডকুমেন্ট ও ডেটা AI",
      sub: "সারাংশ, Q&A এবং চার্ট ইনসাইটস",
      icon: FileText,
    },
    {
      id: "admin",
      label: "অ্যাডমিন কন্ট্রোল সিস্টেম",
      sub: "মডেল, প্রম্পট ও হিস্ট্রি সেটিংস",
      icon: ShieldCheck,
      badge: isAdminAuthenticated ? "অ্যাডমিন" : "লগইন",
      badgeColor: isAdminAuthenticated
        ? "bg-emerald-100 text-emerald-800"
        : "bg-neutral-200 text-neutral-800",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-neutral-900 text-white flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-neutral-950 font-black text-sm tracking-wider">
              X
            </div>
            <div>
              <div className="text-sm font-black tracking-wider text-neutral-100 font-['Plus_Jakarta_Sans',sans-serif]">
                STUDIO X
              </div>
              <div className="text-[10px] text-neutral-400 font-['Hind_Siliguri',sans-serif]">
                অল-ইন-ওয়ান এআই ওয়ার্কস্পেস
              </div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace navigation list */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            স্টুডিও ওয়ার্কস্পেস
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentStudio === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  onSelectStudio(item.id);
                  onCloseMobile();
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between group transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white font-medium shadow-sm"
                    : "text-neutral-300 hover:bg-neutral-800/80 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-neutral-800 text-neutral-400 group-hover:text-emerald-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold truncate leading-tight font-['Hind_Siliguri',sans-serif]">
                      {item.label}
                    </div>
                    <div
                      className={`text-[10px] truncate ${
                        isActive ? "text-emerald-100" : "text-neutral-500"
                      }`}
                    >
                      {item.sub}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        isActive
                          ? "bg-white text-emerald-800"
                          : item.badgeColor || "bg-neutral-800 text-neutral-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive
                        ? "text-white opacity-90"
                        : "text-neutral-600 group-hover:translate-x-0.5 group-hover:text-neutral-400"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* In-app Mobile Install & Admin App Switcher Cards */}
        <div className="p-3 border-t border-neutral-800 space-y-2 bg-neutral-950/40">
          <PWAInstallButton
            variant="sidebar"
            onSwitchToAdmin={onOpenAdminApp}
          />

          {onOpenAdminApp && (
            <button
              onClick={() => {
                onCloseMobile();
                onOpenAdminApp();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-800/50 text-indigo-200 transition-colors text-xs font-semibold cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span className="font-['Hind_Siliguri',sans-serif]">আলাদা অ্যাডমিন অ্যাপ</span>
              </div>
              <span className="text-[10px] bg-indigo-900 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
                ADMIN
              </span>
            </button>
          )}
        </div>

        {/* Footer Admin / System Info */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950/50">
          <div className="flex items-center justify-between text-xs text-neutral-400 px-2 py-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>সিস্টেম: সক্রিয়</span>
            </span>
            <span className="text-[11px] text-neutral-500">v2.5 Pro</span>
          </div>
        </div>
      </aside>
    </>
  );
};
