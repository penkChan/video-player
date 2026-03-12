import { useEffect, useRef, useState } from "react";
import type { VideoProgress } from "../types/DashVideiPlayer";

export interface ProgressProps
  extends VideoProgress,
    React.HTMLAttributes<HTMLDivElement> {}

export function Progress({
  videoRef,
  mainVideoRef,
  setShowProgressAreaTime,
  showProgressAreaTime,
  isProgressThumbPointerDown,
  setIsProgressThumbPointerDown,
  setProgressBarWidth,
  progressBarWidth,
  bufferedBarWidth,
}: ProgressProps) {
  const [thumbnailBackgroundPosition, setThumbnailBackgroundPosition] =
    useState<string>("0px 0px");
  const [thumbnailBackgroundImage, setThumbnailBackgroundImage] = useState<
    string | undefined
  >(undefined);
  const [progressAreaTimeLeft, setProgressAreaTimeLeft] = useState("0px");
  const [progressAreaTime, setProgressAreaTime] = useState("0:00");

  const progressAreaRef = useRef<HTMLDivElement>(null);
  const progressAreaTimeRef = useRef<HTMLDivElement>(null);
  const progressThumb = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setThumbnailBackgroundImage(
        "url(/images/BigBuckBunnyAcapellaSprite.jpg)",
      );
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleProgressAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressAreaRef.current && videoRef.current) {
      const progressAreaWidth = progressAreaRef.current?.offsetWidth;
      const rect = progressAreaRef.current.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      videoRef.current.currentTime =
        (clickPosition / progressAreaWidth) * videoRef.current.duration;
    }
  };

  const handleProgressAreaPointerMove = (
    e: React.PointerEvent<HTMLDivElement>,
  ) => {
    const cols = 10;
    const rows = 10;
    const thumbWidth = 160;
    const thumbHeight = 90;

    setShowProgressAreaTime(true);
    if (
      progressAreaRef.current !== null &&
      videoRef.current !== null &&
      progressAreaTimeRef.current !== null &&
      mainVideoRef.current !== null
    ) {
      const progressWidth = progressAreaRef.current.clientWidth || 0;
      const rect = progressAreaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      let left = x;
      if (left < progressAreaTimeRef.current.clientWidth / 2) {
        left = progressAreaTimeRef.current.clientWidth / 2;
      } else if (
        left >
        mainVideoRef.current.clientWidth -
          progressAreaTimeRef.current.clientWidth / 2
      ) {
        left =
          mainVideoRef.current.clientWidth -
          progressAreaTimeRef.current.clientWidth / 2;
      }

      setProgressAreaTimeLeft(`${left}px`);
      const duration = videoRef.current.duration;
      const currentTime = (x / progressWidth) * duration;
      const currentMinutes = Math.floor(currentTime / 60);
      const currentSeconds = Math.floor(currentTime % 60);
      setProgressAreaTime(
        `${currentMinutes}:${currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds}`,
      );
      const frame = Math.min(Math.floor(currentTime / 5), cols * rows - 1);
      const spriteX = frame % cols;
      const spriteY = Math.floor(frame / cols);

      setThumbnailBackgroundPosition(
        `-${spriteX * thumbWidth}px -${spriteY * thumbHeight}px`,
      );
      if (isProgressThumbPointerDown) {
        const progressAreaWidth = progressAreaRef.current?.offsetWidth;
        const rect = progressAreaRef.current.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        setProgressBarWidth(`${(clickPosition / progressAreaWidth) * 100}%`);
      }
    }
  };

  const handleProgressAreaPointerLeave = () => {
    setShowProgressAreaTime(false);
  };

  const handleProgressThumbPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (progressThumb.current) {
      progressThumb.current.setPointerCapture(event.pointerId);
    }
    setIsProgressThumbPointerDown(true);
  };

  const handleProgressAreaPointerUp = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (progressThumb.current) {
      progressThumb.current.releasePointerCapture(event.pointerId);
    }
    if (
      isProgressThumbPointerDown &&
      progressAreaRef.current &&
      videoRef.current
    ) {
      const progressAreaWidth = progressAreaRef.current?.offsetWidth;
      const rect = progressAreaRef.current.getBoundingClientRect();
      const clickPosition = event.clientX - rect.left;
      videoRef.current.currentTime =
        (clickPosition / progressAreaWidth) * videoRef.current.duration;
    }
    setIsProgressThumbPointerDown(false);
  };

  return (
    <div
      ref={progressAreaRef}
      className="progress-area relative h-[5px] w-full cursor-pointer bg-[#f0f0f07c]"
      onClick={handleProgressAreaClick}
      onPointerMove={handleProgressAreaPointerMove}
      onPointerLeave={handleProgressAreaPointerLeave}
      onPointerUp={handleProgressAreaPointerUp}
    >
      <div
        ref={progressAreaTimeRef}
        className={`absolute bottom-[20px] flex w-[150px] translate-x-[-50%] flex-col items-center gap-[5px] select-none ${showProgressAreaTime ? "opacity-100" : "opacity-0"}`}
        style={{ left: progressAreaTimeLeft }}
      >
        <div
          className="bottom-[10px] left-[50%] h-[90px] w-[160px] rounded-[3px] border-2 border-solid border-[#fff] bg-white bg-no-repeat"
          style={{
            backgroundPosition: thumbnailBackgroundPosition,
            backgroundImage: thumbnailBackgroundImage,
          }}
        />
        <div className="z-1 inline-flex min-h-[20px] min-w-[50px] rounded-[5px] px-[10px] py-[5px] text-[14px] text-[#fff]">
          {progressAreaTime}
        </div>
      </div>
      <div
        className="progress-bar absolute h-[inherit] rounded-[inherit] bg-[rgba(255,174,0)]"
        style={{ width: progressBarWidth }}
      >
        <span
          ref={progressThumb}
          className="absolute right-[-5px] top-[50%] h-[14px] w-[14px] translate-y-[-50%] rounded-[50%] bg-[inherit]"
          onPointerDown={handleProgressThumbPointerDown}
        />
      </div>
      <span
        className="absolute top-[0px] z-[-1] h-[inherit] cursor-pointer rounded-[inherit] bg-[rgb(206,206,206)]"
        style={{ width: bufferedBarWidth }}
      />
    </div>
  );
}
