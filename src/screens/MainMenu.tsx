import { motion } from "framer-motion";
import { ThreeScene } from "../components/ThreeScene";

type MainMenuProps = {
  onStart: () => void;
  completedCount: number;
  levelCount: number;
};

export function MainMenu({ onStart, completedCount, levelCount }: MainMenuProps) {
  return (
    <main className="hero-screen">
      <section className="hero-copy">
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          tiny bus, huge opinions
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          Seat Shenanigans
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          Arrange picky passengers before the bus gives up and becomes a sandwich truck.
        </motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.24 }}>
          <button type="button" className="primary-button" onClick={onStart}>
            Play levels
          </button>
          <span>
            {completedCount}/{levelCount} puzzles solved
          </span>
        </motion.div>
      </section>
      <ThreeScene />
    </main>
  );
}
