// Tagalog everyday-sentence data — SAME format as practicetag.js.
// Each entry is [tagalog_sentence, english_meaning]. The app treats a sentence
// exactly like a word: it's spoken via TTS, answered by choice or typing, and
// tracked in SRS keyed to the exact Tagalog text. Keep sentences natural & short.
// NOTE: progress is keyed to the exact Tagalog spelling — don't rephrase existing lines casually.

export const SENTENCE_CATEGORIES = {
  "Daily Basics": {
    emoji: "🗣️",
    words: [
      ["Magandang umaga sa iyo","Good morning to you"],
      ["Kumusta ka na?","How are you?"],
      ["Mabuti naman ako","I'm doing well"],
      ["Ano ang pangalan mo?","What is your name?"],
      ["Taga-saan ka?","Where are you from?"],
      ["Salamat sa tulong mo","Thank you for your help"],
      ["Walang anuman","You're welcome"],
      ["Sandali lang po","Just a moment, please"],
      ["Pasensya na po","Sorry / excuse me"],
      ["Hindi ko maintindihan","I don't understand"],
      ["Pakiulit mo nga","Please repeat that"],
      ["Mamaya na lang","Maybe later"]
    ]
  },
  "Around the House": {
    emoji: "🏠",
    words: [
      ["Gising na!","Wake up!"],
      ["Kakain na tayo","Let's eat now"],
      ["Tapos na akong kumain","I'm done eating"],
      ["Maghuhugas ako ng pinggan","I'll wash the dishes"],
      ["Maglilinis ako ng bahay","I'll clean the house"],
      ["Naliligo ako","I'm taking a bath"],
      ["Matutulog na ako","I'm going to sleep now"],
      ["Pagod na ako","I'm tired already"],
      ["Buksan mo ang bintana","Open the window"],
      ["Isara mo ang pinto","Close the door"],
      ["Patay na ang ilaw","The light is off"],
      ["Saan ang banyo?","Where is the bathroom?"]
    ]
  },
  "Eating & Food": {
    emoji: "🍽️",
    words: [
      ["Gutom na ako","I'm hungry now"],
      ["Ang sarap nito!","This is so delicious!"],
      ["Busog na ako","I'm full already"],
      ["Gusto ko ng kape","I want coffee"],
      ["Pwede bang tubig?","Can I have water?"],
      ["Ano ang ulam natin?","What's our dish?"],
      ["Masarap ang luto mo","Your cooking is delicious"],
      ["Kain tayo","Let's eat"],
      ["Ayaw ko ng maanghang","I don't want spicy"],
      ["Dagdag pa ng kanin","More rice, please"],
      ["Tubig naman","Water, please"]
    ]
  },
  "Out & About": {
    emoji: "🛍️",
    words: [
      ["Saan ka pupunta?","Where are you going?"],
      ["Pupunta ako sa palengke","I'm going to the market"],
      ["Magkano ang pamasahe?","How much is the fare?"],
      ["Para po!","Stop here, please!"],
      ["Malayo pa ba?","Is it still far?"],
      ["Malapit na tayo","We're almost there"],
      ["Magkano ito?","How much is this?"],
      ["Magkano lahat?","How much in total?"],
      ["Mahal naman","That's expensive"],
      ["Pwede bang tawad?","Can I get a discount?"],
      ["Bigyan mo ako ng isa","Give me one"]
    ]
  },
  "Feelings & Small Talk": {
    emoji: "💬",
    words: [
      ["Masaya ako ngayon","I'm happy today"],
      ["Miss na kita","I miss you already"],
      ["Mahal kita","I love you"],
      ["Ingat ka palagi","Always take care"],
      ["Antok na ako","I'm sleepy now"],
      ["Okay lang ako","I'm okay"],
      ["Huwag kang mag-alala","Don't worry"],
      ["Galit ka ba sa akin?","Are you angry at me?"],
      ["Salamat sa lahat","Thank you for everything"],
      ["Nakakatawa ka","You're funny"],
      ["Sige, ingat ka","Okay, take care"]
    ]
  },
  "Questions People Ask": {
    emoji: "❓",
    words: [
      ["Anong oras na?","What time is it?"],
      ["Saan ka nakatira?","Where do you live?"],
      ["Ilang taon ka na?","How old are you?"],
      ["May asawa ka na ba?","Are you married?"],
      ["Anong trabaho mo?","What is your job?"],
      ["Kumain ka na ba?","Have you eaten?"],
      ["Saan ka galing?","Where did you come from?"],
      ["Anong ginagawa mo?","What are you doing?"],
      ["Pwede ba kitang tulungan?","Can I help you?"],
      ["Naiintindihan mo ba?","Do you understand?"],
      ["Gusto mo bang sumama?","Do you want to come along?"]
    ]
  },
  "Work & School": {
    emoji: "💼",
    words: [
      ["May trabaho ako bukas","I have work tomorrow"],
      ["Pagod ako sa trabaho","I'm tired from work"],
      ["May meeting ako mamaya","I have a meeting later"],
      ["Nag-aaral ako ng Tagalog","I'm studying Tagalog"],
      ["Tapos na ang klase","Class is over"],
      ["Busy ako ngayon","I'm busy right now"],
      ["May tanong ako","I have a question"],
      ["Paki-bagalan ang pagsasalita","Please speak more slowly"],
      ["Ano ang ibig sabihin nito?","What does this mean?"],
      ["Marunong ka bang mag-Ingles?","Do you know English?"],
      ["Konti lang ang Tagalog ko","My Tagalog is limited"]
    ]
  },
  "Shopping & Money": {
    emoji: "💸",
    words: [
      ["Pabili po","Excuse me, I'd like to buy (store greeting)"],
      ["May mas mura ba?","Is there a cheaper one?"],
      ["Bibili ako ng bigas","I'll buy rice"],
      ["Wala akong barya","I don't have change"],
      ["Isa pa po","One more, please"],
      ["Iyan na lang","Just that one"],
      ["Pwede bang card?","Can I pay by card?"],
      ["Saan ang kahera?","Where is the cashier?"],
      ["Dalawa po","Two, please"],
      ["Ubos na ang pera ko","My money is all gone"],
      ["Sukli po","My change, please"]
    ]
  },
  "Directions & Travel": {
    emoji: "🧭",
    words: [
      ["Diretso lang","Just go straight"],
      ["Kumanan ka","Turn right"],
      ["Kumaliwa ka","Turn left"],
      ["Malapit lang dito","It's just near here"],
      ["Sa kanto lang","Just at the corner"],
      ["Saan ang sakayan?","Where is the terminal / stop?"],
      ["Sakay na","Hop on"],
      ["Bababa ako dito","I'm getting off here"],
      ["Anong oras ang biyahe?","What time is the trip?"],
      ["Naliligaw ako","I'm lost"],
      ["Samahan mo ako","Come with me"]
    ]
  },
  "Health & Emergencies": {
    emoji: "🚑",
    words: [
      ["Tulong!","Help!"],
      ["Masakit ang ulo ko","My head hurts"],
      ["May sakit ako","I'm sick"],
      ["May lagnat ako","I have a fever"],
      ["Nahihilo ako","I'm dizzy"],
      ["Okay ka lang ba?","Are you okay?"],
      ["Tumawag ka ng doktor","Call a doctor"],
      ["Saan ang ospital?","Where is the hospital?"],
      ["Kailangan ko ng gamot","I need medicine"],
      ["Nasaktan ako","I got hurt"],
      ["Mag-ingat ka","Be careful"]
    ]
  },
  "Weather & Plans": {
    emoji: "⛅",
    words: [
      ["Umuulan na naman","It's raining again"],
      ["Ang init ngayon","It's so hot today"],
      ["Maganda ang panahon","The weather is nice"],
      ["May bagyo daw","They say there's a storm"],
      ["Anong plano mo bukas?","What's your plan tomorrow?"],
      ["Wala akong plano","I have no plans"],
      ["Gusto mo bang lumabas?","Do you want to go out?"],
      ["Sama ka?","Are you coming along?"],
      ["Bukas na lang","Tomorrow instead"],
      ["Kita tayo mamaya","See you later"],
      ["Mauna na ako","I'll go ahead"]
    ]
  },
  "Family Talk": {
    emoji: "👨‍👩‍👧",
    words: [
      ["Kumusta ang pamilya mo?","How is your family?"],
      ["Nasaan si Nanay?","Where is Mom?"],
      ["Tulog na ang bata","The child is asleep"],
      ["Gising na ba siya?","Is he/she awake?"],
      ["Anong oras ka uuwi?","What time will you come home?"],
      ["Nasa bahay lang ako","I'm just at home"],
      ["Nasa trabaho si Kuya","Kuya is at work"],
      ["Magkita tayo sa Linggo","Let's meet on Sunday"],
      ["Sunduin mo ako","Pick me up"],
      ["Ihatid mo ako","Take me there / drop me off"],
      ["Halika dito","Come here"]
    ]
  },
  "Compliments & Praise": {
    emoji: "🌟",
    words: [
      ["Ang galing mo!","You're so good / skilled!"],
      ["Ang ganda mo","You're beautiful"],
      ["Ang bait mo","You're so kind"],
      ["Maraming salamat po","Thank you very much (polite)"],
      ["Proud ako sa iyo","I'm proud of you"],
      ["Binabati kita","Congratulations"],
      ["Ang linis ng bahay mo","Your house is so clean"],
      ["Bagay sa iyo iyan","That suits you"],
      ["Ang talino mo","You're so smart"],
      ["Idol kita","You're my idol / I look up to you"],
      ["Galing-galing mo","Very impressive"]
    ]
  },
  "Phone & Messages": {
    emoji: "📱",
    words: [
      ["Tawagan mo ako","Call me"],
      ["I-text mo ako","Text me"],
      ["Sino ito?","Who is this?"],
      ["Nasaan ka na?","Where are you now?"],
      ["Malapit na ako","I'm almost there"],
      ["Papunta na ako","I'm on my way"],
      ["Lobat na ako","My battery is low"],
      ["Walang signal dito","There's no signal here"],
      ["May tawag ako","I have a call"],
      ["Sagutin mo ang tawag","Answer the call"],
      ["Nabasa mo ba ang text ko?","Did you read my text?"]
    ]
  },
  "Time & Schedules": {
    emoji: "⏳",
    words: [
      ["Maaga pa","It's still early"],
      ["Huli na ako","I'm late"],
      ["Sandali na lang","Just a moment more"],
      ["Ngayon na!","Right now!"],
      ["Hindi pa ako tapos","I'm not done yet"],
      ["Tapos na ako","I'm done"],
      ["Sa susunod na linggo","Next week"],
      ["Kahapon pa","Since yesterday"],
      ["Aalis ako nang alas-otso","I'll leave at eight"],
      ["Anong araw ngayon?","What day is it today?"],
      ["Wala nang oras","There's no more time"]
    ]
  }
};
