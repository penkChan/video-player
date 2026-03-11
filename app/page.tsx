import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-[#333] font-sans ">
      <div className="flex flex-col items-center gap-6 rounded-lg bg-zinc-900/80 px-10 py-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-white">选择播放器类型</h1>
        <p className="text-sm text-zinc-300">
          你可以在 HTML5 自定义播放器和 dash.js 高性能自适应码率播放器之间切换。
        </p>
        <div className="mt-2 flex gap-4">
          <Link
            href="/html-player"
            className="rounded-md bg-blue-500 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-600 transition-colors"
          >
            HTML5 播放器
          </Link>
          <Link
            href="/dash-player"
            className="rounded-md bg-emerald-500 px-5 py-2 text-sm font-medium text-white shadow hover:bg-emerald-600 transition-colors"
          >
            dash.js 播放器
          </Link>
        </div>
      </div>
    </div>
  );
}
