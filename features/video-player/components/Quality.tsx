import clsx from "clsx";
import { Icon } from "@iconify/react";
import React, { Dispatch, forwardRef, RefObject, SetStateAction, useCallback, useEffect, useMemo, useRef } from "react";
import { BaseSettingsProps, Soruce } from "../types/VideoPlayer";
export interface QualityProps extends React.HTMLAttributes<HTMLDivElement>, BaseSettingsProps {
  currentSoruce: Soruce | undefined;
  setCurrentSoruce: Dispatch<SetStateAction<Soruce | undefined>>;
  soruces: Soruce[];
  videoRef: RefObject<HTMLVideoElement | null>;
}
const Quality = forwardRef<HTMLDivElement, QualityProps>(
  ({ className, onBackToSettings, soruces, currentSoruce, setCurrentSoruce, videoRef }, ref) => {

    const qualities = useMemo(() => soruces.map((soruce) => soruce.quality), [soruces]);
    const quality = useMemo(() => {
      return currentSoruce?.quality;
    }, [currentSoruce]);

    const pendingSeekRef = useRef<{ time: number; shouldPlay: boolean } | null>(null);

    const handleQualityChange = useCallback((changedQuality: string) => {
      if (!videoRef.current) return;

      const soruce = soruces.find((soruce) => soruce.quality === changedQuality);
      if (!soruce || soruce.src === currentSoruce?.src) return;

      pendingSeekRef.current = {
        time: videoRef.current.currentTime,
        shouldPlay: !videoRef.current.paused && !videoRef.current.ended,
      };

      setCurrentSoruce(soruce);
    }, [videoRef, soruces, currentSoruce?.src, setCurrentSoruce]);

    useEffect(() => {
      const video = videoRef.current;
      const pending = pendingSeekRef.current;
      if (!video || !pending) return;

      const { time, shouldPlay } = pending;
      pendingSeekRef.current = null;

      const apply = () => {
        try {
          const duration = video.duration;
          const safeTime = Number.isFinite(duration)
            ? Math.min(time, Math.max(0, duration - 0.1))
            : time;
          video.currentTime = safeTime;
        } catch {
          // ignore seek errors for streams / not-ready states
        }
        if (shouldPlay) void video.play().catch(() => undefined);
      };

      if (video.readyState >= 1) {
        apply();
        return;
      }

      video.addEventListener("loadedmetadata", apply, { once: true });
      video.addEventListener("canplay", apply, { once: true });

      return () => {
        video.removeEventListener("loadedmetadata", apply);
        video.removeEventListener("canplay", apply);
      };
    }, [videoRef, currentSoruce?.src]);

    return (
      <div ref={ref} className={clsx("speed", className)}>
        <div className="text-[14px] font-light pl-[12px] py-[15px] border-b border-solid  border-b-[rgba(83,83,83)]
          flex items-center cursor-pointer hover:bg-[rgba(28,28,28,0.9)]" onClick={onBackToSettings}>
          <Icon icon="material-symbols:arrow-back-ios-new" className="text-[16px] mr-2" />
          Playback Quality
        </div>
        <ul className="relative">
          {qualities.map((qualityItem) => (
            <li
              key={qualityItem}
              className="relative w-full cursor-pointer pl-[12px] py-[12px] text-[14px] hover:bg-[rgba(28,28,28,0.9)] flex items-center gap-1"
              onClick={() => {
                handleQualityChange(qualityItem);
              }}
            >
              <div className="w-[20px]">
                {quality === qualityItem && (
                  <Icon
                    icon="material-symbols:done"
                    className="select-none text-[16px]"
                  />
                )}
              </div>

              {qualityItem}
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

Quality.displayName = "Quality";

export default React.memo(Quality);
