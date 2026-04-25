import type {
  Arrangement,
  Constraint,
  ConstraintResult,
  Language,
  Level,
  LevelResult,
  Person,
  PersonId,
  Seat,
} from "./types";
import { getPersonText, tagLabels } from "../i18n";

const getPerson = (level: Level, personId: PersonId): Person =>
  level.people.find((person) => person.id === personId) ??
  ({ id: personId, name: "Someone", catchphrase: "", color: "#999", emoji: "?" } as Person);

const getSeatForPerson = (arrangement: Arrangement, personId: PersonId): string | null => {
  const entry = Object.entries(arrangement).find(([, seatedPersonId]) => seatedPersonId === personId);
  return entry?.[0] ?? null;
};

const getSeat = (level: Level, seatId: string | null): Seat | null =>
  seatId ? level.seats.find((seat) => seat.id === seatId) ?? null : null;

const getPosition = (level: Level, arrangement: Arrangement, personId: PersonId) => {
  const seatId = getSeatForPerson(arrangement, personId);
  const seat = getSeat(level, seatId);
  return seat ? { seatId, row: seat.row, column: seat.column } : null;
};

export const createEmptyArrangement = (level: Level): Arrangement =>
  Object.fromEntries(level.seats.map((seat) => [seat.id, null]));

export const areSeatsAdjacent = (firstSeat: Seat, secondSeat: Seat) => {
  const sameRow = firstSeat.row === secondSeat.row;
  const neighboringColumns = Math.abs(firstSeat.column - secondSeat.column) === 1;
  return sameRow && neighboringColumns;
};

export const arePeopleAdjacent = (level: Level, arrangement: Arrangement, first: PersonId, second: PersonId) => {
  const firstSeat = getSeat(level, getSeatForPerson(arrangement, first));
  const secondSeat = getSeat(level, getSeatForPerson(arrangement, second));
  return Boolean(firstSeat && secondSeat && areSeatsAdjacent(firstSeat, secondSeat));
};

const relativeMessage = (person: Person, other: Person, direction: "left" | "right", passed: boolean, language: Language) => {
  const personText = getPersonText(person, language);
  const otherText = getPersonText(other, language);

  if (language === "ar") {
    const directionText = direction === "left" ? "يسار" : "يمين";
    return passed
      ? `${personText.name} يجلس بأمان ${directionText} ${otherText.name}.`
      : `${personText.name} يصر أن يجلس ${directionText} ${otherText.name}.`;
  }

  return passed
    ? `${personText.name} is safely ${direction} of ${otherText.name}.`
    : `${personText.name} insists on sitting ${direction} of ${otherText.name}.`;
};

export const describeConstraint = (level: Level, constraint: Constraint, language: Language = "en"): string => {
  const personName = (personId: PersonId) => getPersonText(getPerson(level, personId), language).name;
  const tagName = (tag: Seat["tags"][number]) => tagLabels[language][tag];

  switch (constraint.type) {
    case "seatTag":
      return language === "ar"
        ? `${personName(constraint.personId)} يريد مقعد ${tagName(constraint.tag)}.`
        : `${personName(constraint.personId)} wants a ${tagName(constraint.tag)} seat.`;
    case "notSeatTag":
      return language === "ar"
        ? `${personName(constraint.personId)} يرفض مقعد ${tagName(constraint.tag)}.`
        : `${personName(constraint.personId)} refuses the ${tagName(constraint.tag)} seat.`;
    case "adjacentTo":
      return language === "ar"
        ? `${personName(constraint.personId)} يريد الجلوس بجانب ${personName(constraint.otherPersonId)}.`
        : `${personName(constraint.personId)} wants to sit next to ${personName(constraint.otherPersonId)}.`;
    case "notAdjacentTo":
      return language === "ar"
        ? `${personName(constraint.personId)} لا يريد الجلوس بجانب ${personName(constraint.otherPersonId)}.`
        : `${personName(constraint.personId)} does not want to sit next to ${personName(constraint.otherPersonId)}.`;
    case "leftOf":
      return language === "ar"
        ? `${personName(constraint.personId)} يجب أن يكون يسار ${personName(constraint.otherPersonId)}.`
        : `${personName(constraint.personId)} must be left of ${personName(constraint.otherPersonId)}.`;
    case "rightOf":
      return language === "ar"
        ? `${personName(constraint.personId)} يجب أن يكون يمين ${personName(constraint.otherPersonId)}.`
        : `${personName(constraint.personId)} must be right of ${personName(constraint.otherPersonId)}.`;
    case "exactSeat":
      return language === "ar"
        ? `${personName(constraint.personId)} حجز المقعد ${constraint.seatId}.`
        : `${personName(constraint.personId)} has claimed seat ${constraint.seatId}.`;
    case "groupTogether":
      return language === "ar"
        ? `${constraint.personIds.map(personName).join("، ")} يريدون صفًا لصورة جماعية.`
        : `${constraint.personIds.map(personName).join(", ")} want a group photo row.`;
    case "separatedFromGroup":
      return language === "ar"
        ? `${personName(constraint.personId)} يحتاج مساحة بعيدًا عن ${constraint.groupPersonIds.map(personName).join("، ")}.`
        : `${personName(constraint.personId)} needs space from ${constraint.groupPersonIds.map(personName).join(", ")}.`;
  }
};

