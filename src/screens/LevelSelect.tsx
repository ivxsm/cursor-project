import { levels } from "../game/levels";
import type { ProgressState } from "../game/types";

type LevelSelectProps = {
  progress: ProgressState;
  onSelectLevel: (levelId: string) => void;
  onBack: () => void;
};

export function LevelSelect({ progress, onSelectLevel, onBack }: LevelSelectProps) {
  return (
    <main className="screen-shell">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Choose your chaos</p>
          <h1>Level Select</h1>
        </div>
        <button type="button" className="secondary-button" onClick={onBack}>
          Main menu
        </button>
      </header>

      <section className="level-grid">
        {levels.map((level, index) => {
          const unlocked = progress.unlockedLevelIds.includes(level.id);
          const completed = progress.completedLevelIds.includes(level.id);

          return (
            <button
              type="button"
              key={level.id}
              className={`level-card ${completed ? "completed" : ""}`}
              disabled={!unlocked}
              onClick={() => onSelectLevel(level.id)}
            >
              <span className="level-number">{index + 1}</span>
              <strong>{level.title}</strong>
              <small>{level.subtitle}</small>
              <span>{completed ? "Solved" : unlocked ? `Difficulty ${level.difficulty}` : "Locked"}</span>
            </button>
          );
        })}
      </section>
    </main>
  );
}
