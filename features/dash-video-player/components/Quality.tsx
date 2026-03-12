import clsx from "clsx";
import { Icon } from "@iconify/react";
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import type { RefObject } from "react";
import type { BaseSettingsProps } from "../types/DashVideiPlayer";
import type dashjs from "dashjs";

export interface QualityProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseSettingsProps {
  playerRef: RefObject<dashjs.MediaPlayerClass | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  streamReady?: boolean;
}

function getQualityLabel(bitrateInfo: dashjs.BitrateInfo): string {
  if (bitrateInfo.height) return `${bitrateInfo.height}p`;
  if (bitrateInfo.bitrate) return `${Math.round(bitrateInfo.bitrate / 1000)}kbps`;
  return `Quality ${bitrateInfo.qualityIndex}`;
}

const Quality = forwardRef<HTMLDivElement, QualityProps>(
  ({ className, onBackToSettings, playerRef, videoRef, streamReady }, ref) => {
    const [bitrateList, setBitrateList] = useState<dashjs.BitrateInfo[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);

    useEffect(() => {
      const player = playerRef.current;
      if (!player || streamReady === false) return;

      const list = player.getBitrateInfoListFor("video");
      if (list && list.length > 0) {
        setBitrateList(list);
        const idx = player.getQualityFor("video");
        setCurrentIndex(typeof idx === "number" ? idx : -1);
      }
    }, [playerRef, streamReady]);

    const handleQualityChange = useCallback(
      (index: number) => {
        const player = playerRef.current;
        if (!player || !videoRef.current) return;
        if (index === currentIndex) return;

        player.updateSettings({
          streaming: {
            abr: {
              autoSwitchBitrate: {
                video: false,
              },
            },
          },
        });
        player.setQualityFor("video", index);
        setCurrentIndex(index);
      },
      [playerRef, videoRef, currentIndex],
    );

    return (
      <div ref={ref} className={clsx("speed", className)}>
        <div
          className="flex cursor-pointer items-center border-b border-solid border-b-[rgba(83,83,83)] py-[15px] pl-[12px] text-[14px] font-light hover:bg-[rgba(28,28,28,0.9)]"
          onClick={onBackToSettings}
        >
          <Icon
            icon="material-symbols:arrow-back-ios-new"
            className="mr-2 text-[16px]"
          />
          Playback Quality
        </div>
        <ul className="relative">
          {bitrateList.map((info, index) => (
            <li
              key={info.qualityIndex}
              className="relative flex w-full cursor-pointer items-center gap-1 py-[12px] pl-[12px] text-[14px] hover:bg-[rgba(28,28,28,0.9)]"
              onClick={() => handleQualityChange(index)}
            >
              <div className="w-[20px]">
                {currentIndex === index && (
                  <Icon
                    icon="material-symbols:done"
                    className="select-none text-[16px]"
                  />
                )}
              </div>
              {getQualityLabel(info)}
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

Quality.displayName = "Quality";

export default React.memo(Quality);
