import Image from "next/image";
import { VideoPlayer } from "@/components/video-player/VideoPlayer";

export default function Home() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-[#333] font-sans ">
      <VideoPlayer />
    </div>
  );
}
