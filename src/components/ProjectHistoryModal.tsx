import React from "react";
import {
  X,
  FolderKanban,
  RotateCcw,
  Trash2,
  Calendar,
  Layers,
  FileCode,
  ArrowUpRight,
} from "lucide-react";
import { SavedProject, StudioType } from "../types";

interface ProjectHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: SavedProject[];
  onLoadProject: (project: SavedProject, versionIndex?: number) => void;
  onDeleteProject: (projectId: string) => void;
}

export const ProjectHistoryModal: React.FC<ProjectHistoryModalProps> = ({
  isOpen,
  onClose,
  projects,
  onLoadProject,
  onDeleteProject,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-200">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 font-['Hind_Siliguri',sans-serif]">
                প্রজেক্টস ও ভার্সন হিস্ট্রি
              </h2>
              <p className="text-xs text-neutral-500 font-['Hind_Siliguri',sans-serif]">
                পূর্ববর্তী যেকোনো প্রজেক্ট বা ভার্সনে এক ক্লিকে ফিরে যান
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {projects.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 space-y-2">
              <FolderKanban className="w-10 h-10 mx-auto text-neutral-300" />
              <p className="text-sm font-['Hind_Siliguri',sans-serif]">
                এখনো কোনো সেভ করা প্রজেক্ট নেই। ওয়েবসাইট বা কোড তৈরির পর স্বয়ংক্রিয়ভাবে হিস্ট্রি সংরক্ষিত হবে।
              </p>
            </div>
          ) : (
            projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 hover:bg-white hover:border-blue-400 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                      {proj.studio}
                    </span>
                    <h3 className="font-bold text-sm text-neutral-900">
                      {proj.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => onDeleteProject(proj.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="ডিলিট করুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Versions Timeline */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-neutral-500 flex items-center gap-1 font-['Hind_Siliguri',sans-serif]">
                    <Layers className="w-3.5 h-3.5" />
                    <span>ভার্সন হিস্ট্রি ({proj.versions.length}টি ভার্সন):</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {proj.versions.map((ver, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onLoadProject(proj, idx);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 hover:border-blue-500 hover:bg-blue-50 text-xs font-medium text-neutral-700 flex items-center gap-1.5 transition-all shadow-2xs"
                      >
                        <RotateCcw className="w-3 h-3 text-blue-600" />
                        <span>ভার্সন {ver.version}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          ({ver.timestamp})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
