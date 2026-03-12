"use client";

import { Icon } from "@iconify/react";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/player.store";
import clsx from "clsx";
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Track, VideoProgress } from "../types/DashVideiPlayer";
import dashjs, { type MediaPlayerClass } from "dashjs";
import { Progress } from "./Progress";
import Settings from "./Settings";
import Captions from "./Captions";

export interface ControlsProps extends VideoProgress {
  videoRef: RefObject<HTMLVideoElement | null>;
  mainVideoRef: RefObject<HTMLDivElement | null>;
  playerRef: RefObject<MediaPlayerClass | null>;
  autoPlayActive: boolean;
  setAutoPlayActive: Dispatch<SetStateAction<boolean>>;
  isPaused: boolean;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
  totalMinutes: string;
  totalSeconds: string;
  currentSeconds: string;
  currentMinutes: string;
  isEnded: boolean;
  visibleSettings: boolean;
  setVisibleSettings: Dispatch<SetStateAction<boolean>>;
  visibleCaptions: boolean;
  setVisibleCaptions: Dispatch<SetStateAction<boolean>>;
  tracks: Track[];
  bitrateList: import("dashjs").BitrateInfo[];
  currentQualityIndex: number;
  onQualityChange: (index: number) => void;
  showControls: boolean;
  playVideo: () => void;
  pauseVideo: () => void;
  streamReady?: boolean;
}

