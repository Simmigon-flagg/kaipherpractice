// Deck registry — pulls the portable data files together behind one interface.
import { WORD_CATEGORIES } from "../data/words";
import { SENTENCE_CATEGORIES } from "../data/sentences";
import { CONJUGATION_CATEGORIES } from "../data/conjugation";
import { JUDGE_CATEGORIES } from "../data/judge";
import { PHRASES } from "../data/phrases";

export const DECKS = {
  words:     { label: "📚 Words",        unit: "words",     judge: false, cats: WORD_CATEGORIES },
  sentences: { label: "💬 Sentences",    unit: "sentences", judge: false, cats: SENTENCE_CATEGORIES },
  conj:      { label: "🧩 Conjugation",  unit: "forms",     judge: false, cats: CONJUGATION_CATEGORIES },
  judge:     { label: "🤔 Makes Sense?", unit: "sentences", judge: true,  cats: JUDGE_CATEGORIES }
};

export { PHRASES };

export function deckCategories(deckKey) {
  const d = DECKS[deckKey];
  return Object.entries(d.cats).map(([name, c]) => ({ name, emoji: c.emoji, words: c.words }));
}
export function allWords(deckKey) {
  const out = [];
  Object.values(DECKS[deckKey].cats).forEach(c => out.push(...c.words));
  return out;
}
