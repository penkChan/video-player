import clsx from "clsx";

export function Settings({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  return (
    <div className={clsx("settings", className)}>
      <div className="playback">
        <span>Playback Speed</span>
        <ul>
          {speeds.map((speed) => (
            <li key={speed}>
              <button>{speed}x</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