export const evaluateConstraint = (
  level: Level,
  arrangement: Arrangement,
  constraint: Constraint,
  language: Language = "en",
): ConstraintResult => {
  switch (constraint.type) {
    case "seatTag": {
      const person = getPerson(level, constraint.personId);
      const personText = getPersonText(person, language);
      const tagText = tagLabels[language][constraint.tag];
      const seat = getSeat(level, getSeatForPerson(arrangement, constraint.personId));
      const passed = Boolean(seat?.tags.includes(constraint.tag));
      return {
        constraint,
        passed,
        message:
          language === "ar"
            ? passed
              ? `${personText.name} وجد مقعد ${tagText} ويتوهج.`
              : `${personText.name} ما زال يبحث عن مقعد ${tagText}.`
            : passed
              ? `${personText.name} found a ${tagText} seat and is glowing.`
              : `${personText.name} is still hunting for a ${tagText} seat.`,
      };
    }
    case "notSeatTag": {
      const person = getPerson(level, constraint.personId);
      const personText = getPersonText(person, language);
      const tagText = tagLabels[language][constraint.tag];
      const seat = getSeat(level, getSeatForPerson(arrangement, constraint.personId));
      const passed = Boolean(seat && !seat.tags.includes(constraint.tag));
      return {
        constraint,
        passed,
        message:
          language === "ar"
            ? passed
              ? `${personText.name} تجنب دراما ${tagText}.`
              : `${personText.name} يرفض طاقة ${tagText}.`
            : passed
              ? `${personText.name} avoided the ${tagText} drama.`
              : `${personText.name} refuses this ${tagText} energy.`,
      };
    }
    case "adjacentTo": {
      const person = getPerson(level, constraint.personId);
      const other = getPerson(level, constraint.otherPersonId);
      const personText = getPersonText(person, language);
      const otherText = getPersonText(other, language);
      const passed = arePeopleAdjacent(level, arrangement, constraint.personId, constraint.otherPersonId);
      return {
        constraint,
        passed,
        message:
          language === "ar"
            ? passed
              ? `${personText.name} و${otherText.name} قريبان لمسافة الهمس.`
              : `${personText.name} يريد ${otherText.name} قريبًا.`
            : passed
              ? `${personText.name} and ${otherText.name} are gossip-distance close.`
              : `${personText.name} wants ${otherText.name} nearby.`,
      };
    }
    case "notAdjacentTo": {
      const person = getPerson(level, constraint.personId);
      const other = getPerson(level, constraint.otherPersonId);
      const personText = getPersonText(person, language);
      const otherText = getPersonText(other, language);
      const bothSeated = getSeatForPerson(arrangement, constraint.personId) && getSeatForPerson(arrangement, constraint.otherPersonId);
      const passed = Boolean(bothSeated && !arePeopleAdjacent(level, arrangement, constraint.personId, constraint.otherPersonId));
      return {
        constraint,
        passed,
        message:
          language === "ar"
            ? passed
              ? `${personText.name} هرب من منطقة أكواع ${otherText.name}.`
              : `${personText.name} يقول إن ${otherText.name} قريب جدًا.`
            : passed
              ? `${personText.name} has escaped ${otherText.name}'s elbow zone.`
              : `${personText.name} says ${otherText.name} is too close.`,
      };
    }
    case "leftOf":
    case "rightOf": {
      const person = getPerson(level, constraint.personId);
      const other = getPerson(level, constraint.otherPersonId);
      const position = getPosition(level, arrangement, constraint.personId);
      const otherPosition = getPosition(level, arrangement, constraint.otherPersonId);
      const passed = Boolean(
        position &&
          otherPosition &&
          position.row === otherPosition.row &&
          (constraint.type === "leftOf" ? position.column < otherPosition.column : position.column > otherPosition.column),
      );
      return {
        constraint,
        passed,
        message: relativeMessage(person, other, constraint.type === "leftOf" ? "left" : "right", passed, language),
      };
    }
    case "exactSeat": {
      const person = getPerson(level, constraint.personId);
      const personText = getPersonText(person, language);
      const passed = getSeatForPerson(arrangement, constraint.personId) === constraint.seatId;
      return {
        constraint,
        passed,
        message:
          language === "ar"
            ? passed
              ? `${personText.name} جلس على عرشه المطلوب.`
              : `${personText.name} يشير إلى المقعد ${constraint.seatId}.`
            : passed
              ? `${personText.name} is in the throne they demanded.`
              : `${personText.name} is pointing at seat ${constraint.seatId}.`,
      };
    }
    case "groupTogether": {
      const names = constraint.personIds.map((id) => getPersonText(getPerson(level, id), language).name).join(language === "ar" ? "، " : ", ");
      const positions = constraint.personIds.map((id) => getPosition(level, arrangement, id));
      const allSeated = positions.every(Boolean);
      const rows = new Set(positions.map((position) => position?.row));
      const sortedColumns = positions
        .map((position) => position?.column)
        .filter((column): column is number => typeof column === "number")
        .sort((a, b) => a - b);
      const consecutive = sortedColumns.every((column, index) => index === 0 || column - sortedColumns[index - 1] === 1);
      const passed = allSeated && rows.size === 1 && consecutive;
      return {
        constraint,
        passed,
        message:
          language === "ar"
            ? passed
              ? `${names} أتقنوا وضعية الصورة.`
              : `${names} يريدون الجلوس في صف متصل.`
            : passed
              ? `${names} nailed the group pose.`
              : `${names} want to sit in one connected row.`,
      };
    }
    case "separatedFromGroup": {
      const person = getPerson(level, constraint.personId);
      const personText = getPersonText(person, language);
      const allRelevantPeople = [constraint.personId, ...constraint.groupPersonIds];
      const allSeated = allRelevantPeople.every((id) => getSeatForPerson(arrangement, id));
      const hasNeighbor = constraint.groupPersonIds.some((id) => arePeopleAdjacent(level, arrangement, constraint.personId, id));
      return {
        constraint,
        passed: Boolean(allSeated && !hasNeighbor),
        message:
          language === "ar"
            ? hasNeighbor
              ? `${personText.name} يحتاج فقاعة صغيرة من الهدوء.`
              : `${personText.name} لديه مساحة كافية للتنفس.`
            : hasNeighbor
              ? `${personText.name} needs a tiny bubble of peace.`
              : `${personText.name} has enough breathing room.`,
      };
    }
  }
};

export const evaluateLevel = (level: Level, arrangement: Arrangement, language: Language = "en"): LevelResult => {
  const allPeopleSeated = level.people.every((person) => getSeatForPerson(arrangement, person.id));
  const results = level.constraints.map((constraint) => evaluateConstraint(level, arrangement, constraint, language));

  return {
    complete: allPeopleSeated && results.every((result) => result.passed),
    results,
  };
};
