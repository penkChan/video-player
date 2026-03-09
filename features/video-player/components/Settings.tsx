import clsx from "clsx";
import { Icon } from "@iconify/react";
import React, { forwardRef, useState } from "react";
import Speed, { SpeedProps } from "./Speed";
export interface SettingsProps extends React.HTMLAttributes<HTMLDivElement>, SpeedProps {
}
const Settings = forwardRef<HTMLDivElement, SettingsProps>(
  ({ className, speed, onSpeedChange }, ref) => {
    const [currentSetting, setCurrentSetting] = useState<string | null>(null)
    const settings: string[] = ["speed"]
    return (
      <div ref={ref} className={clsx("settings", className)}>
        <ul className="relative">
          {currentSetting === null && settings.map((settingItem) => (
            <li
              key={settingItem}
              className="relative w-full cursor-pointer pl-[12px] py-[12px] text-[14px] hover:bg-[rgba(28,28,28,0.9))] flex items-center gap-1"
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
          />
        )}
      </div>
    );
  },
);

Settings.displayName = "Settings";

export default React.memo(Settings);
