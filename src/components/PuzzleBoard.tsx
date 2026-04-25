import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { createEmptyArrangement, evaluateLevel } from "../game/constraints";
import type { Arrangement, Level, PersonId, SeatId } from "../game/types";
import { ConstraintCard } from "./ConstraintCard";
import { FeedbackBubble } from "./FeedbackBubble";
import { PersonToken } from "./PersonToken";
import { SeatSlot } from "./SeatSlot";
import { ThreeScene } from "./ThreeScene";

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
  const selectedPerson = level.people.find((person) => person.id === selectedPersonId);
  const rowCount = Math.max(...level.seats.map((seat) => seat.row)) + 1;
  const columnCount = Math.max(...level.seats.map((seat) => seat.column)) + 1;
  const visualColumnCount = Math.min(columnCount, 3);

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

        <div className={`bus-stage ${showResults && !evaluation.complete ? "needs-attention" : ""}`}>
          <div className="bus-atmosphere">
            <ThreeScene compact />
          </div>
          <div className="bus-shell bus-cabin">
            <div className="bus-front">
              <span className="dashboard-light red" />
              <div className="windshield">
                <span className="bus-route">Route LOL-404</span>
                <span className="road-reflection" />
              </div>
              <div className="driver-corner">
                <span className="steering-wheel" />
                <span className="dashboard-light green" />
              </div>
            </div>
            <div className="bus-rail top">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="bus-windows side-windows">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div
              className={`seat-grid rows-${rowCount}`}
              style={
                {
                  "--seat-columns": visualColumnCount,
                  "--seat-rows": rowCount,
                } as CSSProperties
              }
            >
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
            <div className="bus-aisle cabin-aisle">
              <span>aisle</span>
            </div>
            <div className="bus-floor-lines" />
            <div className="bus-wheels cabin-wheels">
              <span />
              <span />
            </div>
          </div>
        </div>

        <div className="bench character-dock">
          <div className="dock-heading">
            <div>
              <p className="eyebrow">Casting call</p>
              <h3>Waiting creatures</h3>
            </div>
            {selectedPerson && <span className="selected-callout">{selectedPerson.catchphrase}</span>}
          </div>
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
        <p className="eyebrow">Mission cards</p>
        <h3>Passenger demands</h3>
        <div className="constraint-list">
          {evaluation.results.map((result, index) => (
            <ConstraintCard key={`${result.constraint.type}-${index}`} level={level} result={result} showStatus={showResults} />
          ))}
        </div>
        <div className="speech-wrap">
          {selectedPerson && (
            <PersonToken person={selectedPerson} compact seated draggable={false} selected={Boolean(selectedPersonId)} />
          )}
          <FeedbackBubble
            message={
              showResults
                ? failingMessage
                : selectedPerson
                  ? `${selectedPerson.name}: ${selectedPerson.catchphrase}`
                  : "Grab a creature, drop them in the bus, then check the seating."
            }
          />
        </div>
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
