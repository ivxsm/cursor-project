import type { Level, Person } from "./types";

const characters: Record<string, Person> = {
  mido: {
    id: "mido",
    name: "Mido",
    color: "#5ec8ff",
    emoji: "😎",
    personality: "Believes the middle seat has main-character lighting.",
    catchphrase: "The center is my stage.",
    visual: { species: "blob", accessory: "glasses", mood: "cool" },
    localized: {
      ar: {
        name: "ميدو",
        personality: "مقتنع أن المقعد الأوسط هو إضاءة البطولة.",
        catchphrase: "الوسط هو مسرحي.",
      },
    },
  },
  nora: {
    id: "nora",
    name: "Nora",
    color: "#ff9f6e",
    emoji: "🪟",
    personality: "Needs a window for dramatic music-video staring.",
    catchphrase: "I must gaze into destiny.",
    visual: { species: "cat", accessory: "window", mood: "dreamy" },
    localized: {
      ar: {
        name: "نورا",
        personality: "تحتاج نافذة للتحديق الدرامي مثل فيديو كليب.",
        catchphrase: "لازم أحدق في القدر.",
      },
    },
  },
  zed: {
    id: "zed",
    name: "Zed",
    color: "#c99cff",
    emoji: "😤",
    personality: "Runs a strict no-elbow-contact policy.",
    catchphrase: "Personal space is a lifestyle.",
    visual: { species: "robot", accessory: "steam", mood: "grumpy" },
    localized: {
      ar: {
        name: "زيد",
        personality: "عنده سياسة صارمة: ممنوع لمس الأكواع.",
        catchphrase: "المساحة الشخصية أسلوب حياة.",
      },
    },
  },
  bobo: {
    id: "bobo",
    name: "Bobo",
    color: "#ffd166",
    emoji: "🤹",
    personality: "Can only focus beside a best friend.",
    catchphrase: "Buddy system or chaos.",
    visual: { species: "duck", accessory: "juggler", mood: "bouncy" },
    localized: {
      ar: {
        name: "بوبو",
        personality: "لا يركز إلا بجانب صديق مقرّب.",
        catchphrase: "مع صديق أو فوضى.",
      },
    },
  },
  lulu: {
    id: "lulu",
    name: "Lulu",
    color: "#95e06c",
    emoji: "🎧",
    personality: "Claims the quiet zone for premium playlist listening.",
    catchphrase: "Shhh, the beat is thinking.",
    visual: { species: "ghost", accessory: "headphones", mood: "chill" },
    localized: {
      ar: {
        name: "لولو",
        personality: "تطالب بمنطقة هادئة لسماع قائمتها الفاخرة.",
        catchphrase: "ششش، الإيقاع يفكر.",
      },
    },
  },
  gigi: {
    id: "gigi",
    name: "Gigi",
    color: "#ff7aa8",
    emoji: "📸",
    personality: "Needs the group seated perfectly for photos.",
    catchphrase: "Everybody squeeze in.",
    visual: { species: "cactus", accessory: "camera", mood: "sparkly" },
    localized: {
      ar: {
        name: "جيجي",
        personality: "تحتاج أن يجلس الفريق بشكل مثالي للصورة.",
        catchphrase: "قربوا من بعض.",
      },
    },
  },
};

const row = (prefix: string, count: number, rowIndex = 0) =>
  Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    label: `${index + 1}`,
    row: rowIndex,
    column: index,
    tags: [
      index === 0 || index === count - 1 ? "window" : undefined,
      count % 2 === 1 && index === Math.floor(count / 2) ? "middle" : undefined,
      index === 1 || index === count - 2 ? "aisle" : undefined,
    ].filter(Boolean) as Level["seats"][number]["tags"],
  }));

const busRows = () => [
  ...row("front", 3, 0).map((seat) => ({ ...seat, tags: [...seat.tags, "front" as const] })),
  ...row("back", 3, 1).map((seat) => ({ ...seat, tags: [...seat.tags, "back" as const] })),
];

