import { useEffect, useRef, useState } from "react";
import { VideoProgress } from "../types/VideoPlayer";
export interface ProgressProps
  extends VideoProgress, React.HTMLAttributes<HTMLDivElement> {}

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
  const [progressAreaTimeLeft, setProgressAreaTimeLeft] = useState("0px"); // 进度条时间提示框的
  const [progressAreaTime, setProgressAreaTime] = useState("0:00"); // 进度条时间提示框显示的时间

  const progressAreaRef = useRef<HTMLDivElement>(null);
  const progressAreaTimeRef = useRef<HTMLDivElement>(null);
  const progressThumb = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    // 延迟加载视频，防止video loadedData事件触发太慢
    const raf = requestAnimationFrame(() => {
      setThumbnailBackgroundImage(
        "url(/images/BigBuckBunnyAcapellaSprite.jpg)",
      );
    });
    return () => cancelAnimationFrame(raf);
  }, []);
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

  // 处理进度条移动
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
      // 调整缩略图位置
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
      // 调整显示的时间
      const duration = videoRef.current.duration;
      const currentTime = (x / progressWidth) * duration;
      const currentMinutes = Math.floor(currentTime / 60);
      const currentSeconds = Math.floor(currentTime % 60);
      setProgressAreaTime(
        `${currentMinutes}:${currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds}`,
      );
      const frame = Math.min(Math.floor(currentTime / 5), cols * rows - 1); // 每5秒一帧 且不能超过最大帧数
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

  // 处理进度条移开
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
      className="progress-area relative w-full h-[5px] bg-[#f0f0f07c] cursor-pointer "
      onClick={handleProgressAreaClick}
      onPointerMove={handleProgressAreaPointerMove}
      onPointerLeave={handleProgressAreaPointerLeave}
      onPointerUp={handleProgressAreaPointerUp}
    >
      <div
        ref={progressAreaTimeRef}
        className={`absolute bottom-[20px] w-[150px] flex flex-col gap-[5px] items-center translate-x-[-50%] ${showProgressAreaTime ? "opacity-100" : "opacity-0"} select-none`}
        style={{ left: progressAreaTimeLeft }}
      >
        <div
          className="w-[160px] h-[90px] bg-white border-2 border-solid border-[#fff] rounded-[3px] bottom-[10px] left-[50%] bg-no-repeat"
          style={{
            backgroundPosition: thumbnailBackgroundPosition,
            backgroundImage: thumbnailBackgroundImage,
          }}
        ></div>

        <div className="inline-flex min-w-[50px] min-h-[20px] py-[5px] px-[10px] text-[#fff] text-[14px] rounded-[5px] z-1">
          {progressAreaTime}
        </div>
      </div>
      <div
        className="progress-bar absolute  bg-[rgba(255,174,0)] h-[inherit] rounded-[inherit]"
        style={{
          width: progressBarWidth,
        }}
      >
        <span
          ref={progressThumb}
          className="absolute w-[14px] h-[14px] rounded-[50%] right-[-5px] top-[50%] translate-y-[-50%] bg-[inherit]"
          onPointerDown={handleProgressThumbPointerDown}
        ></span>
      </div>
      <span
        className="absolute top-[0px] h-[inherit] rounded-[inherit] bg-[rgb(206,206,206)] cursor-pointer z-[-1]"
        style={{ width: bufferedBarWidth }}
      ></span>
    </div>
  );
}
