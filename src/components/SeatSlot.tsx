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
  return (
    <motion.div
      className={`seat-slot ${person ? "occupied" : ""}`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={() => onDropPerson(seat.id)}
      onClick={() => onSeatClick(seat.id)}
      layout
      whileHover={{ scale: 1.02 }}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onSeatClick(seat.id);
        }
      }}
      aria-label={`Seat ${seat.label}${person ? ` occupied by ${person.name}` : ""}`}
    >
      <span className="seat-label">Seat {seat.label}</span>
      <span className="seat-tags">{seat.tags.join(" · ")}</span>
      {person ? (
        <PersonToken
          person={person}
          selected={selectedPersonId === person.id}
          compact
          onClick={() => onPersonClick(person.id)}
          onDragStart={() => onDragPerson(person.id)}
        />
      ) : (
        <span className="empty-seat">Drop a passenger</span>
      )}
    </motion.div>
  );
}
