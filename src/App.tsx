import { useEffect, useMemo, useState } from "react";
import { levels } from "./game/levels";
import { completeLevel, loadProgress, saveProgress } from "./game/progress";
import type { Language, ProgressState } from "./game/types";
import { getDirection, loadLanguage, saveLanguage } from "./i18n";
import { GameScreen } from "./screens/GameScreen";
import { LevelSelect } from "./screens/LevelSelect";
import { MainMenu } from "./screens/MainMenu";
import { WinScreen } from "./screens/WinScreen";

type Screen = "menu" | "levels" | "game" | "win";

function App() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [selectedLevelId, setSelectedLevelId] = useState(levels[0].id);
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const [language, setLanguage] = useState<Language>(() => loadLanguage());

  const selectedLevelIndex = levels.findIndex((level) => level.id === selectedLevelId);
  const selectedLevel = levels[selectedLevelIndex] ?? levels[0];
  const hasNextLevel = selectedLevelIndex < levels.length - 1;

  const firstPlayableLevelId = useMemo(() => {
    const unsolvedUnlocked = levels.find(
      (level) => progress.unlockedLevelIds.includes(level.id) && !progress.completedLevelIds.includes(level.id),
    );
    return unsolvedUnlocked?.id ?? progress.unlockedLevelIds.at(-1) ?? levels[0].id;
  }, [progress]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    saveLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = getDirection(language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((current) => (current === "en" ? "ar" : "en"));
  };

  const handleStart = () => {
    setSelectedLevelId(firstPlayableLevelId);
    setScreen("levels");
  };

  const handleCompleteLevel = () => {
    setProgress((current) => completeLevel(current, selectedLevel.id));
    setScreen("win");
  };

  const handleNext = () => {
    if (hasNextLevel) {
      const nextLevel = levels[selectedLevelIndex + 1];
      setSelectedLevelId(nextLevel.id);
      setScreen("game");
      return;
    }

    setScreen("levels");
  };

  if (screen === "menu") {
    return (
      <MainMenu
        onStart={handleStart}
        completedCount={progress.completedLevelIds.length}
        levelCount={levels.length}
        language={language}
        onToggleLanguage={toggleLanguage}
      />
    );
  }

  if (screen === "levels") {
    return (
      <LevelSelect
        progress={progress}
        language={language}
        onToggleLanguage={toggleLanguage}
        onSelectLevel={(levelId) => {
          setSelectedLevelId(levelId);
          setScreen("game");
        }}
        onBack={() => setScreen("menu")}
      />
    );
  }

  if (screen === "win") {
    return (
      <WinScreen
        level={selectedLevel}
        hasNextLevel={hasNextLevel}
        language={language}
        onNext={handleNext}
        onLevels={() => setScreen("levels")}
      />
    );
  }

  return <GameScreen level={selectedLevel} language={language} onComplete={handleCompleteLevel} onBack={() => setScreen("levels")} />;
}

export default App;
