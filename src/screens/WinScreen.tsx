import { motion } from "framer-motion";
import type { Language, Level } from "../game/types";
import { getLevelText, ui } from "../i18n";

type WinScreenProps = {
  level: Level;
  hasNextLevel: boolean;
  language: Language;
  onNext: () => void;
  onLevels: () => void;
};

export function WinScreen({ level, hasNextLevel, language, onNext, onLevels }: WinScreenProps) {
  const text = ui[language];
  const levelText = getLevelText(level, language);

  return (
    <main className="win-screen">
      <motion.section
        className="win-card"
        initial={{ opacity: 0, y: 30, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
      >
        <p className="eyebrow">{text.solved}</p>
        <h1>{levelText.title}</h1>
        <p>{text.winBody}</p>
        <div className="board-actions">
          <button type="button" className="secondary-button" onClick={onLevels}>
            {text.levelSelectButton}
          </button>
          <button type="button" className="primary-button" onClick={onNext}>
            {hasNextLevel ? text.nextLevel : text.celebrateAgain}
          </button>
        </div>
      </motion.section>
    </main>
  );
}
