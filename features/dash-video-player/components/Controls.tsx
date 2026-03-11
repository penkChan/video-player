import { Icon } from "@iconify/react";
import clsx from "clsx";
import React, { RefObject } from "react";

export interface ControlsProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  isPaused: boolean;
  playVideo: () => void;
  pauseVideo: () => void;
  progressBarWidth: string;
  bufferedBarWidth: string;
  currentMinutes: string;
  currentSeconds: string;
  totalMinutes: string;
  totalSeconds: string;
  showControls: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  videoRef,
  isPaused,
  playVideo,
  pauseVideo,
  progressBarWidth,
  bufferedBarWidth,
  currentMinutes,
  currentSeconds,
  totalMinutes,
  totalSeconds,
  showControls,
}) => {
  const handleTogglePlay = () => {
    if (isPaused) {
      playVideo();
    } else {
      pauseVideo();
    }
  };

  const handleSeek: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!videoRef.current) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const ratio = clickX / rect.width;
    const duration = videoRef.current.duration || 0;
    if (duration > 0) {
      videoRef.current.currentTime = duration * ratio;
    }
  };

  return (
    <div
      className={clsx(
        "absolute bottom-0 left-0 right-0 z-10 flex flex-col gap-2 bg-linear-to-t from-black/70 via-black/40 to-transparent px-4 pb-3 pt-4 transition-opacity",
        showControls ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="flex items-center gap-4 text-xs text-zinc-100">
        <button
          type="button"
          onClick={handleTogglePlay}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
        >
          <Icon
            icon={isPaused ? "mdi:play" : "mdi:pause"}
            className="text-lg"
          />
        </button>
        <div className="flex items-center gap-1 text-[12px] tabular-nums">
          <span>
            {currentMinutes}:{currentSeconds}
          </span>
          <span className="mx-1 text-zinc-400">/</span>
          <span className="text-zinc-300">
            {totalMinutes}:{totalSeconds}
          </span>
        </div>
        <div className="ml-auto text-[11px] text-zinc-300">
          DASH 自适应码率
        </div>
      </div>

      <div
        className="group relative h-1.5 w-full cursor-pointer rounded-full bg-zinc-600/70"
        onClick={handleSeek}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-zinc-400/80"
          style={{ width: bufferedBarWidth }}
        />
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-red-500"
          style={{ width: progressBarWidth }}
        >
          <div className="absolute -right-1 top-1/2 hidden h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow group-hover:block" />
        </div>
      </div>
    </div>
  );
};

