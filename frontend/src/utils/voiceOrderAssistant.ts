export type SupportedLanguage = "english" | "hindi" | "kannada" | "hinglish";

export interface StructuredOrder {
  itemName: string | null;
  quantity: number | null;
  specialInstructions: string | null;
}

export interface VoiceAssistantResult {
  language: SupportedLanguage;
  order: StructuredOrder;
  message: string;
  needsFollowUp: boolean;
  canConfirm: boolean;
}

const NUMBER_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  ek: 1,
  do: 2,
  teen: 3,
  char: 4,
  chaar: 4,
  paanch: 5,
  panch: 5,
  chhe: 6,
  saat: 7,
  aath: 8,
  nau: 9,
  dus: 10,
  ondhu: 1,
  ondu: 1,
  eradu: 2,
  mooru: 3,
  naalku: 4,
  aidu: 5,
  aaru: 6,
  elu: 7,
  entu: 8,
  ombattu: 9,
  hattu: 10,
};

const HINGLISH_HINTS = [
  "mujhe",
  "chahiye",
  "chahiye",
  "please",
  "kardo",
  "kar do",
  "bina",
  "zyada",
  "kam",
  "thali",
  "dal",
  "chawal",
];

const KANNADA_ROMAN_HINTS = ["nanage", "kodi", "beku", "beka", "jasti", "swalpa", "illa", "oota"];
const ENGLISH_HINTS = ["please", "one", "two", "order", "add", "meal", "thali", "dal", "rice", "chawal"];

const CLEANUP_WORDS = [
  "mujhe",
  "please",
  "chahiye",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "ek",
  "do",
  "teen",
  "char",
  "chaar",
  "paanch",
  "panch",
  "chhe",
  "saat",
  "aath",
  "nau",
  "dus",
  "ondhu",
  "ondu",
  "eradu",
  "mooru",
  "naalku",
  "aidu",
  "aaru",
  "elu",
  "entu",
  "ombattu",
  "hattu",
  "i",
  "want",
  "need",
  "to",
  "order",
  "nanage",
  "kodi",
  "beku",
];

const ORDER_SEPARATORS = [",", " with ", " without ", " but ", " and ", " no ", " bina ", " kam ", " zyada "];

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

const hasDevanagari = (input: string) => /[\u0900-\u097F]/.test(input);
const hasKannadaScript = (input: string) => /[\u0C80-\u0CFF]/.test(input);

const countHints = (text: string, hints: string[]) =>
  hints.reduce((count, hint) => (text.includes(hint) ? count + 1 : count), 0);

export const detectLanguage = (input: string): SupportedLanguage => {
  if (hasKannadaScript(input)) {
    return "kannada";
  }
  if (hasDevanagari(input)) {
    return "hindi";
  }

  const text = normalize(input);
  const knScore = countHints(text, KANNADA_ROMAN_HINTS);
  const hiScore = countHints(text, HINGLISH_HINTS);
  const enScore = countHints(text, ENGLISH_HINTS);

  if (knScore >= 1 && knScore >= hiScore) {
    return "kannada";
  }
  if (hiScore >= 1 && enScore >= 1) {
    return "hinglish";
  }
  if (hiScore >= 1) {
    return "hinglish";
  }
  return "english";
};

