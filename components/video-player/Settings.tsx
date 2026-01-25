import clsx from "clsx";
import { Icon } from "@iconify/react";
import React from "react";
export interface SettingsProps extends React.HTMLAttributes<HTMLDivElement> {
  speed: number;
  onSpeedChange: (speed: number) => void;
}
const Settings = ({ className, speed, onSpeedChange }: SettingsProps) => {
  const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  return (
    <div className={clsx("settings", className)}>
      <div className="playback">
        <span className="text-[14px] font-[300] px-[30px] py-[15px] border-b-[1px] border-solid border-b-[_rgba(83,83,83)] flex justify-center items-center">
          Playback Speed
        </span>
        <ul className="relative">
          {speeds.map((speedItem) => (
            <li
              key={speedItem}
              className="relative w-full cursor-pointer pl-[12px] py-[12px] text-[14px] hover:bg-[rgba(28,28,28,0.9))] flex items-center gap-1"
              onClick={() => {
                onSpeedChange(speedItem);
              }}
            >
              <div className="w-[20px]">
                {speed === speedItem && (
                  <Icon
                    icon="material-symbols:done"
                    className="select-none text-[16px]"
                  />
                )}
              </div>

              {speedItem}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default React.memo(Settings);
