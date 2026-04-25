import { motion } from "framer-motion";
import { ThreeScene } from "../components/ThreeScene";
import type { Language } from "../game/types";
import { ui } from "../i18n";

type MainMenuProps = {
  onStart: () => void;
  completedCount: number;
  levelCount: number;
  language: Language;
  onToggleLanguage: () => void;
};

export function MainMenu({ onStart, completedCount, levelCount, language, onToggleLanguage }: MainMenuProps) {
  const text = ui[language];

  return (
    <main className="hero-screen">
      <section className="hero-copy">
        <button type="button" className="language-toggle" onClick={onToggleLanguage}>
          {text.languageToggle}
        </button>
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {text.tinyBus}
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          {text.title}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          {text.intro}
        </motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.24 }}>
          <button type="button" className="primary-button" onClick={onStart}>
            {text.playLevels}
          </button>
          <span>{text.puzzlesSolved(completedCount, levelCount)}</span>
        </motion.div>
      </section>
      <ThreeScene />
    </main>
  );
}
