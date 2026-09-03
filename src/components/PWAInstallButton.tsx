import React, { useState } from "react";
import { DownloadCloud, Smartphone, Check, X, Share, PlusSquare, ShieldCheck, Sparkles } from "lucide-react";
import { usePWAInstall } from "../hooks/usePWAInstall";

interface PWAInstallButtonProps {
  className?: string;
  variant?: "primary" | "compact" | "sidebar";
  onSwitchToAdmin?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = "",
  variant = "primary",
  onSwitchToAdmin,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      setInstalling(true);
      const success = await install();
      setInstalling(false);
      if (success) {
        setInstalledSuccess(true);
        setTimeout(() => setInstalledSuccess(false), 4000);
      }
    } else {
      setShowGuide(true);
    }
  };

  // If already running in standalone mode and user hasn't explicitly opened guide
  if (isInstalled && !showGuide) {
    return (
      <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">
        <Check className="w-3 h-3 text-emerald-600" />
        <span>অ্যাপ ইনস্টল করা আছে</span>
      </div>
    );
  }

  const renderButton = () => {
    if (variant === "compact") {
      return (
        <button
          id="pwa-install-compact-btn"
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg transition-all shadow-xs cursor-pointer ${className}`}
          title="মোবাইলে বা কম্পিউটারে ইনস্টল করুন"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="font-['Hind_Siliguri',sans-serif]">অ্যাপ ইনস্টল</span>
        </button>
      );
    }

    if (variant === "sidebar") {
      return (
        <button
          id="pwa-install-sidebar-btn"
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-950 to-neutral-900 border border-emerald-800/40 text-emerald-200 hover:text-white hover:border-emerald-700 transition-all text-left group cursor-pointer ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-['Hind_Siliguri',sans-serif]">
                মোবাইলে অ্যাপ ইনস্টল করুন
              </div>
              <div className="text-[10px] text-emerald-300/70 font-['Hind_Siliguri',sans-serif]">
                সরাসরি হোমস্ক্রিন থেকে ব্যবহার করুন
              </div>
            </div>
          </div>
          <DownloadCloud className="w-4 h-4 text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
        </button>
      );
    }

    return (
      <button
        id="pwa-install-header-btn"
        onClick={handleInstallClick}
        disabled={installing}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg transition-all shadow-xs cursor-pointer ${className}`}
        title="মোবাইল বা ডেস্কটপে ইনস্টল করুন"
      >
        {installedSuccess ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-300" />
            <span className="font-['Hind_Siliguri',sans-serif]">ইনস্টল সম্পন্ন!</span>
          </>
        ) : installing ? (
          <>
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="font-['Hind_Siliguri',sans-serif]">প্রস্তুত হচ্ছে...</span>
          </>
        ) : (
          <>
            <Smartphone className="w-3.5 h-3.5" />
            <span className="font-['Hind_Siliguri',sans-serif]">অ্যাপ ইনস্টল</span>
          </>
        )}
      </button>
    );
  };

  return (
    <>
      {renderButton()}

      {/* Guide Modal for Mobile (Android & iOS) */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 font-['Hind_Siliguri',sans-serif]">
                    মোবাইলে STUDIO X ইনস্টল করার নিয়ম
                  </h3>
                  <p className="text-xs text-neutral-500 font-['Hind_Siliguri',sans-serif]">
                    Progressive Web App (PWA) গাইড
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct install trigger if available */}
            {isInstallable && (
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between gap-3">
                <div className="text-xs text-emerald-900 font-['Hind_Siliguri',sans-serif]">
                  আপনার ডিভাইসে <strong>১-ক্লিক ইনস্টলেশন</strong> প্রস্তুত আছে!
                </div>
                <button
                  onClick={async () => {
                    await install();
                    setShowGuide(false);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg whitespace-nowrap shadow-xs"
                >
                  এখনই ইনস্টল করুন
                </button>
              </div>
            )}

            {/* Instructions for Android & iPhone */}
            <div className="space-y-3.5 text-xs text-neutral-700 font-['Hind_Siliguri',sans-serif]">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-1.5">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>অ্যান্ড্রয়েড ফোন (Chrome ব্রাউজার):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 pl-1 text-neutral-600">
                  <li>ব্রাউজারের ওপরে ডানদিকের ৩টি ডট <strong>(⋮)</strong> মেনুতে চাপুন।</li>
                  <li><strong>"Install app"</strong> বা <strong>"Add to Home screen"</strong> (হোম স্ক্রিনে যোগ করুন)-এ ট্যাপ করুন।</li>
                  <li>কিছুক্ষণের মধ্যে ফোনের হোম স্ক্রিনে STUDIO X অ্যাপ আইকন চলে আসবে।</li>
                </ol>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-1.5">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>আইফোন / আইপ্যাড (Safari ব্রাউজার):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 pl-1 text-neutral-600">
                  <li>সাফারি ব্রাউজারের নিচে <strong>Share (<Share className="w-3 h-3 inline text-blue-600" />)</strong> বাটনে ট্যাপ করুন।</li>
                  <li>একটু নিচে স্ক্রল করে <strong>"Add to Home Screen" (<PlusSquare className="w-3 h-3 inline text-neutral-800" />)</strong> নির্বাচন করুন।</li>
                  <li>ওপরে <strong>Add</strong> চাপলেই অ্যাপ আকারে হোম স্ক্রিনে সেভ হয়ে যাবে।</li>
                </ol>
              </div>

              {/* Admin App Note */}
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200/80 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-indigo-950">অ্যাডমিনের জন্য আলাদা অ্যাপ:</div>
                  <p className="text-[11px] text-indigo-800 leading-relaxed">
                    অ্যাডমিনের সম্পূর্ণ আলাদা কন্ট্রোল প্যানেল রয়েছে। আপনি সরাসরি <strong>STUDIO X Admin</strong> মোডে স্যুইচ করে সেটিও আলাদা অ্যাপ হিসেবে পিন করে রাখতে পারবেন।
                  </p>
                  {onSwitchToAdmin && (
                    <button
                      onClick={() => {
                        setShowGuide(false);
                        onSwitchToAdmin();
                      }}
                      className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 underline"
                    >
                      অ্যাডমিন অ্যাপ খুলুন →
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowGuide(false)}
                className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors"
              >
                ঠিক আছে, বুঝেছি
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
