"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dashjs from "dashjs";

import { Spinner } from "../../components/ui/spinner";
import { Controls } from "./components/Controls";

export function DashVideoPlayer() {
  const [progressBarWidth, setProgressBarWidth] = useState("0%");
  const [showControls, setShowControls] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [bufferedBarWidth, setBufferedBarWidth] = useState("0%");
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [totalMinutes, setTotalMinutes] = useState("00");
  const [totalSeconds, setTotalSeconds] = useState("00");
  const [currentSeconds, setCurrentSeconds] = useState("00");
  const [currentMinutes, setCurrentMinutes] = useState("00");

  const videoRef = useRef<HTMLVideoElement>(null);
  const mainVideoRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideControlsDelay = 3000;

  useEffect(() => {
    if (!videoRef.current) return;

    const url =
      "http://rdmedia.bbc.co.uk/bbb/2/client_manifest-common_init.mpd";

    const player = dashjs.MediaPlayer().create();
    player.initialize(videoRef.current, url, false);
    player.updateSettings({
      streaming: {
        abr: {
          autoSwitchBitrate: {
            video: true,
          },
        },
      },
    });

    player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
      setSpinnerVisible(false);
    });

    player.on(dashjs.MediaPlayer.events.BUFFER_EMPTY, () => {
      setSpinnerVisible(true);
    });

    player.on(dashjs.MediaPlayer.events.BUFFER_LOADED, () => {
      setSpinnerVisible(false);
    });

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      player.reset();
    };
  }, []);

  // 自动隐藏控制条
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);

    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }

    hideControlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, hideControlsDelay);
  }, []);

  useEffect(() => {
    return () => {
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, []);

  const handleVideoPlay = () => {
    setIsPaused(false);
  };

  const handleVideoPause = () => {
    setIsPaused(true);
  };

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

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPaused(false);
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleMainVideoOnContextMenu = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
  };

  const handleMainVideoOnMouseEnter = () => {
    resetControlsTimer();
  };

  const handleMainVideoOnMouseMove = () => {
    resetControlsTimer();
  };

  const handleMainVideoOnMouseLeave = () => {
    setShowControls(false);
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
      className={`video-player relative flex h-[500px] w-4xl items-center justify-center overflow-hidden rounded-xs shadow-sm shadow-gray-500 ${showControls ? "cursor-auto" : "cursor-none"}`}
      onContextMenu={handleMainVideoOnContextMenu}
      onMouseEnter={handleMainVideoOnMouseEnter}
      onMouseMove={handleMainVideoOnMouseMove}
      onMouseLeave={handleMainVideoOnMouseLeave}
    >
      {spinnerVisible && (
        <Spinner className="absolute left-1/2 top-1/2 z-10 size-8 -translate-x-1/2 -translate-y-1/2" />
      )}
      <video
        ref={videoRef}
        className="relative h-full w-full object-cover"
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        onLoadedData={handleVideoLoadedData}
        onTimeUpdate={handleTimeUpdate}
        onWaiting={handleVideoWaiting}
        onCanPlay={handleVideoCanPlay}
        crossOrigin="anonymous"
      />
      <Controls
        videoRef={videoRef}
        isPaused={isPaused}
        playVideo={playVideo}
        pauseVideo={pauseVideo}
        totalMinutes={totalMinutes}
        totalSeconds={totalSeconds}
        currentSeconds={currentSeconds}
        currentMinutes={currentMinutes}
        progressBarWidth={progressBarWidth}
        bufferedBarWidth={bufferedBarWidth}
        showControls={showControls}
      />
    </div>
  );
}

