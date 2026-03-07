import { Icon } from "@iconify/react";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/player.store";

import Settings from "./Settings";
import Captions from "./Captions";
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
import { Track, VideoProgress } from "../types/VideoPlayer";
import { Progress } from "./Progress";

export interface ControlsProps
  extends VideoProgress, React.HTMLAttributes<HTMLDivElement> {
  videoRef: RefObject<HTMLVideoElement | null>;
  mainVideoRef: RefObject<HTMLDivElement | null>;
  autoPlayActive: boolean;
  setAutoPlayActive: Dispatch<SetStateAction<boolean>>;
  isPaused: boolean;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
  totalMinutes: string;
  totalSeconds: string;
  currentSeconds: string;
  currentMinutes: string;
  isEnded: boolean;
  visiableSettings: boolean;
  setVisiableSettings: Dispatch<SetStateAction<boolean>>;
  visiableCaptions: boolean;
  setVisiableCaptions: Dispatch<SetStateAction<boolean>>;
  tracks: Track[];
  showControls: boolean;
  playVideo: () => void;
  pauseVideo: () => void;
}
export function Controls({
  videoRef, // 视频元素引用
  autoPlayActive,
  setAutoPlayActive, // 自动播放按钮状态
  isPaused,
  totalMinutes,
  totalSeconds,
  currentSeconds,
  currentMinutes,
  isEnded,
  mainVideoRef,
  visiableSettings,
  setVisiableSettings,
  visiableCaptions,
  setVisiableCaptions,
  tracks,
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
}: ControlsProps) {
  const [isVolumeUpHovering, setisVolumeUpHovering] = useState(false); // 音量滑块显示
  const [isFullScreen, setIsFullScreen] = useState(false); // 全屏按钮状态
  const [speed, setSpeed] = useState(1); // 播放速度
  const [isMuted, setIsMuted] = useState(false);
  const [captionType, setCaptionType] = useState("OFF"); // 字幕类型
  const volume = usePlayerStore((s) => s.volume); // 音量
  const [subtitle, setSubtitle] = useState<string | null>(null); // 当前字幕
  const volumeIconName = useMemo(
    () =>
      volume[0] === 0
        ? "volume-off"
        : volume[0] < 40
          ? "volume-down"
          : "volume-up",
    [volume],
  );

  const setVolume = usePlayerStore((s) => s.setVolume); // 设置音量
  const settingsRef = useRef<HTMLDivElement>(null);
  const captionsRef = useRef<HTMLDivElement>(null);
  const activeTrackRef = useRef<TextTrack | null>(null); //  当前激活的字幕
  const cueHandlerRef = useRef<((e: Event) => void) | null>(null); /// 字幕cueHandlerS



  // 处理点击外部点击事件，关闭设置面板, 关闭字幕面板
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setVisiableSettings(false);
      }
      if (
        captionsRef.current &&
        !captionsRef.current.contains(event.target as Node)
      ) {
        setVisiableCaptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setVisiableCaptions, setVisiableSettings]);

  // 处理音量改变
  useEffect(() => {
    if (videoRef.current !== null) {
      videoRef.current.volume = volume[0] / 100;
    }
  }, [volume, videoRef]);

  // 处理速度改变
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  }, [speed, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tracks = video.textTracks;

    // ✅ 清理旧 track
    if (activeTrackRef.current && cueHandlerRef.current) {
      activeTrackRef.current.removeEventListener(
        "cuechange",
        cueHandlerRef.current,
      );
    }

    if (captionType === "OFF") {
      activeTrackRef.current = null;
      return;
    }

    const track = Array.from(tracks).find((t) => t.label === captionType);

    if (!track) return;

    track.mode = "hidden";

    const handler = () => {
      const active = track.activeCues;
      setSubtitle(
        active && active.length > 0 ? (active[0] as VTTCue).text : "",
      );
    };
    handler(); // 切换时候执行一次

    track.addEventListener("cuechange", handler);

    activeTrackRef.current = track;
    cueHandlerRef.current = handler;
    return () => {
      track.removeEventListener("cuechange", handler);
    };
  }, [captionType, videoRef]);

  // 监听全屏状态 退出全屏更新state状态
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const captionTypes = useMemo(() => {
    return ["OFF", ...tracks.map((track) => track.label)];
  }, [tracks]);

  // 处理速度改变
  const handleSpeedChange = useCallback((changedSpeed: number) => {
    setSpeed(changedSpeed);
  }, []);

  /// 处理字幕类型改变
  const handleCaptionTypeChange = useCallback((changedCaptionType: string) => {
    setCaptionType(changedCaptionType);
  }, []);

  // 处理音量滑块显示
  const handleVolumeWrapperMouseEnter = () => {
    setisVolumeUpHovering(true);
  };
  // 处理音量滑块隐藏
  const handleVolumeWrapperMouseLeave = () => {
    setisVolumeUpHovering(false);
  };
  // 处理播放暂停
  const handlePlayToggle = () => {
    if (videoRef.current) {
      if (isPaused) {
        playVideo();
      } else {
        pauseVideo();
      }
    }
  };

  // 处理快退10秒
  const handleReplay10SecondsClick = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };
  // 处理快进10秒
  const handeleForward10SecondsClick = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };
  // 处理音量改变
  const handleVolumeChange = (volume: Array<number>) => {
    if (volume[0] !== 0) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
    setVolume(volume);
  };

  // 处理音量图标点击
  const handleVolumeIconClick = () => {
    if (isMuted) {
      if (volume[0] === 0) {
        setVolume([40]);
      } else {
        if (videoRef.current) {
          videoRef.current.volume = volume[0] / 100;
        }
      }
    } else {
      if (videoRef.current) {
        videoRef.current.volume = 0;
      }
    }
    setIsMuted(!isMuted);
  };
  // 处理自动播放点击
  const handleAutoPlayClick = () => {
    setAutoPlayActive(!autoPlayActive);
  };

  // 处理画中画
  const handlePictureInPictureClick = () => {
    if (isFullScreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
    if (videoRef.current) {
      videoRef.current.requestPictureInPicture();
    }
  };

  // 处理全屏
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
  // 处理设置点击
  const handleSettingClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setVisiableSettings(!visiableSettings);
  };

  // 处理字幕点击
  const handleCaptionTypeClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setVisiableCaptions(!visiableCaptions);
  };

  return (
    <div
      className={`controls absolute bottom-0 left-0 right-0 h-[50px] w-full bg-[rgba(0,0,0,0.7)] shadow-[0_0_40px_10px_rgba(0,0,0,0.25)] z-3 translate-y-0 text-white duration-[0.3s] ${showControls ? "translate-y-[0px]" : "translate-y-[110%]"}`}
    >
      {captionType !== "OFF" && (
        <p className="absolute left-[50%] top-[0] width-[90%] max-width-[90%] translate-x-[-50%] translate-y-[-150%] text-center select-none transition-[bottom] duration-300 ">
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
      ></Progress>

      <div className="controls-list flex justify-between items-center w-[97%] h-[45px] mx-auto ">
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
          <span
            className="icon w-[30px]"
            onClick={handeleForward10SecondsClick}
          >
            <Icon
              icon="material-symbols:forward-10"
              className="select-none cursor-pointer flex-shrink-0 text-[26px] transition duration-200 active:rotate-[45deg]"
            />
          </span>
          <span
            className="icon items-center hidden sm:inline-flex"
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
              className={`h-[3px] transition-all duration-200 ${
                isVolumeUpHovering
                  ? "w-[100px] opacity-100"
                  : "w-[0px] opacity-0"
              }`}
              max={100}
              step={1}
              value={isMuted ? [0] : volume}
              onValueChange={handleVolumeChange}
            />
          </span>
          <div className="timer font-size-[12px] whitespace-nowrap ">
            <span className="current-time">
              {currentMinutes}:{currentSeconds}
            </span>
            /
            <span className="total-time">
              {totalMinutes}:{totalSeconds}
            </span>
          </div>
        </div>

        <div className="controls-right flex justify-end items-center gap-2">
          <span className="icon">
            <div
              className="select-none cursor-pointer text-[26px] w-[30px] h-[10px] rounded-[20px] relative bg-[#b6b6b6]"
              onClick={handleAutoPlayClick}
            >
              <div
                className={`absolute w-[17px] h-[17px] leading-[17px]  top-[50%] translate-y-[-50%] bg-[#727272] flex justify-center  items-center cursor-pointer rounded-[50%] ${
                  autoPlayActive
                    ? "left-auto right-[-5px]"
                    : "left-[-5px] right-0"
                }`}
              >
                {autoPlayActive ? (
                  <Icon
                    icon="material-symbols:pause"
                    className="select-none cursor-pointer text-[12px]"
                  />
                ) : (
                  <Icon
                    icon="material-symbols:play-arrow"
                    className="select-none cursor-pointer text-[12px]"
                  />
                )}
              </div>
            </div>
          </span>
          <span
            className="icon hidden sm:block"
            onClick={handleCaptionTypeClick}
          >
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
          <span
            className="icon hidden sm:block"
            onClick={handlePictureInPictureClick}
          >
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
      {visiableCaptions && (
        <Captions
          ref={captionsRef}
          captionType={captionType}
          captionTypes={captionTypes}
          onCaptionTypeChange={handleCaptionTypeChange}
          className="absolute w-[200px] h-[250px] right-[25px] bottom-[62px] bg-[rgba(28,28,28,0.7)] text-[#fff] overflow-y-auto z-20"
        ></Captions>
      )}
      {visiableSettings && (
        <Settings
          ref={settingsRef}
          speed={speed}
          onSpeedChange={handleSpeedChange}
          className="absolute w-[200px] h-[250px] right-[25px] bottom-[62px] bg-[rgba(28,28,28,0.7)] text-[#fff] overflow-y-auto z-20"
        ></Settings>
      )}
    </div>
  );
}