export function Controls({
  videoRef,
  mainVideoRef,
  playerRef,
  autoPlayActive,
  setAutoPlayActive,
  isPaused,
  totalMinutes,
  totalSeconds,
  currentSeconds,
  currentMinutes,
  isEnded,
  visibleSettings,
  setVisibleSettings,
  visibleCaptions,
  setVisibleCaptions,
  tracks,
  bitrateList,
  currentQualityIndex,
  onQualityChange,
  showControls,
  isProgressThumbPointerDown,
  setIsProgressThumbPointerDown,
  setProgressBarWidth,
  progressBarWidth,
  bufferedBarWidth,
  setShowProgressAreaTime,
  showProgressAreaTime,
  playVideo,
  pauseVideo,
  streamReady,
}: ControlsProps) {
  const [isVolumeUpHovering, setIsVolumeUpHovering] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [captionType, setCaptionType] = useState("OFF");
  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const [subtitle, setSubtitle] = useState<string | null>(null);

  const volumeIconName = useMemo(
    () =>
      volume[0] === 0
        ? "volume-off"
        : volume[0] < 40
          ? "volume-down"
          : "volume-up",
    [volume],
  );

  const settingsRef = useRef<HTMLDivElement>(null);
  const captionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setVisibleSettings(false);
      }
      if (
        captionsRef.current &&
        !captionsRef.current.contains(event.target as Node)
      ) {
        setVisibleCaptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setVisibleCaptions, setVisibleSettings]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume[0] / 100;
    }
  }, [volume, videoRef]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  }, [speed, videoRef]);

  // 选中某个字幕选项时，通知 dash.js 切换对应的 text track
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    if (captionType === "OFF") {
      // 关闭字幕
      // -1 在 dash.js 中表示禁用 text track
      player.setTextTrack?.(-1);
      return;
    }

    const trackInfo = tracks.find((t) => t.label === captionType);
    if (!trackInfo || trackInfo.index === null) return;

    player.setTextTrack?.(trackInfo.index);
  }, [captionType, tracks, playerRef]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const events = (dashjs as unknown as { MediaPlayer: { events: Record<string, string> } })
      .MediaPlayer.events;

    const onCueEnter = (e: unknown) => {
      if (captionType === "OFF") return;
      const payload = e as { text?: string; html?: string };
      setSubtitle(payload.text ?? payload.html ?? "");
    };

    const onCueExit = () => {
      setSubtitle("");
    };

    const cueEnterEvent = events.CUE_ENTER ?? "cueEnter";
    const cueExitEvent = events.CUE_EXIT ?? "cueExit";

    player.on?.(cueEnterEvent, onCueEnter);
    player.on?.(cueExitEvent, onCueExit);

    return () => {
      player.off?.(cueEnterEvent, onCueEnter);
      player.off?.(cueExitEvent, onCueExit);
    };
  }, [captionType, playerRef]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  const captionTypes = useMemo(
    () => ["OFF", ...tracks.map((t) => t.label)],
    [tracks],
  );

  const handleSpeedChange = useCallback((changedSpeed: number) => {
    setSpeed(changedSpeed);
  }, []);

  const handleCaptionTypeChange = useCallback((changedCaptionType: string) => {
    setCaptionType(changedCaptionType);
  }, []);

  const handleVolumeWrapperMouseEnter = () => setIsVolumeUpHovering(true);
  const handleVolumeWrapperMouseLeave = () => setIsVolumeUpHovering(false);

  const handlePlayToggle = () => {
    if (videoRef.current) {
      if (isPaused) playVideo();
      else pauseVideo();
    }
  };

  const handleReplay10SecondsClick = () => {
    if (videoRef.current) videoRef.current.currentTime -= 10;
  };

  const handleForward10SecondsClick = () => {
    if (videoRef.current) videoRef.current.currentTime += 10;
  };

  const handleVolumeChange = (v: Array<number>) => {
    setIsMuted(v[0] === 0);
    setVolume(v);
  };

  const handleVolumeIconClick = () => {
    if (isMuted) {
      if (volume[0] === 0) setVolume([40]);
      else if (videoRef.current)
        videoRef.current.volume = volume[0] / 100;
    } else {
      if (videoRef.current) videoRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  const handleAutoPlayClick = () => setAutoPlayActive(!autoPlayActive);

  const handlePictureInPictureClick = () => {
    if (isFullScreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
    if (videoRef.current) videoRef.current.requestPictureInPicture();
  };

  const handleFullScreenClick = () => {
    if (mainVideoRef.current) {
      if (isFullScreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      } else {
        mainVideoRef.current.requestFullscreen();
        setIsFullScreen(true);
      }
    }
  };

  const handleSettingClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setVisibleSettings(!visibleSettings);
  };

  const handleCaptionClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setVisibleCaptions(!visibleCaptions);
  };

  return (
    <div
      className={clsx(
        "controls absolute bottom-0 left-0 right-0 z-3 h-[50px] w-full translate-y-0 bg-[rgba(0,0,0,0.7)] text-white shadow-[0_0_40px_10px_rgba(0,0,0,0.25)] duration-[0.3s]",
        showControls ? "translate-y-0" : "translate-y-[110%]",
      )}
    >
      {captionType !== "OFF" && (
        <p className="width-[90%] max-width-[90%] absolute left-[50%] top-[0] translate-x-[-50%] translate-y-[-150%] select-none text-center transition-[bottom] duration-300">
          {subtitle}
        </p>
      )}

      <Progress
        videoRef={videoRef}
        mainVideoRef={mainVideoRef}
        setShowProgressAreaTime={setShowProgressAreaTime}
        showProgressAreaTime={showProgressAreaTime}
        isProgressThumbPointerDown={isProgressThumbPointerDown}
        setIsProgressThumbPointerDown={setIsProgressThumbPointerDown}
        setProgressBarWidth={setProgressBarWidth}
        progressBarWidth={progressBarWidth}
        bufferedBarWidth={bufferedBarWidth}
      />

      <div className="controls-list mx-auto flex h-[45px] w-[97%] items-center justify-between">
        <div className="controls-left flex items-center gap-2">
          <span className="icon w-[30px]" onClick={handleReplay10SecondsClick}>
            <Icon
              icon="material-symbols:replay-10"
              className="select-none cursor-pointer flex-shrink-0 text-[26px] transition duration-200 active:rotate-[-45deg]"
            />
          </span>
          <span className="icon w-[30px]" onClick={handlePlayToggle}>
            {isPaused ? (
              <Icon
                icon={`material-symbols:${isEnded ? "replay" : "play-arrow"}`}
                className="select-none cursor-pointer flex-shrink-0 text-[26px]"
              />
            ) : (
              <Icon
                icon="material-symbols:pause"
                className="select-none cursor-pointer flex-shrink-0 text-[26px]"
              />
            )}
          </span>
          <span className="icon w-[30px]" onClick={handleForward10SecondsClick}>
            <Icon
              icon="material-symbols:forward-10"
              className="select-none cursor-pointer flex-shrink-0 text-[26px] transition duration-200 active:rotate-[45deg]"
            />
          </span>
          <span
            className="icon hidden items-center sm:inline-flex"
            onMouseEnter={handleVolumeWrapperMouseEnter}
            onMouseLeave={handleVolumeWrapperMouseLeave}
          >
            <span className="icon w-[30px] flex-shrink-0">
              <Icon
                icon={`material-symbols:${isMuted ? "volume-off" : volumeIconName}`}
                className="select-none cursor-pointer text-[26px]"
                onClick={handleVolumeIconClick}
              />
            </span>
            <Slider
              className={clsx(
                "h-[3px] transition-all duration-200",
                isVolumeUpHovering ? "w-[100px] opacity-100" : "w-0 opacity-0",
              )}
              max={100}
              step={1}
              value={isMuted ? [0] : volume}
              onValueChange={handleVolumeChange}
            />
          </span>
          <div className="timer font-size-[12px] whitespace-nowrap">
            <span className="current-time">
              {currentMinutes}:{currentSeconds}
            </span>
            /
            <span className="total-time">
              {totalMinutes}:{totalSeconds}
            </span>
          </div>
        </div>

        <div className="controls-right flex items-center justify-end gap-2">
          <span className="icon">
            <div
              className="relative flex h-[10px] w-[30px] cursor-pointer select-none rounded-[20px] bg-[#b6b6b6] text-[26px]"
              onClick={handleAutoPlayClick}
            >
              <div
                className={clsx(
                  "absolute top-[50%] flex h-[17px] w-[17px] translate-y-[-50%] cursor-pointer items-center justify-center rounded-[50%] bg-[#727272] leading-[17px]",
                  autoPlayActive ? "left-auto right-[-5px]" : "left-[-5px] right-0",
                )}
              >
                {autoPlayActive ? (
                  <Icon icon="material-symbols:pause" className="select-none cursor-pointer text-[12px]" />
                ) : (
                  <Icon icon="material-symbols:play-arrow" className="select-none cursor-pointer text-[12px]" />
                )}
              </div>
            </div>
          </span>
          <span className="icon hidden sm:block" onClick={handleCaptionClick}>
            <Icon
              icon="material-symbols:closed-caption"
              className="select-none cursor-pointer text-[26px]"
            />
          </span>
          <span className="icon" onClick={handleSettingClick}>
            <Icon
              icon="material-symbols:settings"
              className="select-none cursor-pointer text-[26px] transition-transform duration-300 hover:rotate-[45deg]"
            />
          </span>
          <span className="icon hidden sm:block" onClick={handlePictureInPictureClick}>
            <Icon
              icon="material-symbols:picture-in-picture-alt"
              className="select-none cursor-pointer text-[26px]"
            />
          </span>
          <span className="icon" onClick={handleFullScreenClick}>
            {isFullScreen ? (
              <Icon
                icon="material-symbols:fullscreen-exit"
                className="select-none cursor-pointer text-[26px]"
              />
            ) : (
              <Icon
                icon="material-symbols:fullscreen"
                className="select-none cursor-pointer text-[26px]"
              />
            )}
          </span>
        </div>
      </div>

      {visibleCaptions && (
        <Captions
          ref={captionsRef}
          captionType={captionType}
          captionTypes={captionTypes}
          onCaptionTypeChange={handleCaptionTypeChange}
          className="absolute bottom-[62px] right-[25px] z-20 h-[250px] w-[200px] overflow-y-auto bg-[rgba(28,28,28,0.7)] text-[#fff]"
        />
      )}
      {visibleSettings && (
        <Settings
          ref={settingsRef}
          speed={speed}
          onSpeedChange={handleSpeedChange}
          videoRef={videoRef}
          streamReady={streamReady}
          bitrateList={bitrateList}
          currentQualityIndex={currentQualityIndex}
          onQualityChange={onQualityChange}
          className="absolute bottom-[62px] right-[25px] z-20 w-[200px] overflow-y-auto bg-[rgba(28,28,28,0.7)] text-[#fff]"
        />
      )}
    </div>
  );
}
