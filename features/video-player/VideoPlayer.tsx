"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Spinner } from "../../components/ui/spinner";
import { Track } from "./types/VideoPlayer";
import { Controls } from "./components/Controls";
// import useSWR from "swr";
// import { request } from "@/utils/fetcher";

export function VideoPlayer() {
  const [visiableSettings, setVisiableSettings] = useState(false); // 控制设置面板的显隐
  const [autoPlayActive, setAutoPlayActive] = useState(false); // 自动播放按钮状态

  const [progressBarWidth, setProgressBarWidth] = useState("0%"); // 进度条的宽度

  const [showProgressAreaTime, setShowProgressAreaTime] = useState(false); //  显示进度条时间提示框

  const [showControls, setShowControls] = useState(false); // 控制控制条显隐
  const [isPaused, setIsPaused] = useState(true); //  播放暂停

  const [bufferedBarWidth, setBufferedBarWidth] = useState("0%"); // 缓冲条的宽度
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined); // 视频源

  const [visiableCaptions, setVisiableCaptions] = useState(false); // 控制字幕面板显隐、
  const [tracks, setTracks] = useState<Track[]>([]); // 字幕列表

  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [isProgressThumbPointerDown, setIsProgressThumbPointerDown] =
    useState(false);
  const [totalMinutes, setTotalMinutes] = useState("00"); // 视频总时长的分钟数字符
  const [totalSeconds, setTotalSeconds] = useState("00"); // 视频总时长的秒数字符

  const [currentSeconds, setCurrentSeconds] = useState("00"); // 视频当前时长的秒数字符
  const [currentMinutes, setCurrentMinutes] = useState("00"); // 视频当前时长的分钟数字符
  const [isEnded, setIsEnded] = useState(false); // 视频是否播放结束

  const videoRef = useRef<HTMLVideoElement>(null);

  const mainVideoRef = useRef<HTMLDivElement>(null);

  const timerRef = useRef<NodeJS.Timeout>(null);

  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null); // 控制控制条隐藏的定时器
  const hideControlsDelay = 3000; // 2秒隐藏

  // "/videos/hao-ri-zi.mp4" // 测试视频(public)
  // https://github.com/mediaelement/mediaelement-files/blob/master/big_buck_bunny.mp4?raw=true
  // "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

  useEffect(() => {
    // 延迟加载视频，防止video loadedData事件触发太慢
    const raf = requestAnimationFrame(() => {
      setVideoSrc(
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      );
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // 清除定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, []);

  // 监听播放
  const handleVideoPlay = () => {
    setIsPaused(false);
  };
  // 监听暂停
  const handleVideoPause = () => {
    setIsPaused(true);
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
      timerRef.current = setInterval(() => {
        if (videoRef.current && videoRef.current.buffered.length !== 0) {
          const bufferedTime = videoRef.current.buffered.end(
            videoRef.current.buffered.length - 1,
          );
          const duration = videoRef.current.duration;
          const width = (bufferedTime / duration) * 100;

          setBufferedBarWidth(`${width}%`);
        }
      }, 500);
    }
  };

  // 处理时间更新
  const handleTimeUpdate = () => {
    if (!isProgressThumbPointerDown && videoRef.current) {
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

  // 处理视频播放结束
  const handleVideoEnded = () => {
    if (autoPlayActive) {
      playVideo();
      setIsEnded(false);
    } else {
      setIsEnded(true);
    }
  };
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

  // 处理主视频右键
  const handleMainVideoOnContextMenu = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
  };
  // 重置控制栏定时器
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);

    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }

    hideControlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
      setVisiableSettings(false);
      setVisiableCaptions(false);
      setShowProgressAreaTime(false);
    }, hideControlsDelay);
  }, []);
  // 处理主视频鼠标移入 显示控制栏
  const handleMainVideoOnMouseEnter = () => {
    resetControlsTimer();
  };

  // 处理主视频鼠标移动
  const handleMainVideoOnMouseMove = () => {
    resetControlsTimer();
  };

  // 处理主视频鼠标移出 隐藏控制栏
  const handleMainVideoOnMouseLeave = () => {
    setShowControls(false);
    setVisiableSettings(false);
    setVisiableCaptions(false);
    setShowProgressAreaTime(false);
  };

  const handleVideoWaiting = () => {
    setSpinnerVisible(true);
  };

  const handleVideoCanPlay = () => {
    setSpinnerVisible(false);
  };

  return (
    <div
      ref={mainVideoRef}
      className={`video-player flex justify-center items-center w-4xl h-[500px] relative rounded-xs outline-none overflow-hidden shadow-sm shadow-gray-500 ${showControls ? "cursor-auto" : "cursor-none"}`}
      onContextMenu={handleMainVideoOnContextMenu}
      onMouseEnter={handleMainVideoOnMouseEnter}
      onMouseMove={handleMainVideoOnMouseMove}
      onMouseLeave={handleMainVideoOnMouseLeave}
    >
      {spinnerVisible && (
        <Spinner className="size-8 absolute left-[50%] top-[50%]  translate-x-[-50%] translate-y-[-50%] z-10"></Spinner>
      )}
      <video
        ref={videoRef}
        className="w-full h-full object-cover  relative "
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        onLoadedData={handleVideoLoadedData}
        onTimeUpdate={handleTimeUpdate}
        src={videoSrc}
        onEnded={handleVideoEnded}
        onWaiting={handleVideoWaiting}
        onCanPlay={handleVideoCanPlay}
        crossOrigin="anonymous"
      >
        {tracks.map((trackItem) => (
          <track
            key={trackItem.src}
            kind="subtitle"
            src={trackItem.src}
            srcLang={trackItem.srcLang}
            label={trackItem.label}
          />
        ))}
      </video>
      <Controls
        videoRef={videoRef}
        autoPlayActive={autoPlayActive}
        setAutoPlayActive={setAutoPlayActive}
        isPaused={isPaused}
        totalMinutes={totalMinutes}
        totalSeconds={totalSeconds}
        currentSeconds={currentSeconds}
        currentMinutes={currentMinutes}
        isEnded={isEnded}
        mainVideoRef={mainVideoRef}
        visiableSettings={visiableSettings}
        setVisiableSettings={setVisiableSettings}
        visiableCaptions={visiableCaptions}
        setVisiableCaptions={setVisiableCaptions}
        setIsPaused={setIsPaused}
        tracks={tracks}
        setTracks={setTracks}
        showControls={showControls}
        isProgressThumbPointerDown={isProgressThumbPointerDown}
        setIsProgressThumbPointerDown={setIsProgressThumbPointerDown}
        setProgressBarWidth={setProgressBarWidth}
        progressBarWidth={progressBarWidth}
        bufferedBarWidth={bufferedBarWidth}
        setShowProgressAreaTime={setShowProgressAreaTime}
        showProgressAreaTime={showProgressAreaTime}
        playVideo={playVideo}
        pauseVideo={pauseVideo}
      ></Controls>
    </div>
  );
}
