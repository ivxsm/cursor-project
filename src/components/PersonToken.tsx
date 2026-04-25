import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import type { Person } from "../game/types";

type PersonTokenProps = {
  person: Person;
  selected?: boolean;
  compact?: boolean;
  seated?: boolean;
  draggable?: boolean;
  onClick?: () => void;
  onDragStart?: () => void;
};

export function PersonToken({
  person,
  selected,
  compact,
  seated,
  draggable = true,
  onClick,
  onDragStart,
}: PersonTokenProps) {
  const { species, accessory, mood } = person.visual;

  return (
    <motion.button
      type="button"
      className={`person-token species-${species} mood-${mood} ${selected ? "selected" : ""} ${compact ? "compact" : ""} ${
        seated ? "seated" : ""
      }`}
      style={{ "--person-color": person.color } as CSSProperties}
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      whileHover={{ y: compact ? -6 : -10, rotate: selected ? -3 : 2 }}
      whileTap={{ scale: 0.96 }}
      layout
      aria-pressed={selected}
    >
      <span className="character-sprite" aria-hidden="true">
        <span className="character-shadow" />
        <span className="character-body">
          <span className="character-ear left" />
          <span className="character-ear right" />
          <span className="character-eye left" />
          <span className="character-eye right" />
          <span className="character-mouth" />
          <span className={`character-accessory accessory-${accessory}`} />
        </span>
      </span>
      <span className="person-info">
        <strong>{person.name}</strong>
        {!compact && <small>{person.catchphrase}</small>}
      </span>
    </motion.button>
  );
}
