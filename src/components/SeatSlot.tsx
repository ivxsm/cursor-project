import { motion } from "framer-motion";
import type { Language, Person, Seat } from "../game/types";
import { getPersonText, tagLabels, ui } from "../i18n";
import { PersonToken } from "./PersonToken";

type SeatSlotProps = {
  seat: Seat;
  person?: Person;
  language: Language;
  selectedPersonId: string | null;
  onSeatClick: (seatId: string) => void;
  onPersonClick: (personId: string) => void;
  onDropPerson: (seatId: string) => void;
  onDragPerson: (personId: string) => void;
};

export function SeatSlot({
  seat,
  person,
  language,
  selectedPersonId,
  onSeatClick,
  onPersonClick,
  onDropPerson,
  onDragPerson,
}: SeatSlotProps) {
  const isSelectedPassenger = Boolean(person && selectedPersonId === person.id);
  const personText = person ? getPersonText(person, language) : null;
  const text = ui[language];

  return (
    <motion.div
      className={`seat-slot ${person ? "occupied" : ""} ${isSelectedPassenger ? "selected-passenger" : ""}`}
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
      aria-label={`Seat ${seat.label}${personText ? ` occupied by ${personText.name}` : ""}`}
    >
      <span className="seat-frame">
        <span className="seat-headrest" />
        <span className="seat-back">
          <span className="seat-label">{seat.label}</span>
          <span className="seat-tags">{seat.tags.map((tag) => tagLabels[language][tag]).join(" · ")}</span>
        </span>
        <span className="seat-arm left" />
        <span className="seat-arm right" />
        <span className="seat-cushion">
          <span className="seat-belt left" />
          <span className="seat-belt right" />
        </span>
        <span className="seat-base">
          <span />
          <span />
        </span>
      </span>
      {person ? (
        <PersonToken
          person={person}
          language={language}
          selected={selectedPersonId === person.id}
          compact
          seated
          onClick={() => onPersonClick(person.id)}
          onDragStart={() => onDragPerson(person.id)}
        />
      ) : (
        <span className="empty-seat">{text.openSeat}</span>
      )}
    </motion.div>
  );
}
