import { describeConstraint } from "../game/constraints";
import type { ConstraintResult, Language, Level } from "../game/types";
import { ui } from "../i18n";

type ConstraintCardProps = {
  level: Level;
  result: ConstraintResult;
  showStatus: boolean;
  language: Language;
};

export function ConstraintCard({ level, result, showStatus, language }: ConstraintCardProps) {
  const text = ui[language];

  return (
    <article className={`constraint-card ${showStatus ? (result.passed ? "passed" : "failed") : ""}`}>
      <span className="constraint-icon">{showStatus ? (result.passed ? text.nice : text.oops) : text.rule}</span>
      <p>{describeConstraint(level, result.constraint, language)}</p>
      {showStatus && <small>{result.message}</small>}
    </article>
  );
}
