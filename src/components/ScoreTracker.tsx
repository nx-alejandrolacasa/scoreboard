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

  // Apply safe area padding for Dynamic Island (top) and home indicator (bottom)
  const safeAreaClass = isTop ? "safe-area-top" : "safe-area-bottom";

  return (
    <div
      role="button"
      tabIndex={0}
      className={`relative flex-1 flex items-center justify-center cursor-pointer transition-colors duration-300 ${safeAreaClass}`}
      style={{ backgroundColor: color }}
      onClick={handleMainClick}
      onKeyDown={handleKeyDown}
    >
      {/* Team name - centered at top */}
      <input
        type="text"
        value={teamName}
        onChange={(e) => onTeamNameChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        placeholder="Nom de l'equip"
        className="absolute top-4 left-1/2 -translate-x-1/2 bg-transparent text-white text-center text-xl font-semibold placeholder-white/30 outline-none border-none w-48 md:w-64"
      />

      <span className="text-[25vw] md:text-[20vw] font-bold text-white drop-shadow-lg select-none">
        {score}
      </span>

      {/* Minus button - bottom corner */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDecrement();
        }}
        className={`absolute bottom-4 ${isLeft ? "left-4" : "right-4"} w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 flex items-center justify-center text-white text-3xl font-bold transition-colors`}
        aria-label="Reduir puntuació"
      >
        −
      </button>

      {/* Color picker - top corner */}
      <label className={`absolute top-4 ${isLeft ? "left-4" : "right-4"}`}>
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

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", leftColor);
    }
  }, [leftColor]);

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
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
