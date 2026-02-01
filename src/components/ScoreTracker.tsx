import { useEffect, useState } from "react";

interface ScoreAreaProps {
  score: number;
  color: string;
  teamName: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onColorChange: (color: string) => void;
  onTeamNameChange: (name: string) => void;
  isLeft: boolean;
  isTop: boolean;
}

function ScoreArea({
  score,
  color,
  teamName,
  onIncrement,
  onDecrement,
  onColorChange,
  onTeamNameChange,
  isLeft,
  isTop,
}: ScoreAreaProps) {
  const handleMainClick = (e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "BUTTON" || target.tagName === "INPUT") {
      return;
    }
    onIncrement();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onIncrement();
    }
  };

  // Apply safe area padding classes
  const safeTopClass = isTop ? "pt-safe" : "";
  const safeBottomClass = isTop ? "" : "pb-safe";

  return (
    <div
      role="button"
      tabIndex={0}
      className={`flex-1 flex flex-col cursor-pointer transition-colors duration-300 ${safeTopClass} ${safeBottomClass}`}
      style={{ backgroundColor: color }}
      onClick={handleMainClick}
      onKeyDown={handleKeyDown}
    >
      {/* Top row: color picker + team name + spacer */}
      <div className="flex items-center justify-between px-4 pt-4">
        {isLeft ? (
          <>
            <label>
              <span className="sr-only">Tria el color</span>
              <input
                type="color"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-white/30 bg-transparent"
                style={{ WebkitAppearance: "none" }}
              />
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => onTeamNameChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Nom de l'equip"
              className="bg-transparent text-white text-center text-xl font-semibold placeholder-white/30 outline-none border-none flex-1 mx-4"
            />
            <div className="w-10" />
          </>
        ) : (
          <>
            <div className="w-10" />
            <input
              type="text"
              value={teamName}
              onChange={(e) => onTeamNameChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Nom de l'equip"
              className="bg-transparent text-white text-center text-xl font-semibold placeholder-white/30 outline-none border-none flex-1 mx-4"
            />
            <label>
              <span className="sr-only">Tria el color</span>
              <input
                type="color"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-white/30 bg-transparent"
                style={{ WebkitAppearance: "none" }}
              />
            </label>
          </>
        )}
      </div>

      {/* Score - centered */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-[25vw] md:text-[20vw] font-bold text-white drop-shadow-lg select-none">
          {score}
        </span>
      </div>

      {/* Bottom row: minus button */}
      <div className={`flex px-4 pb-4 ${isLeft ? "justify-start" : "justify-end"}`}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDecrement();
          }}
          className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 flex items-center justify-center text-white text-3xl font-bold transition-colors"
          aria-label="Reduir puntuació"
        >
          −
        </button>
      </div>
    </div>
  );
}

export default function ScoreTracker() {
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [leftColor, setLeftColor] = useState("#8bc34a");
  const [rightColor, setRightColor] = useState("#2196f3");
  const [leftTeamName, setLeftTeamName] = useState("");
  const [rightTeamName, setRightTeamName] = useState("");

  // Update theme-color meta tag when top color changes
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", leftColor);
    }
  }, [leftColor]);

  // Keep screen awake
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;

    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");
        }
      } catch (err) {
        console.log("Wake Lock error:", err);
      }
    };

    requestWakeLock();

    // Re-request wake lock when page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      wakeLock?.release();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col md:flex-row"
      style={{ height: "-webkit-fill-available" }}
    >
      <ScoreArea
        score={leftScore}
        color={leftColor}
        teamName={leftTeamName}
        onIncrement={() => setLeftScore((s) => s + 1)}
        onDecrement={() => setLeftScore((s) => Math.max(0, s - 1))}
        onColorChange={setLeftColor}
        onTeamNameChange={setLeftTeamName}
        isLeft={true}
        isTop={true}
      />
      <ScoreArea
        score={rightScore}
        color={rightColor}
        teamName={rightTeamName}
        onIncrement={() => setRightScore((s) => s + 1)}
        onDecrement={() => setRightScore((s) => Math.max(0, s - 1))}
        onColorChange={setRightColor}
        onTeamNameChange={setRightTeamName}
        isLeft={false}
        isTop={false}
      />
    </div>
  );
}
