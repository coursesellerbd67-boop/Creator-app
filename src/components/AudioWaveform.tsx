import React, { useMemo } from "react";

interface AudioWaveformProps {
  isPlaying: boolean;
  barCount?: number;
  height?: number;
  colorClass?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isPlaying,
  barCount = 36,
  height = 48,
  colorClass = "bg-emerald-600",
}) => {
  // Precompute stable baseline heights
  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      // Natural bell curve pattern
      const centerFactor = 1 - Math.abs((i - barCount / 2) / (barCount / 2)) * 0.6;
      const randomBase = 0.3 + 0.7 * centerFactor;
      return {
        id: i,
        baseHeight: Math.max(15, Math.floor(randomBase * 100)),
        animDuration: (0.4 + (i % 7) * 0.12).toFixed(2),
        animDelay: ((i * 0.05) % 0.6).toFixed(2),
      };
    });
  }, [barCount]);

  return (
    <div
      className="flex items-center justify-center gap-1 w-full px-4 overflow-hidden"
      style={{ height: `${height}px` }}
      aria-label="Audio Visualizer"
    >
      {bars.map((bar) => (
        <div
          key={bar.id}
          className={`w-1 sm:w-1.5 rounded-full transition-all duration-150 ${colorClass}`}
          style={{
            height: isPlaying ? `${bar.baseHeight}%` : "15%",
            opacity: isPlaying ? 0.95 : 0.25,
            animation: isPlaying
              ? `bounceHeight ${bar.animDuration}s ease-in-out infinite alternate ${bar.animDelay}s`
              : "none",
          }}
        />
      ))}
      <style>{`
        @keyframes bounceHeight {
          0% {
            height: 15%;
            opacity: 0.3;
          }
          100% {
            height: 95%;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
