import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Download, Volume2, VolumeX, Check } from "lucide-react";
import { AudioWaveform } from "./AudioWaveform";

interface AudioPlayerBarProps {
  audioBase64: string;
  format?: string;
  voiceName?: string;
  onFinishedPlayback?: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  audioBase64,
  format = "wav",
  voiceName = "Kore",
  onFinishedPlayback,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const audioSrc = `data:audio/${format};base64,${audioBase64}`;

  useEffect(() => {
    // Reset state when a new audio is loaded
    setIsPlaying(false);
    setCurrentTime(0);
    setDownloaded(false);

    if (audioRef.current) {
      audioRef.current.load();
      // Auto-play new audio
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log("Autoplay was prevented by browser policy:", err);
          });
      }
    }
  }, [audioBase64]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().then(() => setIsPlaying(true));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.muted = newMuted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) {
        setIsMuted(true);
        audioRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = audioSrc;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    link.download = `bangla-voice-${voiceName.toLowerCase()}-${timestamp}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="w-full bg-neutral-900 text-white rounded-2xl p-5 border border-neutral-800 shadow-xl space-y-4">
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          if (onFinishedPlayback) onFinishedPlayback();
        }}
      />

      {/* Top row: Status, voice info, download */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            {isPlaying && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                isPlaying ? "bg-emerald-500" : "bg-neutral-500"
              }`}
            ></span>
          </span>
          <div>
            <div className="text-sm font-semibold text-white font-['Hind_Siliguri',sans-serif]">
              {isPlaying ? "অডিও বাজছে..." : "অডিও প্রস্তুত"}
            </div>
            <div className="text-xs text-neutral-400">
              ভয়েস: {voiceName} | ফরম্যাট: WAV (24kHz HD)
            </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          id="btn-download-audio"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white transition-all shadow-sm"
          title="অডিও ডাউনলোড করুন"
        >
          {downloaded ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>ডাউনলোড হয়েছে!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>অডিও ডাউনলোড (.wav)</span>
            </>
          )}
        </button>
      </div>

      {/* Waveform Visualizer */}
      <div className="bg-neutral-950/60 rounded-xl py-2 px-3 border border-neutral-800/80">
        <AudioWaveform isPlaying={isPlaying} barCount={42} height={44} colorClass="bg-emerald-400" />
      </div>

      {/* Progress slider & time */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-neutral-400 tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.05}
          value={currentTime}
          onChange={handleSeek}
          id="audio-seek-slider"
          className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
      </div>

      {/* Bottom controls: Play, Pause, Restart, Volume */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            id="btn-play-pause-toggle"
            className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-neutral-950 flex items-center justify-center transition shadow-lg shadow-emerald-500/20"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>

          <button
            onClick={handleRestart}
            id="btn-restart-audio"
            className="p-2.5 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
            title="শুরু থেকে শুনুন"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Volume controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            id="btn-mute-toggle"
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            id="audio-volume-slider"
            className="w-20 sm:w-24 h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            title="ভলিউম"
          />
        </div>
      </div>
    </div>
  );
};
