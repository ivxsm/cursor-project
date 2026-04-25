import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import type { Person } from "../game/types";

type PersonTokenProps = {
  person: Person;
  selected?: boolean;
  compact?: boolean;
  draggable?: boolean;
  onClick?: () => void;
  onDragStart?: () => void;
};

export function PersonToken({ person, selected, compact, draggable = true, onClick, onDragStart }: PersonTokenProps) {
  return (
    <motion.button
      type="button"
      className={`person-token ${selected ? "selected" : ""} ${compact ? "compact" : ""}`}
      style={{ "--person-color": person.color } as CSSProperties}
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      whileHover={{ y: -4, rotate: selected ? -2 : 1 }}
      whileTap={{ scale: 0.96 }}
      layout
      aria-pressed={selected}
    >
      <span className="person-emoji" aria-hidden="true">
        {person.emoji}
      </span>
      <span className="person-info">
        <strong>{person.name}</strong>
        {!compact && <small>{person.catchphrase}</small>}
      </span>
    </motion.button>
  );
}
