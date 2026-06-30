// Tagalog verb CONJUGATION deck — aspect forms (completed / ongoing / contemplated),
// organized by verb family. Same format as the other decks.
// Format: "Category Name": { emoji: "🔤", words: [ [tagalog, english], ... ] }
// NOTE: some base forms also exist in the Words deck — they share progress, which is fine.

const CONJUGATION_CATEGORIES = {
  "UM Verbs: Past (Completed)": {
    emoji: "⏮",
    words: [
      ["kumain","ate"],["uminom","drank"],["bumili","bought"],["pumunta","went"],
      ["tumakbo","ran"],["kumanta","sang"],["tumawa","laughed"],["umiyak","cried"],
      ["lumangoy","swam"],["tumalon","jumped"],["umupo","sat down"],["tumayo","stood up"],
      ["umalis","left"],["dumating","arrived"],["bumalik","returned"],["gumising","woke up"],
      ["sumagot","answered"],["tumulong","helped"],["kumuha","got / took"],["sumayaw","danced"]
    ]
  },
  "UM Verbs: Present (Ongoing)": {
    emoji: "▶️",
    words: [
      ["kumakain","eating"],["umiinom","drinking"],["bumibili","buying"],["pumupunta","going"],
      ["tumatakbo","running"],["kumakanta","singing"],["tumatawa","laughing"],["umiiyak","crying"],
      ["lumalangoy","swimming"],["tumatalon","jumping"],["umuupo","sitting down"],["tumatayo","standing up"],
      ["umaalis","leaving"],["dumarating","arriving"],["bumabalik","returning"],["gumigising","waking up"],
      ["sumasagot","answering"],["tumutulong","helping"],["kumukuha","getting / taking"],["sumasayaw","dancing"]
    ]
  },
  "UM Verbs: Future (Will…)": {
    emoji: "⏭",
    words: [
      ["kakain","will eat"],["iinom","will drink"],["bibili","will buy"],["pupunta","will go"],
      ["tatakbo","will run"],["kakanta","will sing"],["tatawa","will laugh"],["iiyak","will cry"],
      ["lalangoy","will swim"],["tatalon","will jump"],["uupo","will sit down"],["tatayo","will stand up"],
      ["aalis","will leave"],["darating","will arrive"],["babalik","will return"],["gigising","will wake up"],
      ["sasagot","will answer"],["tutulong","will help"],["kukuha","will get / take"],["sasayaw","will dance"]
    ]
  },
  "MAG Verbs: Past (Completed)": {
    emoji: "⏮",
    words: [
      ["nagluto","cooked"],["naglaro","played"],["naglakad","walked"],["nag-aral","studied"],
      ["nagturo","taught"],["naglinis","cleaned"],["naghugas","washed"],["naglaba","did laundry"],
      ["nagbayad","paid"],["nagbigay","gave"],["naghintay","waited"],["nagtanong","asked"],
      ["nagsalita","spoke"],["nagsulat","wrote"],["nagbasa","read (past)"],["nagmaneho","drove"],
      ["nagtrabaho","worked"],["nagpahinga","rested"],["nag-isip","thought"]
    ]
  },
  "MAG Verbs: Present (Ongoing)": {
    emoji: "▶️",
    words: [
      ["nagluluto","cooking"],["naglalaro","playing"],["naglalakad","walking"],["nag-aaral","studying"],
      ["nagtuturo","teaching"],["naglilinis","cleaning"],["naghuhugas","washing"],["naglalaba","doing laundry"],
      ["nagbabayad","paying"],["nagbibigay","giving"],["naghihintay","waiting"],["nagtatanong","asking"],
      ["nagsasalita","speaking"],["nagsusulat","writing"],["nagbabasa","reading"],["nagmamaneho","driving"],
      ["nagpapahinga","resting"],["nag-iisip","thinking"]
    ]
  },
  "MAG Verbs: Future (Will…)": {
    emoji: "⏭",
    words: [
      ["magluluto","will cook"],["maglalaro","will play"],["maglalakad","will walk"],["mag-aaral","will study"],
      ["magtuturo","will teach"],["maglilinis","will clean"],["maghuhugas","will wash"],["maglalaba","will do laundry"],
      ["magbabayad","will pay"],["magbibigay","will give"],["maghihintay","will wait"],["magtatanong","will ask"],
      ["magsasalita","will speak"],["magsusulat","will write"],["magbabasa","will read"],["magmamaneho","will drive"],
      ["magtatrabaho","will work"],["magpapahinga","will rest"],["mag-iisip","will think"]
    ]
  },
  "MA Verbs: All Aspects": {
    emoji: "🔄",
    words: [
      ["natulog","slept"],["natutulog","sleeping"],["matutulog","will sleep"],
      ["naligo","bathed"],["naliligo","bathing"],["maliligo","will bathe"],
      ["nakita","saw"],["nakikita","seeing / can see"],["makikita","will see"],
      ["narinig","heard"],["naririnig","hearing / can hear"],["maririnig","will hear"],
      ["naalala","remembered"],["naaalala","remembering"],["maaalala","will remember"],
      ["nakalimutan","forgot"],["nakakalimutan","forgetting"],["makakalimutan","will forget"],
      ["natakot","got scared"],["natatakot","scared (ongoing)"],["matatakot","will be scared"],
      ["nagalit","got angry"],["nagagalit","getting angry"],["magagalit","will get angry"]
    ]
  },
  "MANG Verbs: All Aspects": {
    emoji: "🔄",
    words: [
      ["namili","shopped"],["namimili","shopping"],["mamimili","will shop"],
      ["nanood","watched"],["nanonood","watching"],["manonood","will watch"],
      ["nangarap","dreamed"],["nangangarap","dreaming"],["mangangarap","will dream"],
      ["nanalo","won"],["nananalo","winning"],["mananalo","will win"]
    ]
  },
  "Object Focus (-IN): Do It": {
    emoji: "🎯",
    words: [
      ["kainin","eat (it)"],["inumin","drink (it)"],["lutuin","cook (it)"],["bilhin","buy (it)"],
      ["hugasan","wash (it)"],["linisin","clean (it)"],["basahin","read (it)"],["isulat","write (it down)"],
      ["gawin","do (it)"],["tingnan","look at (it)"],["buksan","open (it)"],["isara","close (it)"],
      ["kunin","get (it)"],["ibigay","give (it)"],["hanapin","find (it)"]
    ]
  },
  "-IN Verbs: All Aspects": {
    emoji: "🎯",
    words: [
      ["kinain","ate (it)"],["kinakain","eating (it)"],["kakainin","will eat (it)"],
      ["ininom","drank (it)"],["iniinom","drinking (it)"],["iinumin","will drink (it)"],
      ["niluto","cooked (it)"],["niluluto","cooking (it)"],["lulutuin","will cook (it)"],
      ["binili","bought (it)"],["binibili","buying (it)"],["bibilhin","will buy (it)"],
      ["ginawa","did (it)"],["ginagawa","doing (it)"],["gagawin","will do (it)"],
      ["kinuha","took (it)"],["kinukuha","taking (it)"],["kukunin","will take (it)"],
      ["hinanap","looked for (it)"],["hinahanap","looking for (it)"],["hahanapin","will look for (it)"],
      ["binasa","read (it, past)"],["binabasa","reading (it)"],["babasahin","will read (it)"]
    ]
  },
  "-AN Verbs: All Aspects": {
    emoji: "🚪",
    words: [
      ["binuksan","opened (it)"],["binubuksan","opening (it)"],["bubuksan","will open (it)"],
      ["hinugasan","washed (it)"],["hinuhugasan","washing (it)"],["huhugasan","will wash (it)"],
      ["binayaran","paid (for it)"],["binabayaran","paying (for it)"],["babayaran","will pay (for it)"],
      ["tinulungan","helped (someone)"],["tinutulungan","helping (someone)"],["tutulungan","will help (someone)"],
      ["binigyan","gave (someone something)"],["binibigyan","giving (someone something)"],["bibigyan","will give (someone something)"],
      ["sinarhan","closed (it)"],["sinasarhan","closing (it)"],["sasarhan","will close (it)"]
    ]
  },
  "I- Verbs: All Aspects": {
    emoji: "📤",
    words: [
      ["ibinigay","gave (it away)"],["ibinibigay","giving (it away)"],["ibibigay","will give (it away)"],
      ["inilagay","put (it somewhere)"],["inilalagay","putting (it somewhere)"],["ilalagay","will put (it somewhere)"],
      ["itinapon","threw (it) away"],["itinatapon","throwing (it) away"],["itatapon","will throw (it) away"],
      ["ibinalik","returned (it)"],["ibinabalik","returning (it)"],["ibabalik","will return (it)"],
      ["isinulat","wrote (it) down"],["isinusulat","writing (it) down"],["isusulat","will write (it) down"]
    ]
  },
  "Ability (NAKA-/MAKA-)": {
    emoji: "💪",
    words: [
      ["nakakain","was able to eat"],["nakainom","was able to drink"],["nakatulog","managed to sleep"],
      ["nakapunta","was able to go"],["nakabili","was able to buy"],["nakauwi","made it home"],
      ["nakapasok","made it in (work/school)"],["nakatapos","managed to finish"],
      ["makakakain","will be able to eat"],["makakapunta","will be able to go"],
      ["makakatulog","will be able to sleep"],["makakabili","will be able to buy"]
    ]
  },
  "Just Happened (KAKA- lang)": {
    emoji: "🕐",
    words: [
      ["kakakain lang","just ate"],["kakauwi lang","just got home"],["kakagising lang","just woke up"],
      ["kakadating lang","just arrived"],["kakaalis lang","just left"],["kakatapos lang","just finished"],
      ["kakaligo lang","just bathed"],["kakabili lang","just bought (it)"]
    ]
  },
  "Commands & Requests": {
    emoji: "📣",
    words: [
      ["kumain ka","eat!"],["uminom ka","drink!"],["matulog ka na","go to sleep now"],
      ["umupo ka","sit down"],["tumayo ka","stand up"],["halika","come here"],
      ["bilisan mo","hurry up"],["dahan-dahan","slowly / gently"],["tigil","stop"],
      ["sandali","hold on a moment"],["kain na","come eat / let's eat"],["tara","let's go (casual)"]
    ]
  }
};
