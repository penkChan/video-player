import clsx from "clsx";
import { Icon } from "@iconify/react";
import React, { forwardRef, useCallback, useState } from "react";
import type { RefObject } from "react";
import type { BaseSettingsProps } from "../types/DashVideiPlayer";
import type dashjs from "dashjs";
import Speed, { type SpeedProps } from "./Speed";
import Quality from "./Quality";

export interface SettingsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<SpeedProps, keyof BaseSettingsProps> {
  videoRef: RefObject<HTMLVideoElement | null>;
  playerRef: RefObject<dashjs.MediaPlayerClass | null>;
  streamReady?: boolean;
}

const Settings = forwardRef<HTMLDivElement, SettingsProps>(
  (
    {
      className,
      speed,
      onSpeedChange,
      videoRef,
      playerRef,
      streamReady,
    },
    ref,
  ) => {
    const [currentSetting, setCurrentSetting] = useState<string | null>(null);
    const settings: string[] = ["speed", "quality"];

    const onBackToSettings = useCallback(() => {
      setCurrentSetting(null);
    }, []);

    return (
      <div ref={ref} className={clsx("settings", className)}>
        <ul className="relative">
          {currentSetting === null &&
            settings.map((settingItem) => (
              <li
                key={settingItem}
                className="relative flex w-full cursor-pointer items-center gap-1 py-[12px] pl-[12px] text-[14px] hover:bg-[rgba(28,28,28,0.9)]"
                onClick={() => setCurrentSetting(settingItem)}
              >
                <Icon
                  icon="material-symbols:arrow-forward-ios"
                  className="select-none text-[16px]"
                />
                <div className="w-[20px]">{settingItem}</div>
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
            playerRef={playerRef}
            videoRef={videoRef}
            streamReady={streamReady}
            onBackToSettings={onBackToSettings}
          />
        )}
      </div>
    );
  },
);

Settings.displayName = "Settings";

export default Settings;
