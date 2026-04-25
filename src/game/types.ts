export type SeatTag =
  | "window"
  | "middle"
  | "aisle"
  | "front"
  | "back"
  | "quiet"
  | "vip";

export type SeatId = string;
export type PersonId = string;

export type CharacterVisual = {
  species: "blob" | "robot" | "cat" | "ghost" | "cactus" | "duck";
  accessory: "glasses" | "window" | "steam" | "juggler" | "headphones" | "camera";
  mood: "cool" | "dreamy" | "grumpy" | "bouncy" | "chill" | "sparkly";
};

export type Seat = {
  id: SeatId;
  label: string;
  row: number;
  column: number;
  tags: SeatTag[];
};

export type Person = {
  id: PersonId;
  name: string;
  color: string;
  emoji: string;
  personality: string;
  catchphrase: string;
  visual: CharacterVisual;
};

export type SeatTagConstraint = {
  type: "seatTag";
  personId: PersonId;
  tag: SeatTag;
};

export type NotSeatTagConstraint = {
  type: "notSeatTag";
  personId: PersonId;
  tag: SeatTag;
};

export type AdjacentToConstraint = {
  type: "adjacentTo";
  personId: PersonId;
  otherPersonId: PersonId;
};

export type NotAdjacentToConstraint = {
  type: "notAdjacentTo";
  personId: PersonId;
  otherPersonId: PersonId;
};

export type RelativeConstraint = {
  type: "leftOf" | "rightOf";
  personId: PersonId;
  otherPersonId: PersonId;
};

export type ExactSeatConstraint = {
  type: "exactSeat";
  personId: PersonId;
  seatId: SeatId;
};

export type GroupTogetherConstraint = {
  type: "groupTogether";
  personIds: PersonId[];
};

export type SeparatedFromGroupConstraint = {
  type: "separatedFromGroup";
  personId: PersonId;
  groupPersonIds: PersonId[];
};

export type Constraint =
  | SeatTagConstraint
  | NotSeatTagConstraint
  | AdjacentToConstraint
  | NotAdjacentToConstraint
  | RelativeConstraint
  | ExactSeatConstraint
  | GroupTogetherConstraint
  | SeparatedFromGroupConstraint;

export type Level = {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  seats: Seat[];
  people: Person[];
  constraints: Constraint[];
};

export type Arrangement = Record<SeatId, PersonId | null>;

export type ConstraintResult = {
  constraint: Constraint;
  passed: boolean;
  message: string;
};

export type LevelResult = {
  complete: boolean;
  results: ConstraintResult[];
};

export type ProgressState = {
  unlockedLevelIds: string[];
  completedLevelIds: string[];
};
