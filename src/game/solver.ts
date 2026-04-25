import { createEmptyArrangement, evaluateLevel } from "./constraints";
import type { Arrangement, Level, PersonId, SeatId } from "./types";

const permute = <T,>(items: T[]): T[][] => {
  if (items.length <= 1) {
    return [items];
  }

  return items.flatMap((item, index) =>
    permute([...items.slice(0, index), ...items.slice(index + 1)]).map((rest) => [item, ...rest]),
  );
};

export const findSolutions = (level: Level): Arrangement[] => {
  const seatIds = level.seats.map((seat) => seat.id);
  const personIds = level.people.map((person) => person.id);

  return permute<PersonId>(personIds).reduce<Arrangement[]>((solutions, orderedPeople) => {
    const arrangement = seatIds.reduce<Arrangement>(
      (nextArrangement, seatId, index) => ({
        ...nextArrangement,
        [seatId]: orderedPeople[index] ?? null,
      }),
      createEmptyArrangement(level),
    );

    if (evaluateLevel(level, arrangement).complete) {
      solutions.push(arrangement);
    }

    return solutions;
  }, []);
};

export const getPersonSeatMap = (arrangement: Arrangement): Record<PersonId, SeatId> =>
  Object.entries(arrangement).reduce<Record<PersonId, SeatId>>((map, [seatId, personId]) => {
    if (personId) {
      map[personId] = seatId;
    }

    return map;
  }, {});
