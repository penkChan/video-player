import clsx from "clsx";
import { Icon } from "@iconify/react";
import React, { forwardRef } from "react";
export interface SpeedProps extends React.HTMLAttributes<HTMLDivElement> {
  speed: number;
  onSpeedChange: (speed: number) => void;
}
const Speed = forwardRef<HTMLDivElement, SpeedProps>(
  ({ className, speed, onSpeedChange }, ref) => {
    const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    return (
      <div ref={ref} className={clsx("speed h-[200px] overflow-y-auto", className)}>
        <div className="playback">
          <span className="text-[14px] font-light px-[30px] py-[15px] border-b border-solid border-b-[rgba(83,83,83)] flex justify-center items-center">
            Playback Speed
          </span>
          <ul className="relative">
            {speeds.map((speedItem) => (
              <li
                key={speedItem}
                className="relative w-full cursor-pointer pl-[12px] py-[12px] text-[14px] hover:bg-[rgba(28,28,28,0.9)] flex items-center gap-1"
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
  },
);

Speed.displayName = "Speed";

export default React.memo(Speed);
