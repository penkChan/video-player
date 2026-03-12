import { PlayerNav } from "./PlayerNav";

export default function PlayerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen w-screen flex-col bg-[#333] font-sans">
      <div className="flex shrink-0 justify-center border-b border-zinc-700/50 bg-zinc-900/80 px-4 py-3">
        <PlayerNav />
      </div>
      <main className="flex flex-1 items-center justify-center">{children}</main>
    </div>
  );
}
