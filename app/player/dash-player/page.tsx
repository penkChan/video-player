"use client";
import dynamic from "next/dynamic";
// 动态导入 DashVideoPlayer 组件，禁用 SSR
const DashVideoPlayer = dynamic(
  () =>
    import("@/features/dash-video-player/DashVideoPlayer").then(
      (mod) => mod.DashVideoPlayer,
    ),
  { ssr: false },
);

export default function DashPlayerPage() {
  return <DashVideoPlayer />;
}
