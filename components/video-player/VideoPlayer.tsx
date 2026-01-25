"use client";
import { Icon } from "@iconify/react";
import Settings from "./Settings";

import { Slider } from "@/components/ui/slider";
import { useCallback, useState } from "react";
export function VideoPlayer() {
  const [isVolumeUpHovering, setisVolumeUpHovering] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [visiableSettings, setVisiableSettings] = useState(false); // 控制设置面板的显隐
  const handleVolumeWrapperMouseEnter = () => {
    setisVolumeUpHovering(true);
  };
  const handleVolumeWrapperMouseLeave = () => {
    setisVolumeUpHovering(false);
  };

  const handleSpeedChange = useCallback((changedSpeed: number) => {
    setSpeed(changedSpeed);
  }, []);
  return (
    <div className="video-player flex justify-center items-center w-4xl h-2xl relative rounded-xs outline-none overflow-hidden shadow-sm shadow-gray-500">
      <video
        className="w-full h-full object-cover  relative "
        src="/videos/coverr-a-road-through-the-hills-6377-1080p.mp4"
      ></video>
      <div className="progress-area-time"></div>
      <div className="controls absolute bottom-0 left-0 right-0 h-[50px] w-full bg-[rgba(0,0,0,0.7)] shadow-[0_0_40px_10px_rgba(0,0,0,0.25)] z-3 translate-y-0 text-white">
        <div className="progress-area relative w-full h-[5px] bg-[#f0f0f0] cursor-pointer">
          <div className="progress-bar absolute w-[50%]  bg-[rgba(255,174,0)] h-[inherit] rounded-[inherit]">
            <span className="absolute w-[14px] h-[14px] rounded-[50%] right-[-5px] top-[50%] translate-y-[-50%] bg-[inherit]"></span>
          </div>
        </div>
        <div className="controls-list flex justify-between items-center w-[97%] h-[45px] mx-auto ">
          <div className="controls-left flex items-center gap-2">
            <span className="icon w-[30px]">
              <Icon
                icon="material-symbols:replay-10"
                className="select-none cursor-pointer flex-shrink-0 text-[26px] transition duration-200 active:rotate-[-45deg]"
              />
            </span>
            <span className="icon w-[30px]">
              <Icon
                icon="material-symbols:play-arrow"
                className="select-none cursor-pointer flex-shrink-0 text-[26px]"
              />
            </span>
            <span className="icon w-[30px]">
              <Icon
                icon="material-symbols:forward-10"
                className="select-none cursor-pointer flex-shrink-0 text-[26px] transition duration-200 active:rotate-[45deg]"
              />
            </span>
            <span
              className="icon items-center hidden sm:inline-flex"
              onMouseEnter={handleVolumeWrapperMouseEnter}
              onMouseLeave={handleVolumeWrapperMouseLeave}
            >
              <span className="icon w-[30px] flex-shrink-0">
                <Icon
                  icon="material-symbols:volume-up"
                  className="select-none cursor-pointer text-[26px]"
                />
              </span>
              <Slider
                className={`h-[3px]  transition-all duration-200 ${
                  isVolumeUpHovering
                    ? "w-[100px]  opacity-100"
                    : "w-[0px]  opacity-0"
                }`}
                defaultValue={[33]}
                max={100}
                step={1}
              />
            </span>
            <div className="timer font-size-[12px] whitespace-nowrap ">
              <span className="current-time">0:00</span> /{" "}
              <span className="total-time">0:00</span>
            </div>
          </div>

          <div className="controls-right flex justify-end items-center gap-2">
            <span className="icon">
              <div className="select-none cursor-pointer text-[26px] w-[30px] h-[10px] rounded-[20px] relative bg-[#b6b6b6]">
                <div className="absolute w-[17px] h-[17px] leading-[17px] left-[-5px] top-[50%] translate-y-[-50%] bg-[#727272] flex justify-center  items-center cursor-pointer rounded-[50%]">
                  <Icon
                    icon="material-symbols:pause"
                    className="select-none cursor-pointer text-[12px]"
                  />
                </div>
              </div>
            </span>
            <span className="icon">
              <Icon
                icon="material-symbols:settings"
                className="select-none cursor-pointer text-[26px] transition-transform duration-300 hover:rotate-[45deg]"
              />
            </span>
            <span className="icon hidden sm:block">
              <Icon
                icon="material-symbols:picture-in-picture-alt"
                className="select-none cursor-pointer text-[26px]"
              />
            </span>
            <span className="icon">
              <Icon
                icon="material-symbols:fullscreen"
                className="select-none cursor-pointer text-[26px]"
              />
            </span>
          </div>
        </div>

        {visiableSettings && (
          <Settings
            speed={speed}
            onSpeedChange={handleSpeedChange}
            className="absolute w-[200px] h-[250px] right-[25px] bottom-[62px] bg-[rgba(28,28,28,0.7)] text-[#fff] overflow-y-auto z-20"
          ></Settings>
        )}
      </div>
    </div>
  );
}
