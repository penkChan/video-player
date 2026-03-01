import clsx from "clsx";
import { Icon } from "@iconify/react";
import React, { forwardRef } from "react";
export interface CaptionsProps extends React.HTMLAttributes<HTMLDivElement> {
  captionType: string;
  captionTypes: string[];
  onCaptionTypeChange: (speed: string) => void;
}
const Captions = forwardRef<HTMLDivElement, CaptionsProps>(
  ({ className, captionType, captionTypes, onCaptionTypeChange }, ref) => {
    return (
      <div ref={ref} className={clsx("settings", className)}>
        <div className="playback">
          <span className="text-[14px] font-[300] px-[30px] py-[15px] border-b-[1px] border-solid border-b-[_rgba(83,83,83)] flex justify-center items-center">
            Select Subtitle
          </span>
          <ul className="relative">
            {captionTypes.map((captionItem) => (
              <li
                key={captionItem}
                className="relative w-full cursor-pointer pl-[12px] py-[12px] text-[14px] hover:bg-[rgba(28,28,28,0.9))] flex items-center gap-1"
                onClick={() => {
                  onCaptionTypeChange(captionItem);
                }}
              >
                <div className="w-[20px]">
                  {captionType === captionItem && (
                    <Icon
                      icon="material-symbols:done"
                      className="select-none text-[16px]"
                    />
                  )}
                </div>

                {captionItem}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
);

Captions.displayName = "Captions";

export default React.memo(Captions);
