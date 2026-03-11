import { VideoPlayer } from "@/features/video-player/VideoPlayer";

export default function HtmlPlayerPage() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-[#333] font-sans ">
      <VideoPlayer />
    </div>
  );
}

