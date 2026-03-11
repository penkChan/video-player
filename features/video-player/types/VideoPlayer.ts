import { Dispatch, RefObject, SetStateAction } from "react";
export interface Track {
  label: string;
  src: string;
  srcLang: string;
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

export interface Soruce {
  src: string;
  quality: string;
}