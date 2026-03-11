import { DashVideoPlayer } from "@/features/dash-video-player/DashVideoPlayer";

export default function DashPlayerPage() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-[#333] font-sans ">
      <DashVideoPlayer />
    </div>
  );
}

