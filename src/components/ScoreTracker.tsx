import { useState } from "react";

interface ScoreAreaProps {
  score: number;
  color: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onColorChange: (color: string) => void;
  isLeft: boolean;
}

function ScoreArea({
  score,
  color,
  onIncrement,
  onDecrement,
  onColorChange,
  isLeft,
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

  return (
    <div
      role="button"
      tabIndex={0}
      className="relative flex-1 flex items-center justify-center cursor-pointer transition-colors duration-300"
      style={{ backgroundColor: color }}
      onClick={handleMainClick}
      onKeyDown={handleKeyDown}
    >
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
        aria-label="Decrease score"
      >
        −
      </button>

      {/* Color picker - top corner */}
      <label className={`absolute top-4 ${isLeft ? "left-4" : "right-4"}`}>
        <span className="sr-only">Choose color</span>
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
  const [leftColor, setLeftColor] = useState("#3b82f6");
  const [rightColor, setRightColor] = useState("#ef4444");

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      <ScoreArea
        score={leftScore}
        color={leftColor}
        onIncrement={() => setLeftScore((s) => s + 1)}
        onDecrement={() => setLeftScore((s) => Math.max(0, s - 1))}
        onColorChange={setLeftColor}
        isLeft={true}
      />
      <ScoreArea
        score={rightScore}
        color={rightColor}
        onIncrement={() => setRightScore((s) => s + 1)}
        onDecrement={() => setRightScore((s) => Math.max(0, s - 1))}
        onColorChange={setRightColor}
        isLeft={false}
      />
    </div>
  );
}
