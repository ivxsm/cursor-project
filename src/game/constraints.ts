import type {
  Arrangement,
  Constraint,
  ConstraintResult,
  Level,
  LevelResult,
  Person,
  PersonId,
  Seat,
} from "./types";

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

const relativeMessage = (person: Person, other: Person, direction: "left" | "right", passed: boolean) =>
  passed
    ? `${person.name} is safely ${direction} of ${other.name}.`
    : `${person.name} insists on sitting ${direction} of ${other.name}.`;

export const describeConstraint = (level: Level, constraint: Constraint): string => {
  switch (constraint.type) {
    case "seatTag":
      return `${getPerson(level, constraint.personId).name} wants a ${constraint.tag} seat.`;
    case "notSeatTag":
      return `${getPerson(level, constraint.personId).name} refuses the ${constraint.tag} seat.`;
    case "adjacentTo":
      return `${getPerson(level, constraint.personId).name} wants to sit next to ${
        getPerson(level, constraint.otherPersonId).name
      }.`;
    case "notAdjacentTo":
      return `${getPerson(level, constraint.personId).name} does not want to sit next to ${
        getPerson(level, constraint.otherPersonId).name
      }.`;
    case "leftOf":
      return `${getPerson(level, constraint.personId).name} must be left of ${
        getPerson(level, constraint.otherPersonId).name
      }.`;
    case "rightOf":
      return `${getPerson(level, constraint.personId).name} must be right of ${
        getPerson(level, constraint.otherPersonId).name
      }.`;
    case "exactSeat":
      return `${getPerson(level, constraint.personId).name} has claimed seat ${constraint.seatId}.`;
    case "groupTogether":
      return `${constraint.personIds.map((id) => getPerson(level, id).name).join(", ")} want a group photo row.`;
    case "separatedFromGroup":
      return `${getPerson(level, constraint.personId).name} needs space from ${constraint.groupPersonIds
        .map((id) => getPerson(level, id).name)
        .join(", ")}.`;
  }
};

export const evaluateConstraint = (
  level: Level,
  arrangement: Arrangement,
  constraint: Constraint,
): ConstraintResult => {
  switch (constraint.type) {
    case "seatTag": {
      const person = getPerson(level, constraint.personId);
      const seat = getSeat(level, getSeatForPerson(arrangement, constraint.personId));
      const passed = Boolean(seat?.tags.includes(constraint.tag));
      return {
        constraint,
        passed,
        message: passed
          ? `${person.name} found a ${constraint.tag} seat and is glowing.`
          : `${person.name} is still hunting for a ${constraint.tag} seat.`,
      };
    }
    case "notSeatTag": {
      const person = getPerson(level, constraint.personId);
      const seat = getSeat(level, getSeatForPerson(arrangement, constraint.personId));
      const passed = Boolean(seat && !seat.tags.includes(constraint.tag));
      return {
        constraint,
        passed,
        message: passed ? `${person.name} avoided the ${constraint.tag} drama.` : `${person.name} refuses this ${constraint.tag} energy.`,
      };
    }
    case "adjacentTo": {
      const person = getPerson(level, constraint.personId);
      const other = getPerson(level, constraint.otherPersonId);
      const passed = arePeopleAdjacent(level, arrangement, constraint.personId, constraint.otherPersonId);
      return {
        constraint,
        passed,
        message: passed ? `${person.name} and ${other.name} are gossip-distance close.` : `${person.name} wants ${other.name} nearby.`,
      };
    }
    case "notAdjacentTo": {
      const person = getPerson(level, constraint.personId);
      const other = getPerson(level, constraint.otherPersonId);
      const bothSeated = getSeatForPerson(arrangement, constraint.personId) && getSeatForPerson(arrangement, constraint.otherPersonId);
      const passed = Boolean(bothSeated && !arePeopleAdjacent(level, arrangement, constraint.personId, constraint.otherPersonId));
      return {
        constraint,
        passed,
        message: passed ? `${person.name} has escaped ${other.name}'s elbow zone.` : `${person.name} says ${other.name} is too close.`,
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
        message: relativeMessage(person, other, constraint.type === "leftOf" ? "left" : "right", passed),
      };
    }
    case "exactSeat": {
      const person = getPerson(level, constraint.personId);
      const passed = getSeatForPerson(arrangement, constraint.personId) === constraint.seatId;
      return {
        constraint,
        passed,
        message: passed ? `${person.name} is in the throne they demanded.` : `${person.name} is pointing at seat ${constraint.seatId}.`,
      };
    }
    case "groupTogether": {
      const names = constraint.personIds.map((id) => getPerson(level, id).name).join(", ");
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
        message: passed ? `${names} nailed the group pose.` : `${names} want to sit in one connected row.`,
      };
    }
    case "separatedFromGroup": {
      const person = getPerson(level, constraint.personId);
      const allRelevantPeople = [constraint.personId, ...constraint.groupPersonIds];
      const allSeated = allRelevantPeople.every((id) => getSeatForPerson(arrangement, id));
      const hasNeighbor = constraint.groupPersonIds.some((id) => arePeopleAdjacent(level, arrangement, constraint.personId, id));
      return {
        constraint,
        passed: Boolean(allSeated && !hasNeighbor),
        message: hasNeighbor ? `${person.name} needs a tiny bubble of peace.` : `${person.name} has enough breathing room.`,
      };
    }
  }
};

export const evaluateLevel = (level: Level, arrangement: Arrangement): LevelResult => {
  const allPeopleSeated = level.people.every((person) => getSeatForPerson(arrangement, person.id));
  const results = level.constraints.map((constraint) => evaluateConstraint(level, arrangement, constraint));

  return {
    complete: allPeopleSeated && results.every((result) => result.passed),
    results,
  };
};
