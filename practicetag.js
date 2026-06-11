// Tagalog word data, grouped by category.
// Edit freely: add words as ["tagalog","english"] pairs, or add whole new categories.
// Format: "Category Name": { emoji: "🔤", words: [ [tl, en], ... ] }

const WORD_CATEGORIES = {
  "Essentials": {
    emoji: "⭐",
    words: [
      ["oo","yes"],["hindi","no / not"],["salamat","thank you"],
      ["gusto","want / like"],["ayaw","don't want"],["alam","know"],
      ["marami","many"],["konti","few / a little"],["lahat","all"],["wala","none / nothing"]
    ]
  },
  "Question Words": {
    emoji: "❓",
    words: [
      ["saan","where"],["ano","what"],["sino","who"],
      ["kailan","when"],["bakit","why"],["paano","how"]
    ]
  },
  "People": {
    emoji: "👪",
    words: [
      ["lalaki","man"],["babae","woman"],["bata","child"],
      ["pamilya","family"],["kaibigan","friend"],["guro","teacher"]
    ]
  },
  "Food & Drink": {
    emoji: "🍚",
    words: [
      ["pagkain","food"],["tubig","water"],["kanin","cooked rice"],["tinapay","bread"],
      ["itlog","egg"],["isda","fish"],["manok","chicken"],["baboy","pig / pork"],
      ["gatas","milk"],["kape","coffee"],["asukal","sugar"],["asin","salt"]
    ]
  },
  "Body": {
    emoji: "💪",
    words: [
      ["kamay","hand"],["paa","foot"],["mata","eye"],["ilong","nose"],
      ["bibig","mouth"],["tenga","ear"],["ulo","head"],["puso","heart"]
    ]
  },
  "House & Town": {
    emoji: "🏠",
    words: [
      ["bahay","house"],["mesa","table"],["upuan","chair"],["pinto","door"],
      ["bintana","window"],["kotse","car"],["pera","money"],["libro","book"],
      ["paaralan","school"],["palengke","market"]
    ]
  },
  "Nature & Animals": {
    emoji: "🌿",
    words: [
      ["aso","dog"],["pusa","cat"],["ulan","rain"],["hangin","wind / air"],
      ["apoy","fire"],["lupa","ground / earth"],["langit","sky"],["dagat","sea"],
      ["bundok","mountain"],["puno","tree"],["bulaklak","flower"]
    ]
  },
  "Adjectives": {
    emoji: "🎨",
    words: [
      ["maganda","beautiful"],["mabuti","good / fine"],["masaya","happy"],["malungkot","sad"],
      ["malaki","big"],["maliit","small"],["mainit","hot"],["malamig","cold"],
      ["bago","new"],["mabilis","fast"],["mabagal","slow"]
    ]
  },
  "Time & Place": {
    emoji: "⏰",
    words: [
      ["araw","sun / day"],["umaga","morning"],["gabi","night"],
      ["ngayon","now / today"],["bukas","tomorrow"],["kahapon","yesterday"],
      ["dito","here"],["doon","there"],["malayo","far"],["malapit","near"]
    ]
  },
  "Verbs": {
    emoji: "🏃",
    words: [
      ["trabaho","work / job"],["nagtatrabaho","working"],["kumain","ate"],["uminom","drank"],
      ["matulog","to sleep"],["bumili","bought"],["magluto","to cook"],["maglaro","to play"],
      ["kumanta","sang"],["tumakbo","ran"],["maglakad","to walk"],["magsalita","to speak"],
      ["makinig","to listen"],["magbasa","to read"],["magsulat","to write"],
      ["umuwi","to go home"],["pumunta","went"]
    ]
  }
};
