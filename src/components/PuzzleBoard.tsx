import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { createEmptyArrangement, evaluateLevel } from "../game/constraints";
import type { Arrangement, Level, PersonId, SeatId } from "../game/types";
import { ConstraintCard } from "./ConstraintCard";
import { FeedbackBubble } from "./FeedbackBubble";
import { PersonToken } from "./PersonToken";
import { SeatSlot } from "./SeatSlot";

type PuzzleBoardProps = {
  level: Level;
  onComplete: () => void;
};

const getArrangementKey = (level: Level) => level.id;

export function PuzzleBoard({ level, onComplete }: PuzzleBoardProps) {
  const [arrangements, setArrangements] = useState<Record<string, Arrangement>>({});
  const [selectedPersonId, setSelectedPersonId] = useState<PersonId | null>(null);
  const [showResults, setShowResults] = useState(false);

  const arrangement = arrangements[getArrangementKey(level)] ?? createEmptyArrangement(level);
  const evaluation = useMemo(() => evaluateLevel(level, arrangement), [arrangement, level]);
  const seatedPersonIds = new Set(Object.values(arrangement).filter(Boolean));
  const unseatedPeople = level.people.filter((person) => !seatedPersonIds.has(person.id));
  const failingMessage = evaluation.results.find((result) => !result.passed)?.message ?? "Everyone is secretly delighted.";

  const updateArrangement = (updater: (current: Arrangement) => Arrangement) => {
    setArrangements((current) => ({
      ...current,
      [getArrangementKey(level)]: updater(current[getArrangementKey(level)] ?? createEmptyArrangement(level)),
    }));
  };

  const findSeatForPerson = (personId: PersonId): SeatId | null => {
    const entry = Object.entries(arrangement).find(([, occupant]) => occupant === personId);
    return entry?.[0] ?? null;
  };

  const placePerson = (personId: PersonId, seatId: SeatId) => {
    updateArrangement((current) => {
      const previousSeatId = Object.entries(current).find(([, occupant]) => occupant === personId)?.[0];
      const displacedPersonId = current[seatId];
      const next = { ...current, [seatId]: personId };

      if (previousSeatId && previousSeatId !== seatId) {
        next[previousSeatId] = displacedPersonId ?? null;
      }

      return next;
    });
    setSelectedPersonId(null);
    setShowResults(false);
  };

  const removePerson = (personId: PersonId) => {
    updateArrangement((current) => {
      const seatId = Object.entries(current).find(([, occupant]) => occupant === personId)?.[0];
      return seatId ? { ...current, [seatId]: null } : current;
    });
    setSelectedPersonId(personId);
    setShowResults(false);
  };

  const handleSeatClick = (seatId: SeatId) => {
    if (selectedPersonId) {
      placePerson(selectedPersonId, seatId);
    }
  };

  const handlePersonClick = (personId: PersonId) => {
    if (selectedPersonId === personId) {
      setSelectedPersonId(null);
      return;
    }

    setSelectedPersonId(personId);
  };

  const resetLevel = () => {
    updateArrangement(() => createEmptyArrangement(level));
    setSelectedPersonId(null);
    setShowResults(false);
  };

  const checkLevel = () => {
    setShowResults(true);
    if (evaluation.complete) {
      window.setTimeout(onComplete, 600);
    }
  };

  return (
    <section className="game-layout">
      <div className="board-panel">
        <div className="board-header">
          <div>
            <p className="eyebrow">Level {level.id.replace("level-", "")}</p>
            <h2>{level.title}</h2>
            <p>{level.subtitle}</p>
          </div>
          <span className="difficulty">Difficulty {level.difficulty}/5</span>
        </div>

        <div className={`seat-grid rows-${Math.max(...level.seats.map((seat) => seat.row)) + 1}`}>
          {level.seats.map((seat) => {
            const personId = arrangement[seat.id];
            const person = level.people.find((candidate) => candidate.id === personId);

            return (
              <SeatSlot
                key={seat.id}
                seat={seat}
                person={person}
                selectedPersonId={selectedPersonId}
                onSeatClick={handleSeatClick}
                onPersonClick={(personId) => {
                  if (findSeatForPerson(personId)) {
                    removePerson(personId);
                  } else {
                    handlePersonClick(personId);
                  }
                }}
                onDropPerson={(seatId) => selectedPersonId && placePerson(selectedPersonId, seatId)}
                onDragPerson={setSelectedPersonId}
              />
            );
          })}
        </div>

        <div className="bench">
          <h3>Waiting Line</h3>
          <div className="bench-list">
            <AnimatePresence>
              {unseatedPeople.map((person) => (
                <PersonToken
                  key={person.id}
                  person={person}
                  selected={selectedPersonId === person.id}
                  onClick={() => handlePersonClick(person.id)}
                  onDragStart={() => setSelectedPersonId(person.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="board-actions">
          <button type="button" className="secondary-button" onClick={resetLevel}>
            Reset chaos
          </button>
          <button type="button" className="primary-button" onClick={checkLevel}>
            Check seating
          </button>
        </div>
      </div>

      <aside className="rules-panel">
        <h3>Passenger demands</h3>
        <div className="constraint-list">
          {evaluation.results.map((result, index) => (
            <ConstraintCard key={`${result.constraint.type}-${index}`} level={level} result={result} showStatus={showResults} />
          ))}
        </div>
        <FeedbackBubble message={showResults ? failingMessage : selectedPersonId ? "Pick a seat for the selected passenger." : "Arrange the passengers, then check the seating."} />
      </aside>

      {showResults && evaluation.complete && (
        <motion.div className="win-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }}>
            <strong>Perfect seating!</strong>
            <span>The bus applauds politely.</span>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
