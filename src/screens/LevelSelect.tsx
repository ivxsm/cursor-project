import { levels } from "../game/levels";
import type { Language, ProgressState } from "../game/types";
import { getLevelText, ui } from "../i18n";

type LevelSelectProps = {
  progress: ProgressState;
  language: Language;
  onToggleLanguage: () => void;
  onSelectLevel: (levelId: string) => void;
  onBack: () => void;
};

export function LevelSelect({ progress, language, onToggleLanguage, onSelectLevel, onBack }: LevelSelectProps) {
  const text = ui[language];

  return (
    <main className="screen-shell">
      <header className="screen-header">
        <div>
          <p className="eyebrow">{text.chooseChaos}</p>
          <h1>{text.levelSelect}</h1>
        </div>
        <div className="header-actions">
          <button type="button" className="language-toggle" onClick={onToggleLanguage}>
            {text.languageToggle}
          </button>
          <button type="button" className="secondary-button" onClick={onBack}>
            {text.mainMenu}
          </button>
        </div>
      </header>

      <section className="level-grid">
        {levels.map((level, index) => {
          const unlocked = progress.unlockedLevelIds.includes(level.id);
          const completed = progress.completedLevelIds.includes(level.id);
          const levelText = getLevelText(level, language);

          return (
            <button
              type="button"
              key={level.id}
              className={`level-card ${completed ? "completed" : ""}`}
              disabled={!unlocked}
              onClick={() => onSelectLevel(level.id)}
            >
              <span className="level-number">{index + 1}</span>
              <strong>{levelText.title}</strong>
              <small>{levelText.subtitle}</small>
              <span>{completed ? text.solved : unlocked ? text.difficulty(level.difficulty) : text.locked}</span>
            </button>
          );
        })}
      </section>
    </main>
  );
}
