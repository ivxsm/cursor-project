import { motion } from "framer-motion";
import type { Person, Seat } from "../game/types";
import { PersonToken } from "./PersonToken";

type SeatSlotProps = {
  seat: Seat;
  person?: Person;
  selectedPersonId: string | null;
  onSeatClick: (seatId: string) => void;
  onPersonClick: (personId: string) => void;
  onDropPerson: (seatId: string) => void;
  onDragPerson: (personId: string) => void;
};

export function SeatSlot({
  seat,
  person,
  selectedPersonId,
  onSeatClick,
  onPersonClick,
  onDropPerson,
  onDragPerson,
}: SeatSlotProps) {
  const isSelectedPassenger = Boolean(person && selectedPersonId === person.id);

  return (
    <motion.div
      className={`seat-slot ${person ? "occupied" : ""} ${isSelectedPassenger ? "selected-passenger" : ""}`}
      style={{ gridColumn: seat.column + 1, gridRow: seat.row + 1 }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={() => onDropPerson(seat.id)}
      onClick={() => onSeatClick(seat.id)}
      layout
      whileHover={{ scale: 1.04, y: -4 }}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onSeatClick(seat.id);
        }
      }}
      aria-label={`Seat ${seat.label}${person ? ` occupied by ${person.name}` : ""}`}
    >
      <span className="seat-back">
        <span className="seat-label">Seat {seat.label}</span>
        <span className="seat-tags">{seat.tags.join(" · ")}</span>
      </span>
      <span className="seat-cushion">
        <span className="seat-belt left" />
        <span className="seat-belt right" />
      </span>
      {person ? (
        <PersonToken
          person={person}
          selected={selectedPersonId === person.id}
          compact
          seated
          onClick={() => onPersonClick(person.id)}
          onDragStart={() => onDragPerson(person.id)}
        />
      ) : (
        <span className="empty-seat">Open seat</span>
      )}
    </motion.div>
  );
}
