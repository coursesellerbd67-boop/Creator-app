import React from "react";
import { Sparkles, ShieldCheck, FolderKanban, LayoutGrid, Cpu, Menu } from "lucide-react";
import { StudioType } from "../types";
import { PWAInstallButton } from "./PWAInstallButton";

interface HeaderProps {
  currentStudio: StudioType;
  onSelectStudio: (studio: StudioType) => void;
  onOpenTemplates: () => void;
  onOpenProjects: () => void;
  isAdminAuthenticated: boolean;
  onOpenAdmin: () => void;
  onOpenAdminApp?: () => void;
  onToggleMobileSidebar: () => void;
  credits: number;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectStudio,
  onOpenTemplates,
  onOpenProjects,
  isAdminAuthenticated,
  onOpenAdmin,
  onOpenAdminApp,
  onToggleMobileSidebar,
  credits,
}) => {
  return (
    <header className="w-full bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-xs">
      <div className="w-full px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Mobile menu toggle + Logo & title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="mobile-sidebar-toggle-btn"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 focus:outline-none"
            title="মেনু খুলুন"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            id="header-home-logo-btn"
            onClick={() => onSelectStudio("universal")}
            className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-100 group-hover:scale-105 transition-transform">
              <span className="font-black text-sm sm:text-base tracking-wider">X</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-black tracking-wider text-neutral-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  STUDIO X
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Cpu className="w-3 h-3" /> AI Studio Pro
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-neutral-500 font-['Hind_Siliguri',sans-serif] -mt-0.5 line-clamp-1">
                অল-ইন-ওয়ান ক্রিয়েশন স্টুডিও ও বাংলা ভয়েস
              </p>
            </div>
          </button>
        </div>

        {/* Right actions: PWA Install, Templates, Projects, Admin App Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* PWA Mobile Install Button */}
          <PWAInstallButton
            onSwitchToAdmin={onOpenAdminApp || onOpenAdmin}
          />

          <button
            id="header-templates-modal-btn"
            onClick={onOpenTemplates}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-neutral-500" />
            <span>টেমপ্লেটস</span>
          </button>

          <button
            id="header-projects-history-btn"
            onClick={onOpenProjects}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            <FolderKanban className="w-3.5 h-3.5 text-neutral-500" />
            <span>প্রজেক্টস</span>
          </button>

          {/* Credits pill */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <span>ক্রেডিট:</span>
            <span className="font-semibold text-amber-900">{credits.toLocaleString()}</span>
          </div>

          {/* Dedicated Admin App Mode Switcher */}
          <button
            id="header-admin-app-switch-btn"
            onClick={onOpenAdminApp || onOpenAdmin}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer ${
              isAdminAuthenticated
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 ring-2 ring-indigo-200"
                : "bg-neutral-900 hover:bg-neutral-800 text-white"
            }`}
            title="আলাদা অ্যাডমিন অ্যাপ খুলুন"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
            <span className="font-['Hind_Siliguri',sans-serif]">অ্যাডমিন অ্যাপ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
