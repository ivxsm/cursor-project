import { motion } from "framer-motion";
import type { Level } from "../game/types";

type WinScreenProps = {
  level: Level;
  hasNextLevel: boolean;
  onNext: () => void;
  onLevels: () => void;
};

export function WinScreen({ level, hasNextLevel, onNext, onLevels }: WinScreenProps) {
  return (
    <main className="win-screen">
      <motion.section
        className="win-card"
        initial={{ opacity: 0, y: 30, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
      >
        <p className="eyebrow">Solved</p>
        <h1>{level.title}</h1>
        <p>The passengers are seated. No one is happy, but everyone is correctly unhappy.</p>
        <div className="board-actions">
          <button type="button" className="secondary-button" onClick={onLevels}>
            Level select
          </button>
          <button type="button" className="primary-button" onClick={onNext}>
            {hasNextLevel ? "Next level" : "Celebrate again"}
          </button>
        </div>
      </motion.section>
    </main>
  );
}
