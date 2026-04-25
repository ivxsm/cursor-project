import { PuzzleBoard } from "../components/PuzzleBoard";
import type { Language, Level } from "../game/types";
import { ui } from "../i18n";

type GameScreenProps = {
  level: Level;
  language: Language;
  onComplete: () => void;
  onBack: () => void;
};

export function GameScreen({ level, language, onComplete, onBack }: GameScreenProps) {
  const text = ui[language];

  return (
    <main className="screen-shell">
      <header className="game-topbar">
        <button type="button" className="secondary-button" onClick={onBack}>
          {text.levelSelectButton}
        </button>
        <span>{text.gameHint}</span>
      </header>
      <PuzzleBoard level={level} language={language} onComplete={onComplete} />
    </main>
  );
}
