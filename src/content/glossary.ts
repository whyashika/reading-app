/**
 * ─────────────────────────────────────────────────────────────
 *  GLOSSARY: the little pop-up definitions in the reader.
 * ─────────────────────────────────────────────────────────────
 *  The first time a term (or one of its other spellings) appears
 *  in a piece's ordinary text, it gets a dotted underline. Tap it
 *  and the definition pops up. Bold words are skipped, because
 *  bold is where a piece already explains the term itself.
 *
 *  These are starter definitions. Rewrite them in your own words,
 *  delete any you don't want, and add new ones as you write.
 * ─────────────────────────────────────────────────────────────
 */
export interface GlossaryEntry {
  /** As it should appear as the pop-up's heading. */
  term: string;
  /** Other ways the term is written in pieces (plurals etc.). Matching ignores capital letters. */
  aliases?: string[];
  definition: string;
}

export const glossary: GlossaryEntry[] = [
  // Money and economics
  {
    term: "Interest rate",
    aliases: ["interest rates"],
    definition: "The price of borrowing money, written as a percentage per year. Borrow, and you pay it. Save, and the bank pays it to you.",
  },
  {
    term: "Central bank",
    aliases: ["central banks"],
    definition: "The bank that runs a country's money system and looks after the other banks. In India, that's the Reserve Bank of India (RBI). Its key interest rate sets the tone for everyone else's.",
  },
  {
    term: "Compounding",
    aliases: ["compound", "compounds"],
    definition: "Earning interest on your interest, so growth builds on itself over time, like a snowball rolling downhill.",
  },
  {
    term: "Inflation",
    definition: "The general rise in prices over time. Another way to say it: each rupee buys a little less than it used to.",
  },
  {
    term: "Shares",
    definition: "Tiny slices of ownership in a company. Own one and you own a very small piece of the business, so its price rises and falls with what people expect the company to do next.",
  },
  {
    term: "Stock market",
    definition: "The marketplace where shares are bought and sold. India's two big ones are the NSE and the BSE, both in Mumbai.",
  },
  {
    term: "Regulators",
    aliases: ["regulator"],
    definition: "Official bodies that write and enforce the rules for an industry. For India's stock markets, that's SEBI, the Securities and Exchange Board of India.",
  },
  {
    term: "Adam Smith",
    definition: "An 18th-century Scottish thinker, often called the father of economics. His book The Wealth of Nations (1776) still gets quoted in arguments today.",
  },
  {
    term: "Use value",
    definition: "What a thing actually does for you. Water has enormous use value: you'd die without it.",
  },
  {
    term: "Exchange value",
    definition: "What someone will give you for a thing. A diamond has very little use value but a huge exchange value.",
  },
  {
    term: "At the margin",
    definition: "Economist-speak for \"the next one\". Thinking at the margin means asking what one more glass, hour or rupee is worth to you, not what the whole category is worth.",
  },

  // Climate
  {
    term: "Carbon neutral",
    definition: "A claim that something adds no extra carbon dioxide to the air overall, usually because its emissions are balanced by cutting or removing the same amount somewhere else.",
  },
  {
    term: "Carbon dioxide",
    definition: "The gas (CO₂) released when we burn coal, oil, petrol or gas. It traps heat in the atmosphere, which makes it the main driver of climate change.",
  },
  {
    term: "Emissions",
    aliases: ["emit"],
    definition: "Gases released into the air. In climate talk, it usually means greenhouse gases like carbon dioxide from factories, vehicles and power plants.",
  },
  {
    term: "Offset",
    aliases: ["offsets"],
    definition: "Making up for your own emissions by paying for the same amount of carbon to be cut or removed somewhere else.",
  },

  // Law
  {
    term: "Privacy policy",
    definition: "The document that says what a company collects about you, what it does with it, and who it shares it with. Usually long. Usually unread.",
  },
  {
    term: "Statute",
    aliases: ["statutes"],
    definition: "A law passed by a legislature, like Parliament. It's the written rulebook, as opposed to rules built up from court decisions.",
  },
  {
    term: "Common law",
    definition: "A legal system where judges' past decisions count as law alongside the written statutes. India inherited it from British rule, as did the UK, the US and many others.",
  },
  {
    term: "Brief",
    definition: "In law, the written document a lawyer hands to a court setting out their arguments and the past cases that support them.",
  },

  // Tech
  {
    term: "Engagement",
    aliases: ["engage"],
    definition: "Anything you do with a post: watching, liking, commenting, sharing, or even just pausing on it. Apps measure it closely because it's their best clue to what you'll want next.",
  },
  {
    term: "Chatbot",
    aliases: ["chatbots"],
    definition: "A program you talk to in everyday language. The best-known ones today run on large language models.",
  },

  // History
  {
    term: "Harappa",
    definition: "One of the first Indus Valley cities to be dug up, in today's Punjab province of Pakistan. It's why the civilisation is also called the Harappan Civilisation.",
  },
  {
    term: "Mohenjo-daro",
    definition: "The largest known Indus Valley city, in today's Sindh province of Pakistan, and home to the famous Great Bath. The name is usually translated as \"mound of the dead\".",
  },
  {
    term: "BCE",
    definition: "Before Common Era. It counts the same years as \"BC\", with a neutral label. So 2600 BCE was about 4,600 years ago.",
  },
  {
    term: "Granaries",
    definition: "Big storehouses for grain. Early archaeologists gave this name to a few large Indus buildings, though some scholars now question what they were really used for.",
  },

  // Culture
  {
    term: "Sanskrit",
    definition: "An ancient Indian language, the language of the Vedas and of Valmiki's Ramayana. Many Indian languages borrow heavily from it.",
  },
  {
    term: "Awadhi",
    definition: "A language of the Awadh region, in today's Uttar Pradesh, close cousin to Hindi. Tulsidas wrote in it so ordinary people could follow Rama's story.",
  },
  {
    term: "Ramlila",
    definition: "A staged retelling of Rama's story, performed in towns and villages across north India, especially in the days before Dussehra. UNESCO lists it as intangible cultural heritage.",
  },
  {
    term: "Ramakien",
    definition: "Thailand's own version of the Ramayana. Its scenes are painted along the walls of the Temple of the Emerald Buddha in Bangkok.",
  },
];
