import type { Language, Level, Person, SeatTag } from "./game/types";

const LANGUAGE_STORAGE_KEY = "seat-shenanigans-language";

export const languages: Language[] = ["en", "ar"];

export const getDirection = (language: Language) => (language === "ar" ? "rtl" : "ltr");

export const loadLanguage = (): Language => {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === "ar" || stored === "en" ? stored : "en";
  } catch {
    return "en";
  }
};

export const saveLanguage = (language: Language) => {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
};

export const getLevelText = (level: Level, language: Language) => level.localized?.[language] ?? level;

export const getPersonText = (person: Person, language: Language) => person.localized?.[language] ?? person;

export const tagLabels: Record<Language, Record<SeatTag, string>> = {
  en: {
    window: "window",
    middle: "middle",
    aisle: "aisle",
    front: "front",
    back: "back",
    quiet: "quiet",
    vip: "vip",
  },
  ar: {
    window: "نافذة",
    middle: "وسط",
    aisle: "ممر",
    front: "أمام",
    back: "خلف",
    quiet: "هادئ",
    vip: "مميز",
  },
};

export const ui = {
  en: {
    languageToggle: "العربية",
    tinyBus: "tiny bus, huge opinions",
    title: "Seat Shenanigans",
    intro: "Arrange picky passengers before the bus gives up and becomes a sandwich truck.",
    playLevels: "Play levels",
    puzzlesSolved: (completed: number, total: number) => `${completed}/${total} puzzles solved`,
    chooseChaos: "Choose your chaos",
    levelSelect: "Level Select",
    mainMenu: "Main menu",
    solved: "Solved",
    locked: "Locked",
    difficulty: (difficulty: number) => `Difficulty ${difficulty}`,
    difficultyFull: (difficulty: number) => `Difficulty ${difficulty}/5`,
    gameHint: "Seat everyone without causing a tiny public argument.",
    levelSelectButton: "Level select",
    resetChaos: "Reset chaos",
    checkSeating: "Check seating",
    route: "Route LOL-404",
    aisle: "aisle",
    castingCall: "Casting call",
    waitingCreatures: "Waiting creatures",
    missionCards: "Mission cards",
    passengerDemands: "Passenger demands",
    openSeat: "Open seat",
    rule: "Rule",
    nice: "Nice",
    oops: "Oops",
    defaultFeedback: "Grab a creature, drop them in the bus, then check the seating.",
    selectedFeedback: (name: string, catchphrase: string) => `${name}: ${catchphrase}`,
    perfectSeating: "Perfect seating!",
    busApplause: "The bus applauds politely.",
    winBody: "The passengers are seated. No one is happy, but everyone is correctly unhappy.",
    nextLevel: "Next level",
    celebrateAgain: "Celebrate again",
  },
  ar: {
    languageToggle: "English",
    tinyBus: "باص صغير، آراء كبيرة",
    title: "رتـــــب  ",
    intro: "رتب الركاب المزاجيين.",
    playLevels: "ابدأ اللعب",
    puzzlesSolved: (completed: number, total: number) => `${completed}/${total} ألغاز محلولة`,
    chooseChaos: "-",
    levelSelect: "اختيار المرحلة",
    mainMenu: "القائمة الرئيسية",
    solved: "محلولة",
    locked: "مقفلة",
    difficulty: (difficulty: number) => `الصعوبة ${difficulty}`,
    difficultyFull: (difficulty: number) => `الصعوبة ${difficulty}/5`,
    gameHint: "رتب الجميع بدون ما يصير نقاش عام صغير.",
    levelSelectButton: "اختيـار المرحلـة",
    resetChaos: "إعادة الفوضى",
    checkSeating: "تحقق من المقاعد",
    route: "باص الرياض",
    aisle: "الممر",
    castingCall: "طابور الركاب",
    waitingCreatures: "الكائنات المنتظرة",
    missionCards: "بطاقات المهمة",
    passengerDemands: "طلبات الركاب",
    openSeat: "مقعد فارغ",
    rule: "قاعدة",
    nice: "تمام",
    oops: "انتبه",
    defaultFeedback: "اسحب كائنًا وضعه في الباص ثم تحقق من المقاعد.",
    selectedFeedback: (name: string, catchphrase: string) => `${name}: ${catchphrase}`,
    perfectSeating: "ترتيب ممتاز!",
    busApplause: "الباص يصفق بأدب.",
    winBody: "جلس الركاب في أماكنهم. لا أحد سعيد، لكن الجميع غير سعيد بالطريقة الصحيحة.",
    nextLevel: "المرحلة التالية",
    celebrateAgain: "احتفل مرة أخرى",
  },
} satisfies Record<Language, Record<string, string | ((...args: never[]) => string)>>;
