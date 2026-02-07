"use client";
import { Icon } from "@iconify/react";
import Settings from "./Settings";

import { Slider } from "@/components/ui/slider";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePlayerStore } from "@/stores/player.store";
export function VideoPlayer() {
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);
  const [isVolumeUpHovering, setisVolumeUpHovering] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [visiableSettings, setVisiableSettings] = useState(false); // 控制设置面板的显隐
  const [isPaused, setIsPaused] = useState(true);
  const [totalSeconds, setTotalSeconds] = useState("00"); // 视频总时长的秒数字符
  const [totalMinutes, setTotalMinutes] = useState("00"); // 视频总时长的分钟数字符
  const [currentSeconds, setCurrentSeconds] = useState("00"); // 视频当前时长的秒数字符
  const [currentMinutes, setCurrentMinutes] = useState("00"); // 视频当前时长的分钟数字符
  const [progressBarWidth, setProgressBarWidth] = useState("0%"); // 进度条的宽度
  const [isMuted, setIsMuted] = useState(false);
  const [progressAreaTimeLeft, setProgressAreaTimeLeft] = useState("0px"); // 进度条时间提示框的左偏移量
  const [showProgressAreaTime, setShowProgressAreaTime] = useState(false); //  显示进度条时间提示框
  const [progressAreaTime, setProgressAreaTime] = useState("0:00"); // 进度条时间提示框显示的时间
  const [autoPlayActive, setAutoPlayActive] = useState(false); // 自动播放按钮状态
  const [isEnded, setIsEnded] = useState(false); // 视频是否播放结束
  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressAreaRef = useRef<HTMLDivElement>(null);
  const progressAreaTimeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 延迟加载视频，防止video loadedData事件触发太慢
    const raf = requestAnimationFrame(() => {
      setVideoSrc("/videos/hao-ri-zi.mp4");
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const volumeIconName = useMemo(
    () =>
      volume[0] === 0
        ? "volume-off"
        : volume[0] < 40
          ? "volume-down"
          : "volume-up",
    [volume],
  );

  useEffect(() => {
    if (videoRef.current !== null) {
      videoRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  // 处理音量滑块显示
  const handleVolumeWrapperMouseEnter = () => {
    setisVolumeUpHovering(true);
  };
  // 处理音量滑块隐藏
  const handleVolumeWrapperMouseLeave = () => {
    setisVolumeUpHovering(false);
  };

  // 处理速度改变
  const handleSpeedChange = useCallback((changedSpeed: number) => {
    setSpeed(changedSpeed);
  }, []);

  // 播放
  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPaused(false);
    }
  };

  // 暂停
  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPaused(true);
    }
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

  // 监听播放
  const handleVideoPlay = () => {
    setIsPaused(false);
  };
  // 监听暂停
  const handleVideoPause = () => {
    setIsPaused(true);
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

  // 处理视频加载完成
  const handleVideoLoadedData = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      const totalMinutes = Math.floor(duration / 60);
      const totalSeconds = Math.floor(duration % 60);
      setTotalSeconds(
        totalSeconds < 10 ? `0${totalSeconds}` : totalSeconds.toString(),
      );
      setTotalMinutes(totalMinutes.toString());
    }
  };

  // 处理时间更新
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const currentMinutes = Math.floor(currentTime / 60);
      const currentSeconds = Math.floor(currentTime % 60);
      setCurrentSeconds(
        currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds.toString(),
      );
      setCurrentMinutes(currentMinutes.toString());
      setProgressBarWidth(
        `${(currentTime / videoRef.current.duration) * 100}%`,
      );
    }
  };
  // 处理进度条点击
  const handleProgressAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressAreaRef.current && videoRef.current) {
      const progressAreaWidth = progressAreaRef.current?.offsetWidth;
      const rect = progressAreaRef.current.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      videoRef.current.currentTime =
        (clickPosition / progressAreaWidth) * videoRef.current.duration;
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

  const handleAutoPlayClick = () => {
    setAutoPlayActive(!autoPlayActive);
  };

  const handleProgressAreaClickMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    setShowProgressAreaTime(true);
    if (progressAreaRef.current !== null && videoRef.current !== null) {
      const progressWidth = progressAreaRef.current.clientWidth || 0;
      const rect = progressAreaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setProgressAreaTimeLeft(`${x}px`);
      const duration = videoRef.current.duration;
      const currentTime = (x / progressWidth) * duration;
      const totalMinutes = Math.floor(currentTime / 60);
      const totalSeconds = Math.floor(currentTime % 60);
      setProgressAreaTime(
        `${totalMinutes}:${totalSeconds < 10 ? `0${totalSeconds}` : totalSeconds}`,
      );
    }
  };

  const handleProgressAreaClickMouseLeave = () => {
    setShowProgressAreaTime(false);
  };

  const handleVideoOnEnded = () => {
    if (autoPlayActive) {
      playVideo();
      setIsEnded(false);
    } else {
      setIsEnded(true);
    }
  };

  return (
    <div className="video-player flex justify-center items-center w-4xl h-2xl relative rounded-xs outline-none overflow-hidden shadow-sm shadow-gray-500">
      <video
        ref={videoRef}
        className="w-full h-full object-cover  relative "
        src={videoSrc}
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        onLoadedData={handleVideoLoadedData}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoOnEnded}
      ></video>
      <div className="progress-area-time"></div>
      <div className="controls absolute bottom-0 left-0 right-0 h-[50px] w-full bg-[rgba(0,0,0,0.7)] shadow-[0_0_40px_10px_rgba(0,0,0,0.25)] z-3 translate-y-0 text-white">
        <div
          ref={progressAreaRef}
          className="progress-area relative w-full h-[5px] bg-[#f0f0f0] cursor-pointer "
          onClick={handleProgressAreaClick}
          onMouseMove={handleProgressAreaClickMouseMove}
          onMouseLeave={handleProgressAreaClickMouseLeave}
        >
          {showProgressAreaTime && (
            <div
              ref={progressAreaTimeRef}
              className="absolute bottom-[20px] min-w-[50px] min-h-[20px] py-[5px] px-[10px] text-[#fff] text-[14px] bg-[#002333] rounded-[5px] z-1 translate-x-[-50%]"
              style={{ left: progressAreaTimeLeft }}
            >
              {progressAreaTime}
              <div className="absolute bottom-[-50%] left-[50%] translate-[-50%] rotate-[45deg] bg-[#002333] w-[15px] h-[15px] z-[-1]"></div>
            </div>
          )}
          <div
            className="progress-bar absolute  bg-[rgba(255,174,0)] h-[inherit] rounded-[inherit]"
            style={{
              width: progressBarWidth,
            }}
          >
            <span className="absolute w-[14px] h-[14px] rounded-[50%] right-[-5px] top-[50%] translate-y-[-50%] bg-[inherit]"></span>
          </div>
        </div>
        <div className="controls-list flex justify-between items-center w-[97%] h-[45px] mx-auto ">
          <div className="controls-left flex items-center gap-2">
            <span
              className="icon w-[30px]"
              onClick={handleReplay10SecondsClick}
            >
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
            <span className="icon">
              <Icon
                icon="material-symbols:settings"
                className="select-none cursor-pointer text-[26px] transition-transform duration-300 hover:rotate-[45deg]"
              />
            </span>
            <span className="icon hidden sm:block">
              <Icon
                icon="material-symbols:picture-in-picture-alt"
                className="select-none cursor-pointer text-[26px]"
              />
            </span>
            <span className="icon">
              <Icon
                icon="material-symbols:fullscreen"
                className="select-none cursor-pointer text-[26px]"
              />
            </span>
          </div>
        </div>

        {visiableSettings && (
          <Settings
            speed={speed}
            onSpeedChange={handleSpeedChange}
            className="absolute w-[200px] h-[250px] right-[25px] bottom-[62px] bg-[rgba(28,28,28,0.7)] text-[#fff] overflow-y-auto z-20"
          ></Settings>
        )}
      </div>
    </div>
  );
}
