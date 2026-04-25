import { describe, expect, it } from "vitest";
import { createEmptyArrangement, evaluateLevel } from "./constraints";
import { levels } from "./levels";
import { findSolutions } from "./solver";

describe("constraint evaluation", () => {
  it("marks level one complete when Mido is in the middle", () => {
    const level = levels[0];
    const arrangement = {
      ...createEmptyArrangement(level),
      "seat-1": "nora",
      "seat-2": "mido",
      "seat-3": "zed",
    };

    expect(evaluateLevel(level, arrangement).complete).toBe(true);
  });

  it("finds at least one solution for every bundled level", () => {
    const unsolvedLevels = levels.filter((level) => findSolutions(level).length === 0);

    expect(unsolvedLevels.map((level) => level.id)).toEqual([]);
  });
});
