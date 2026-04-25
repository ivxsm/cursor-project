import { describeConstraint } from "../game/constraints";
import type { ConstraintResult, Level } from "../game/types";

type ConstraintCardProps = {
  level: Level;
  result: ConstraintResult;
  showStatus: boolean;
};

export function ConstraintCard({ level, result, showStatus }: ConstraintCardProps) {
  return (
    <article className={`constraint-card ${showStatus ? (result.passed ? "passed" : "failed") : ""}`}>
      <span className="constraint-icon">{showStatus ? (result.passed ? "Nice" : "Oops") : "Rule"}</span>
      <p>{describeConstraint(level, result.constraint)}</p>
      {showStatus && <small>{result.message}</small>}
    </article>
  );
}
