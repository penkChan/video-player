import clsx from "clsx";
import { Icon } from "@iconify/react";
import React, { forwardRef, useCallback, useState } from "react";
import Speed, { SpeedProps } from "./Speed";
import Quality, { QualityProps } from "./Quality";
import { BaseSettingsProps } from "../types/VideoPlayer";
import type { RefObject } from "react";

export interface SettingsProps
  extends React.HTMLAttributes<HTMLDivElement>,
  Omit<SpeedProps, keyof BaseSettingsProps>,
  Omit<QualityProps, keyof BaseSettingsProps> {
  videoRef: RefObject<HTMLVideoElement | null>;
}
const Settings = forwardRef<HTMLDivElement, SettingsProps>(
  ({ className, speed, onSpeedChange, soruces, currentSoruce, setCurrentSoruce, videoRef }, ref) => {
    const [currentSetting, setCurrentSetting] = useState<string | null>(null)
    const settings: string[] = ["speed", "quality"]
    const onBackToSettings = useCallback(() => {
      setCurrentSetting(null);
    }, []);
    return (
      <div ref={ref} className={clsx("settings", className)}>
        <ul className="relative">
          {currentSetting === null && settings.map((settingItem) => (
            <li
              key={settingItem}
              className="relative w-full cursor-pointer pl-[12px] py-[12px] text-[14px] hover:bg-[rgba(28,28,28,0.9)] flex items-center gap-1"
              onClick={() => {
                setCurrentSetting(settingItem);
              }}
            >
              <Icon
                icon="material-symbols:arrow-forward-ios"
                className="select-none text-[16px]"
              />
              <div className="w-[20px]">
                {settingItem}
              </div>
            </li>
          ))}

        </ul>
        {currentSetting === "speed" && (
          <Speed
            speed={speed}
            onSpeedChange={onSpeedChange}
            onBackToSettings={onBackToSettings}
          />
        )}
        {currentSetting === "quality" && (
          <Quality
            soruces={soruces}
            currentSoruce={currentSoruce}
            setCurrentSoruce={setCurrentSoruce}
            onBackToSettings={onBackToSettings}
            videoRef={videoRef}
          />
        )}
      </div>
    );
  }
);
Settings.displayName = "Settings";
export default Settings;