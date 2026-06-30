// "Makes Sense?" deck — listen to a Tagalog sentence, decide if it is BOTH
// grammatically correct AND meaningful. Each item is:
//   [ sentence, isGood(true/false), explanation ]
// A "false" item is either grammatically broken OR grammatical-but-nonsense;
// the explanation says which, so wrong answers still teach.
//
// Graduated by level (child-simple -> complex). Built carefully but NOT by a
// native speaker — worth a native spot-check, especially the `false` items.

const JUDGE_CATEGORIES = {
  "Level 1 — Tiny Sentences": {
    emoji: "🐣",
    words: [
      ["Kumakain ang aso.", true, "Correct: 'The dog is eating.'"],
      ["Natutulog ang bata.", true, "Correct: 'The child is sleeping.'"],
      ["Maganda ang bulaklak.", true, "Correct: 'The flower is beautiful.'"],
      ["Malaki ang bahay.", true, "Correct: 'The house is big.'"],
      ["Umiinom ako ng tubig.", true, "Correct: 'I am drinking water.'"],
      ["Mainit ang kape.", true, "Correct: 'The coffee is hot.'"],
      ["Tumatakbo ang bata.", true, "Correct: 'The child is running.'"],
      ["Masarap ang pagkain.", true, "Correct: 'The food is delicious.'"],
      ["Umiinom ng tubig ang bato.", false, "Nonsense: a rock (bato) can't drink water — grammar is fine, meaning isn't."],
      ["Kumakain ang bahay.", false, "Nonsense: a house (bahay) doesn't eat."],
      ["Natutulog ang kape.", false, "Nonsense: coffee doesn't sleep."],
      ["Ang aso kumakain.", false, "Broken: missing linker — say 'Kumakain ang aso' or 'Ang aso ay kumakain.'"],
      ["Maganda bulaklak ang.", false, "Broken word order: should be 'Maganda ang bulaklak.'"],
      ["Tumatakbo ang tubig.", false, "Odd/nonsense here: water doesn't 'run' like a person — use a different verb."],
      ["Malaki ang masaya.", false, "Doesn't make sense: 'masaya' (happy) isn't a thing that can be 'big.'"],
      ["Ako kumakain ng kanin.", false, "Broken: needs 'Kumakain ako ng kanin' — pronoun goes after the verb."]
    ]
  },
  "Level 2 — Everyday": {
    emoji: "🧒",
    words: [
      ["Pumupunta ako sa palengke.", true, "Correct: 'I am going to the market.'"],
      ["Nagluluto si Nanay ng hapunan.", true, "Correct: 'Mom is cooking dinner.'"],
      ["Maglalaro ang mga bata sa parke.", true, "Correct: 'The children will play in the park.'"],
      ["Mabait ang guro namin.", true, "Correct: 'Our teacher is kind.'"],
      ["Bumili siya ng tinapay kahapon.", true, "Correct: 'He/she bought bread yesterday.'"],
      ["Malamig ang panahon ngayon.", true, "Correct: 'The weather is cold today.'"],
      ["Natutulog ang pusa sa kama.", true, "Correct: 'The cat is sleeping on the bed.'"],
      ["Gusto kong matuto ng Tagalog.", true, "Correct: 'I want to learn Tagalog.'"],
      ["Nagluluto ng hapunan ang mesa.", false, "Nonsense: a table (mesa) doesn't cook."],
      ["Bumili ng tinapay ang tubig.", false, "Nonsense: water doesn't buy bread."],
      ["Pumupunta sa palengke ang bahay.", false, "Nonsense: a house doesn't go to the market."],
      ["Ako pumupunta sa palengke.", false, "Broken: 'Pumupunta ako sa palengke' — pronoun after the verb."],
      ["Mabait namin ang guro.", false, "Broken word order: 'Mabait ang guro namin.'"],
      ["Gusto matuto ako ng Tagalog.", false, "Broken: should be 'Gusto kong matuto ng Tagalog.'"],
      ["Maglalaro sa parke ang malamig.", false, "Nonsense: 'malamig' (cold) isn't someone who can play."],
      ["Bumili kahapon ng tinapay bukas siya.", false, "Broken/contradictory: mixes 'kahapon' (yesterday) and 'bukas' (tomorrow)."]
    ]
  },
  "Level 3 — Real Talk": {
    emoji: "🗣️",
    words: [
      ["Hindi ako makakapunta bukas dahil may trabaho ako.", true, "Correct: 'I can't go tomorrow because I have work.'"],
      ["Kung uulan, hindi tayo lalabas.", true, "Correct: 'If it rains, we won't go out.'"],
      ["Matagal na akong nag-aaral ng wikang Tagalog.", true, "Correct: 'I've been studying Tagalog for a long time.'"],
      ["Mas masarap ang luto ni Lola kaysa sa akin.", true, "Correct: 'Grandma's cooking is tastier than mine.'"],
      ["Pagkatapos kumain, naghugas siya ng pinggan.", true, "Correct: 'After eating, he/she washed the dishes.'"],
      ["Gusto kong bumili ng bagong sapatos sa mall.", true, "Correct: 'I want to buy new shoes at the mall.'"],
      ["Tinutulungan ko ang kapatid ko sa takdang-aralin.", true, "Correct: 'I help my sibling with homework.'"],
      ["Naglalakad kami papuntang simbahan tuwing Linggo.", true, "Correct: 'We walk to church every Sunday.'"],
      ["Hindi ako makakapunta bukas dahil masaya ang bato.", false, "Nonsense ending: 'because the rock is happy' isn't a real reason."],
      ["Kung uulan, lalangoy ang takdang-aralin.", false, "Nonsense: homework can't swim."],
      ["Mas masarap ang Lola kaysa luto.", false, "Wrong meaning: this says Grandma tastes better than the cooking — markers misplaced."],
      ["Pagkatapos kumain naghugas pinggan siya ng.", false, "Broken word order at the end: '…naghugas siya ng pinggan.'"],
      ["Matagal na nag-aaral ako Tagalog ng wikang.", false, "Broken word order: '…nag-aaral ng wikang Tagalog.'"],
      ["Tinutulungan ako ng takdang-aralin sa kapatid ko.", false, "Reversed meaning: this says the homework helps me — roles flipped."],
      ["Naglalakad ang simbahan papuntang kami.", false, "Nonsense + broken: the church isn't walking toward us."],
      ["Gusto kong bumili ng bagong mall sa sapatos.", false, "Swapped nouns: you'd buy shoes at a mall, not a 'mall at the shoes.'"]
    ]
  },
  "Level 4 — Trickier": {
    emoji: "🎓",
    words: [
      ["Sinabi niya na darating siya bago mag-alas-otso.", true, "Correct: 'He/she said they'd arrive before eight.'"],
      ["Kahit pagod ako, tatapusin ko pa rin ang trabaho.", true, "Correct: 'Even though I'm tired, I'll still finish the work.'"],
      ["Mukhang uulan, kaya magdala ka ng payong.", true, "Correct: 'It looks like rain, so bring an umbrella.'"],
      ["Habang nagluluto ako, naglilinis siya ng bahay.", true, "Correct: 'While I cook, he/she cleans the house.'"],
      ["Hindi ko alam kung saan niya inilagay ang susi.", true, "Correct: 'I don't know where he/she put the key.'"],
      ["Mas gusto kong magbasa kaysa manood ng telebisyon.", true, "Correct: 'I prefer reading to watching TV.'"],
      ["Dapat tayong mag-ingat dahil madulas ang daan.", true, "Correct: 'We should be careful because the road is slippery.'"],
      ["Kung nag-aral ka, pumasa ka sana sa pagsusulit.", true, "Correct: 'If you had studied, you would've passed the exam.'"],
      ["Sinabi ng susi na darating siya bago mag-alas-otso.", false, "Nonsense: a key (susi) can't say anything."],
      ["Kahit pagod ang payong, tatapusin nito ang trabaho.", false, "Nonsense: an umbrella isn't tired and can't finish work."],
      ["Habang naglilinis ng bahay, nagluluto ang daan.", false, "Nonsense: a road (daan) doesn't cook."],
      ["Hindi ko alam kung saan inilagay ang susi niya ang.", false, "Broken: dangling 'ang' at the end — word order falls apart."],
      ["Mas gusto manood kaysa magbasa kong ako ng.", false, "Broken word order: '…gusto kong manood kaysa magbasa.'"],
      ["Dapat madulas tayong mag-ingat ang daan dahil.", false, "Broken: clauses scrambled — 'Dapat tayong mag-ingat dahil madulas ang daan.'"],
      ["Mukhang payong, kaya magdala ka ng uulan.", false, "Swapped: you bring an umbrella because of rain, not 'bring rain.'"],
      ["Sinabi niya na darating ang pagsusulit bago mag-aral siya.", false, "Garbled meaning: the exam doesn't 'arrive before he studies' in any sensible way."]
    ]
  }
};