export const levels: Level[] = [
  {
    id: "level-1",
    title: "Middle Lover",
    subtitle: "Mido wants the seat with maximum spotlight.",
    localized: { ar: { title: "عاشق الوسط", subtitle: "ميدو يريد المقعد صاحب أقوى إضاءة." } },
    difficulty: 1,
    seats: row("seat", 3),
    people: [characters.mido, characters.nora, characters.zed],
    constraints: [{ type: "seatTag", personId: "mido", tag: "middle" }],
  },
  {
    id: "level-2",
    title: "Window Fan",
    subtitle: "Nora requires a view for her emotional staring routine.",
    localized: { ar: { title: "محبة النافذة", subtitle: "نورا تحتاج إطلالة لتحديقها العاطفي." } },
    difficulty: 1,
    seats: row("seat", 3),
    people: [characters.nora, characters.mido, characters.bobo],
    constraints: [{ type: "seatTag", personId: "nora", tag: "window" }],
  },
  {
    id: "level-3",
    title: "No Neighbors",
    subtitle: "Zed cannot risk accidental elbow conversation.",
    localized: { ar: { title: "بدون جيران", subtitle: "زيد لا يريد أي حوار مفاجئ بالأكواع." } },
    difficulty: 1,
    seats: row("seat", 3),
    people: [characters.nora, characters.zed, characters.bobo],
    constraints: [{ type: "notAdjacentTo", personId: "nora", otherPersonId: "zed" }],
  },
  {
    id: "level-4",
    title: "Best Friends",
    subtitle: "Bobo needs a hype person within whisper range.",
    localized: { ar: { title: "أفضل الأصدقاء", subtitle: "بوبو يحتاج مشجعًا قريبًا على بعد همسة." } },
    difficulty: 2,
    seats: row("seat", 4),
    people: [characters.bobo, characters.gigi, characters.zed, characters.lulu],
    constraints: [{ type: "adjacentTo", personId: "bobo", otherPersonId: "gigi" }],
  },
  {
    id: "level-5",
    title: "Left Side Energy",
    subtitle: "Gigi says the camera angle only works from the left.",
    localized: { ar: { title: "طاقة اليسار", subtitle: "جيجي تقول إن زاوية التصوير تنجح فقط من اليسار." } },
    difficulty: 2,
    seats: row("seat", 4),
    people: [characters.gigi, characters.mido, characters.nora, characters.zed],
    constraints: [{ type: "leftOf", personId: "gigi", otherPersonId: "mido" }],
  },
  {
    id: "level-6",
    title: "Drama Triangle",
    subtitle: "The middle seat is sacred, but the elbow feud continues.",
    localized: { ar: { title: "مثلث الدراما", subtitle: "المقعد الأوسط مقدس، لكن حرب الأكواع مستمرة." } },
    difficulty: 2,
    seats: row("seat", 3),
    people: [characters.mido, characters.nora, characters.zed],
    constraints: [
      { type: "seatTag", personId: "mido", tag: "middle" },
      { type: "notAdjacentTo", personId: "nora", otherPersonId: "zed" },
    ],
  },
  {
    id: "level-7",
    title: "Double Window Trouble",
    subtitle: "Everyone has opinions. The windows have filed a complaint.",
    localized: { ar: { title: "مشكلة نافذتين", subtitle: "الجميع لديه رأي. حتى النوافذ قدمت شكوى." } },
    difficulty: 3,
    seats: row("seat", 5),
    people: [characters.nora, characters.lulu, characters.mido, characters.zed, characters.bobo],
    constraints: [
      { type: "seatTag", personId: "nora", tag: "window" },
      { type: "seatTag", personId: "lulu", tag: "window" },
      { type: "notSeatTag", personId: "zed", tag: "middle" },
    ],
  },
  {
    id: "level-8",
    title: "Group Chat",
    subtitle: "The photo squad must sit as one connected blob.",
    localized: { ar: { title: "مجموعة الدردشة", subtitle: "فريق الصورة يريد الجلوس ككتلة واحدة متصلة." } },
    difficulty: 3,
    seats: row("seat", 5),
    people: [characters.gigi, characters.bobo, characters.mido, characters.lulu, characters.zed],
    constraints: [{ type: "groupTogether", personIds: ["gigi", "bobo", "mido"] }],
  },
  {
    id: "level-9",
    title: "Quiet Zone",
    subtitle: "Lulu likes the playlist, not the commentary track.",
    localized: { ar: { title: "منطقة الهدوء", subtitle: "لولو تحب قائمة التشغيل، لا التعليق الصوتي." } },
    difficulty: 4,
    seats: row("seat", 5).map((seat) => ({
      ...seat,
      tags: seat.id === "seat-1" || seat.id === "seat-5" ? [...seat.tags, "quiet"] : seat.tags,
    })),
    people: [characters.lulu, characters.gigi, characters.bobo, characters.mido, characters.zed],
    constraints: [
      { type: "seatTag", personId: "lulu", tag: "quiet" },
      { type: "separatedFromGroup", personId: "lulu", groupPersonIds: ["gigi", "bobo"] },
    ],
  },
  {
    id: "level-10",
    title: "Bus Chaos",
    subtitle: "Two rows, six passengers, zero chill.",
    localized: { ar: { title: "فوضى الباص", subtitle: "صفان، ستة ركاب، ولا ذرة هدوء." } },
    difficulty: 5,
    seats: busRows(),
    people: [characters.nora, characters.mido, characters.zed, characters.bobo, characters.lulu, characters.gigi],
    constraints: [
      { type: "seatTag", personId: "nora", tag: "window" },
      { type: "seatTag", personId: "mido", tag: "middle" },
      { type: "notAdjacentTo", personId: "zed", otherPersonId: "bobo" },
      { type: "adjacentTo", personId: "gigi", otherPersonId: "lulu" },
      { type: "rightOf", personId: "bobo", otherPersonId: "nora" },
    ],
  },
];
