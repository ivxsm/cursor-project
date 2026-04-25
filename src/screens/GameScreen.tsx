import { PuzzleBoard } from "../components/PuzzleBoard";
import type { Level } from "../game/types";

type GameScreenProps = {
  level: Level;
  onComplete: () => void;
  onBack: () => void;
};

export function GameScreen({ level, onComplete, onBack }: GameScreenProps) {
  return (
    <main className="screen-shell">
      <header className="game-topbar">
        <button type="button" className="secondary-button" onClick={onBack}>
          Level select
        </button>
        <span>Seat everyone without causing a tiny public argument.</span>
      </header>
      <PuzzleBoard level={level} onComplete={onComplete} />
    </main>
  );
}