const parseQuantity = (input: string): number | null => {
  const digitMatch = input.match(/\b(\d{1,2})\b/);
  if (digitMatch) {
    const parsed = Number.parseInt(digitMatch[1], 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  const words = normalize(input).split(" ");
  for (const word of words) {
    if (NUMBER_WORDS[word] !== undefined) {
      return NUMBER_WORDS[word];
    }
  }
  return null;
};

const extractSpecialInstructions = (input: string): string | null => {
  const text = normalize(input);
  const match = text.match(
    /\b(without|with|less|more|no|bina|kam|zyada|jasti|swalpa|illa|ಸಾಕಷ್ಟು|ಇಲ್ಲ)\b(.+)$/i
  );
  if (!match) {
    return null;
  }
  const phrase = `${match[1]}${match[2]}`.trim();
  return phrase.length > 1 ? phrase : null;
};

const extractItem = (input: string): string | null => {
  let text = normalize(input);

  for (const separator of ORDER_SEPARATORS) {
    const index = text.indexOf(separator);
    if (index > 0) {
      text = text.slice(0, index);
      break;
    }
  }

  text = text.replace(/\b\d{1,2}\b/g, " ");
  for (const word of CLEANUP_WORDS) {
    const pattern = new RegExp(`\\b${word}\\b`, "gi");
    text = text.replace(pattern, " ");
  }
  text = text.replace(/\s+/g, " ").trim();

  return text || null;
};

const buildFollowUpMessage = (language: SupportedLanguage): string => {
  if (language === "hindi") {
    return "कृपया आइटम का नाम और मात्रा बताएं। जैसे: 2 वेज थाली।";
  }
  if (language === "kannada") {
    return "ದಯವಿಟ್ಟು ಐಟಂ ಹೆಸರು ಮತ್ತು ಪ್ರಮಾಣ ಹೇಳಿ. ಉದಾಹರಣೆ: 2 ವೆಜ್ ಥಾಳಿ.";
  }
  if (language === "hinglish") {
    return "Please item name aur quantity bolo. Example: 2 veg thali.";
  }
  return "Please tell the item name and quantity. Example: 2 veg thali.";
};

const buildConfirmMessage = (language: SupportedLanguage, order: StructuredOrder): string => {
  const qty = order.quantity ?? 1;
  const item = order.itemName ?? "item";
  const instructions = order.specialInstructions ? ` (${order.specialInstructions})` : "";

  if (language === "hindi") {
    return `आप ${qty} ${item}${instructions} ऑर्डर करना चाहते हैं। कन्फर्म करें?`;
  }
  if (language === "kannada") {
    return `ನೀವು ${qty} ${item}${instructions} ಆರ್ಡರ್ ಮಾಡಬೇಕೆಂದು ಇದೀರಾ. ಕನ್‌ಫರ್ಮ್ ಮಾಡಲಾ?`;
  }
  if (language === "hinglish") {
    return `Aap ${qty} ${item}${instructions} order karna chahte ho. Confirm karun?`;
  }
  return `You want to order ${qty} ${item}${instructions}. Shall I confirm?`;
};

export const processVoiceOrder = (input: string): VoiceAssistantResult => {
  const language = detectLanguage(input);
  const quantity = parseQuantity(input);
  const itemName = extractItem(input);
  const specialInstructions = extractSpecialInstructions(input);

  const order: StructuredOrder = {
    itemName,
    quantity,
    specialInstructions,
  };

  const canConfirm = Boolean(itemName);
  if (!canConfirm) {
    return {
      language,
      order,
      message: buildFollowUpMessage(language),
      needsFollowUp: true,
      canConfirm: false,
    };
  }

  return {
    language,
    order,
    message: buildConfirmMessage(language, order),
    needsFollowUp: false,
    canConfirm: true,
  };
};

export const buildPlacedMessage = (language: SupportedLanguage, order: StructuredOrder): string => {
  const qty = order.quantity ?? 1;
  const item = order.itemName ?? "item";
  if (language === "hindi") {
    return `${qty} ${item} ऑर्डर प्लेस हो गया। धन्यवाद!`;
  }
  if (language === "kannada") {
    return `${qty} ${item} ಆರ್ಡರ್ ಪ್ಲೇಸ್ ಆಯಿತು. ಧನ್ಯವಾದಗಳು!`;
  }
  if (language === "hinglish") {
    return `${qty} ${item} order place ho gaya. Thank you!`;
  }
  return `${qty} ${item} order placed successfully. Thank you!`;
};
