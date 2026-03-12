import type { Dispatch, RefObject, SetStateAction } from "react";

export interface Track {
  // 只在 UI 中展示的字幕名称，这里简化为纯字符串（例如 "en"、"zh-CN"）
  label: string;
  index: number | null;
}

export interface VideoProgress {
  videoRef: RefObject<HTMLVideoElement | null>;
  mainVideoRef: RefObject<HTMLDivElement | null>;
  setShowProgressAreaTime: Dispatch<SetStateAction<boolean>>;
  showProgressAreaTime: boolean;
  isProgressThumbPointerDown: boolean;
  setIsProgressThumbPointerDown: Dispatch<SetStateAction<boolean>>;
  setProgressBarWidth: Dispatch<SetStateAction<string>>;
  progressBarWidth: string;
  bufferedBarWidth: string;
}

export interface BaseSettingsProps {
  onBackToSettings: () => void;
}
