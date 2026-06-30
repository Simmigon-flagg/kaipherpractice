// Tagalog word data, grouped by category — ORDERED AS A LEARNING PATH (top = learn first).
// Edit freely: add words as ["tagalog","english"] pairs, or add whole new categories.
// Format: "Category Name": { emoji: "🔤", words: [ [tl, en], ... ] }
// NOTE: progress is keyed to the exact Tagalog spelling — don't rename existing words casually.

const WORD_CATEGORIES = {
  "Essentials": {
    emoji: "⭐",
    words: [
      ["oo","yes"],["hindi","no / not"],["salamat","thank you"],["gusto","want / like"],
      ["ayaw","don't want"],["alam","know"],["marami","many"],["konti","few / a little"],
      ["lahat","all"],["wala","none / nothing"],["may","there is / have"],["huwag","don't"],
      ["muna","first / for now"],["ulit","again"],["totoo","true / real"],["siguro","maybe / probably"],
      ["meron","there is / have"],["na","already / now"],["pa","still / yet"],["nga","really / indeed"],
      ["pala","oh, I see (realization)"],["kaya","so / therefore"],["yata","perhaps / I think"],["parang","seems like / sort of"],
      ["masyado","too much"],["kahit","even / even if"],["basta","as long as / just because"],["saka","and then / besides"],
      ["mga","plural marker"],["yung","the / that one"],["nasa","is at / located in"],["galing","from / came from"],
      ["iba","other / different"],["ibang","another (linked)"],["ganito","like this"],["ganyan","like that (near you)"],
      ["ganoon","like that (far)"],["mas","more (comparative)"],["pinaka","most (superlative)"],["lalo","even more / especially"],
      ["higit","more than / over"],["halos","almost"],["agad","immediately / right away"],["bigla","suddenly"],
      ["palagi","always"],["madalas","often"],["unti-unti","little by little"],["dahan-dahan","slowly / carefully"],
      ["ko","my / by me"],["mo","your / by you"],["niya","his / her / by him-her"],["natin","our (incl) / by us"],
      ["namin","our (excl) / by us"],["ninyo","your (pl) / by you"],["nila","their / by them"],["atin","ours (incl)"],
      ["amin","ours (excl)"],["kanila","theirs"],["sarili","self / own"],["gawa","make / do (root)"],
      ["gawin","to do / make"],["sabi","said / says"],["sabihin","to say"],["tingin","look / opinion"],
      ["tingnan","to look at"],["dala","bring / carry"],["dalhin","to bring"],["punta","go (root)"],
      ["balik","return (root)"],["alis","leave / remove (root)"],["tigil","stop"],["tuloy","continue / come in"],
      ["hinto","stop / halt"],["galaw","move"],["sundin","to follow / obey"],["subukan","to try"],
      ["gamitin","to use"],["hanapin","to look for"],["bigyan","to give to"],["bagay","thing"],
      ["gamit","use / belongings"],["uri","kind / type"],["paraan","way / method"],["dahilan","reason"],
      ["halimbawa","example"],["problema","problem"],["balita","news"],["kuwento","story"],
      ["salita","word"],["wika","language"],["tulong","help"],["gawain","task / activity"],
      ["plano","plan"],["pangalan","name"],["edad","age"],["buhay","life / alive"],
      ["mundo","world"],["tao","person"],["lugar","place"],["panahon","time / weather"],
      ["kasama","companion / together with"],["importante","important"],
      ["intindihin","to understand"],["unawain","to comprehend"],["ipaliwanag","to explain"],["ipakita","to show"],
      ["magkita","to meet"],["mag-usap","to talk / discuss"],["tumawag","to call"],["humingi","to ask for / request"],
      ["sumama","to go along / join"],["sumunod","to follow / obey"],["pumasok","to enter / go in"],["lumabas","to go out"],
      ["sumakay","to ride / board"],["bumaba","to get off / go down"],["umakyat","to go up / climb"],["manood","to watch"],
      ["magbihis","to get dressed"],["magpalit","to change / switch"],["piliin","to choose"],["isipin","to think about"],
      ["malaman","to find out"],["sunduin","to pick up (someone)"],["ihatid","to drop off / take someone"],["abutin","to reach / hand over"],
      ["kunin","to take / get"],["ipasok","to put in / insert"],["ilabas","to take out"],["tanggalin","to remove / take off"],
      ["magtiwala","to trust"],["mag-alala","to worry"],["matuto","to learn"],["maintindihan","to understand / grasp"],
      ["maranasan","to experience"],["mangyari","to happen"],["magtagal","to take long / last"],["matapos","to be finished"],
      ["magsimula","to begin"],["muli","again / anew"],["noon","back then / before"],["habang","while / as"],
      ["pagkatapos","after / afterwards"],["samantala","meanwhile"],["upang","in order to"],["ngunit","but (formal)"],
      ["subalit","however"],["gayunpaman","nevertheless"],["samakatuwid","therefore"],["maliban","except"],
      ["bukod","aside from"],["pati","including / also"],["tuwing","every time / whenever"],["bawat","each / every"],
      ["kadalasan","usually"],["karaniwan","usual / ordinary"],["paminsan-minsan","occasionally"],["madalang","seldom"],
      ["labis","excessive / too much"],["sadya","intentionally / really"],["sandali","a moment"],["wakas","end"],
      ["katapusan","the end"],["bahagi","part"],["bilang","number / count"],["dami","quantity / amount"],
      ["sukat","size / measure"],["tagal","duration"],["lakas","strength"],["ganda","beauty"],
      ["saya","joy / fun"],["katotohanan","truth"],["kasinungalingan","a lie"],["kahulugan","meaning"],
      ["kahalagahan","importance"],["pag-asa","hope"],["pangarap","dream / aspiration"],["panaginip","dream (in sleep)"],
      ["isip","mind / thought"],["damdamin","feelings"],["katawan","body"],["kaluluwa","soul"],
      ["kapwa","fellow human"],["kapitbahay","neighbor"],["kakilala","acquaintance"],["kaaway","enemy"],
      ["katrabaho","coworker"],["pangyayari","event / happening"],["karanasan","experience"],["pagkakataon","opportunity / chance"],
      ["layunin","goal / purpose"],["hangarin","aim / desire"],["kalagayan","situation / condition"],["sitwasyon","situation"],
      ["kalidad","quality"],["halaga","value / worth"],["hangganan","limit / boundary"],["kanino","whose / to whom"],
      ["alinman","any / whichever"],["sinuman","anyone"],["anuman","anything / whatever"]
    ]
  },
  "Greetings & Phrases": {
    emoji: "👋",
    words: [
      ["kumusta","how are you"],["magandang umaga","good morning"],["magandang hapon","good afternoon"],["magandang gabi","good evening"],
      ["paalam","goodbye"],["ingat","take care"],["sige","okay / go ahead"],["po","politeness marker"],
      ["opo","yes (polite)"],["walang anuman","you're welcome"],["pasensya na","sorry"],["mahal kita","I love you"],
      ["tara na","let's go"],["saglit lang","just a moment"]
    ]
  },
  "Pronouns": {
    emoji: "🙋",
    words: [
      ["ako","I / me"],["ikaw","you"],["siya","he / she"],["kami","we (not including you)"],
      ["tayo","we (including you)"],["kayo","you (plural / polite)"],["sila","they"],["ito","this"],
      ["iyan","that (near you)"],["iyon","that (far)"],["akin","mine"],["iyo","yours"],
      ["kanya","his / hers"]
    ]
  },
  "Question Words": {
    emoji: "❓",
    words: [
      ["saan","where"],["ano","what"],["sino","who"],["kailan","when"],
      ["bakit","why"],["paano","how"],["ilan","how many"],["magkano","how much (price)"],
      ["alin","which"]
    ]
  },
  "Numbers": {
    emoji: "🔢",
    words: [
      ["isa","one"],["dalawa","two"],["tatlo","three"],["apat","four"],
      ["lima","five"],["anim","six"],["pito","seven"],["walo","eight"],
      ["siyam","nine"],["sampu","ten"],["dalawampu","twenty"],["isang daan","one hundred"],
      ["isang libo","one thousand"]
    ]
  },
  "Time & Place": {
    emoji: "⏰",
    words: [
      ["araw","sun / day"],["umaga","morning"],["gabi","night"],["ngayon","now / today"],
      ["bukas","tomorrow"],["kahapon","yesterday"],["dito","here"],["doon","there"],
      ["malayo","far"],["malapit","near"],["oras","hour / time"],["minuto","minute"],
      ["buwan","month / moon"],["taon","year"],["mamaya","later"],["kanina","earlier"],
      ["tanghali","noon"],["hapon","afternoon"],["madaling-araw","dawn"],["lagi","always"],
      ["minsan","sometimes / once"],["bihira","rarely"],["araw-araw","every day"]
    ]
  },
  "Days of the Week": {
    emoji: "📅",
    words: [
      ["Lunes","Monday"],["Martes","Tuesday"],["Miyerkules","Wednesday"],["Huwebes","Thursday"],
      ["Biyernes","Friday"],["Sabado","Saturday"],["Linggo","Sunday / week"]
    ]
  },
  "Family": {
    emoji: "👨‍👩‍👧",
    words: [
      ["nanay","mother"],["tatay","father"],["ate","older sister"],["kuya","older brother"],
      ["lola","grandmother"],["lolo","grandfather"],["anak","son / daughter"],["kapatid","sibling"],
      ["asawa","spouse"],["tito","uncle"],["tita","aunt"],["pamangkin","niece / nephew"],
      ["apo","grandchild"],["pinsan","cousin"],["magulang","parent"]
    ]
  },
  "Food & Drink": {
    emoji: "🍚",
    words: [
      ["pagkain","food"],["tubig","water"],["kanin","cooked rice"],["tinapay","bread"],
      ["itlog","egg"],["isda","fish"],["manok","chicken"],["baboy","pig / pork"],
      ["gatas","milk"],["kape","coffee"],["asukal","sugar"],["asin","salt"],
      ["gulay","vegetable"],["prutas","fruit"],["saging","banana"],["mangga","mango"],
      ["mansanas","apple"],["kamatis","tomato"],["sibuyas","onion"],["bawang","garlic"],
      ["toyo","soy sauce"],["suka","vinegar"],["karne","meat"],["baka","cow / beef"],
      ["hipon","shrimp"],["pusit","squid"],["sabaw","soup / broth"],["ulam","main dish"],
      ["almusal","breakfast"],["tanghalian","lunch"],["hapunan","dinner"],["meryenda","snack"],
      ["masarap","delicious"],["gutom","hungry"],["uhaw","thirsty"],["busog","full (from eating)"],
      ["matamis","sweet"],["maalat","salty"],["maasim","sour"],["mapait","bitter"],
      ["maanghang","spicy"]
    ]
  },
  "Feelings & States": {
    emoji: "😊",
    words: [
      ["takot","fear / afraid"],["galit","anger / angry"],["tuwa","joy / delight"],["lungkot","sadness"],
      ["pagod","tired"],["antok","sleepy"],["inis","annoyed"],["selos","jealous"],
      ["hiya","shyness / embarrassment"],["gulat","surprised"],["sabik","eager / excited"],["lito","confused"],
      ["ginhawa","relief / comfort"],["nerbiyos","nervousness"],["sakit","pain / sickness"],["lasing","drunk"]
    ]
  },
  "Adjectives": {
    emoji: "✨",
    words: [
      ["maganda","beautiful"],["mabuti","good / fine"],["masaya","happy"],["malungkot","sad"],
      ["malaki","big"],["maliit","small"],["mainit","hot"],["malamig","cold"],
      ["bago","new"],["mabilis","fast"],["mabagal","slow"],["mahaba","long"],
      ["maikli","short (length)"],["mataas","tall / high"],["mababa","low / short"],["mabigat","heavy"],
      ["magaan","light (weight)"],["malinis","clean"],["marumi","dirty"],["mura","cheap"],
      ["mahal","expensive / dear"],["matanda","old (person)"],["payat","thin (person)"],["mataba","fat"],
      ["malakas","strong"],["mahina","weak"],["matalino","smart"],["matapang","brave"],
      ["mabait","kind"],["masungit","grumpy"],["tahimik","quiet"],["maingay","noisy"],
      ["mahirap","difficult / poor"],["madali","easy"],["masama","bad"],["basa","wet"],
      ["tuyo","dry"],["sarado","closed"]
    ]
  },
  "Verbs": {
    emoji: "🏃",
    words: [
      ["trabaho","work / job"],["nagtatrabaho","working"],["kumain","ate"],["uminom","drank"],
      ["matulog","to sleep"],["bumili","bought"],["magluto","to cook"],["maglaro","to play"],
      ["kumanta","sang"],["tumakbo","ran"],["maglakad","to walk"],["magsalita","to speak"],
      ["makinig","to listen"],["magbasa","to read"],["magsulat","to write"],["umuwi","to go home"],
      ["pumunta","went"],["maligo","to bathe"],["maghugas","to wash"],["maglinis","to clean"],
      ["mag-aral","to study"],["magturo","to teach"],["gumising","to wake up"],["umupo","to sit"],
      ["tumayo","to stand"],["umalis","to leave"],["dumating","to arrive"],["bumalik","to return"],
      ["magbigay","to give"],["kumuha","to get / take"],["maghanap","to look for"],["makita","to see"],
      ["marinig","to hear"],["umiyak","to cry"],["tumawa","to laugh"],["ngumiti","to smile"],
      ["sumigaw","to shout"],["maghintay","to wait"],["tumulong","to help"],["magtanong","to ask"],
      ["sumagot","to answer"],["magbayad","to pay"],["maglaba","to do laundry"],["mamili","to shop"],
      ["magmaneho","to drive"],["lumangoy","to swim"],["tumalon","to jump"],["humiga","to lie down"],
      ["magpahinga","to rest"],["mag-isip","to think"],["maalala","to remember"],["makalimutan","to forget"],
      ["magmahal","to love"],["magalit","to get angry"],["matakot","to be afraid"]
    ]
  },
  "Grammar Words": {
    emoji: "🔗",
    words: [
      ["at","and"],["pero","but"],["o","or"],["kung","if"],
      ["kapag","when / whenever"],["dahil","because"],["kasi","because (casual)"],["para","for / so that"],
      ["din","also / too"],["lang","only / just"],["ba","question marker"],["naman","on the other hand / also"],
      ["daw","they say / reportedly"]
    ]
  },
  "Useful Words": {
    emoji: "✅",
    words: [
      ["pwede","can / allowed"],["kailangan","need / must"],["dapat","should / ought"],["ayos","okay / fine"],
      ["tama","correct / right"],["mali","wrong"],["sobra","too much / excess"],["kulang","lacking / not enough"],
      ["sapat","enough"],["handa","ready"],["tapos","done / then"],["simula","start / beginning"],
      ["bahala na","come what may"],["medyo","somewhat / a bit"],["talaga","really / truly"]
    ]
  },
  "Body": {
    emoji: "💪",
    words: [
      ["kamay","hand"],["paa","foot"],["mata","eye"],["ilong","nose"],
      ["bibig","mouth"],["tenga","ear"],["ulo","head"],["puso","heart"],
      ["buhok","hair"],["ngipin","tooth"],["dila","tongue"],["leeg","neck"],
      ["balikat","shoulder"],["braso","arm"],["daliri","finger"],["tiyan","stomach"],
      ["likod","back"],["tuhod","knee"],["binti","leg"],["balat","skin"],
      ["dugo","blood"],["buto","bone"],["mukha","face"]
    ]
  },
  "House & Things": {
    emoji: "🏠",
    words: [
      ["bahay","house"],["mesa","table"],["upuan","chair"],["pinto","door"],
      ["bintana","window"],["kotse","car"],["pera","money"],["libro","book"],
      ["kusina","kitchen"],["banyo","bathroom"],["silid","room"],["sala","living room"],
      ["hagdan","stairs"],["bubong","roof"],["sahig","floor"],["dingding","wall"],
      ["kama","bed"],["unan","pillow"],["kumot","blanket"],["salamin","mirror / glasses"],
      ["ilaw","light"],["susi","key"],["plato","plate"],["baso","drinking glass"],
      ["kutsara","spoon"],["tinidor","fork"],["kutsilyo","knife"],["kaldero","cooking pot"],
      ["basurahan","trash can"],["sabon","soap"],["tuwalya","towel"],["orasan","clock"]
    ]
  },
  "People & Jobs": {
    emoji: "👪",
    words: [
      ["lalaki","man"],["babae","woman"],["bata","child"],["pamilya","family"],
      ["kaibigan","friend"],["guro","teacher"],["doktor","doctor"],["nars","nurse"],
      ["pulis","police officer"],["drayber","driver"],["magsasaka","farmer"],["mangingisda","fisherman"],
      ["tindera","vendor / shopkeeper"],["kusinero","cook / chef"],["estudyante","student"],["abogado","lawyer"],
      ["inhinyero","engineer"]
    ]
  },
  "Places": {
    emoji: "📍",
    words: [
      ["paaralan","school"],["palengke","market"],["simbahan","church"],["lungsod","city"],
      ["bayan","town"],["probinsya","province"],["kalye","street"],["daan","road / way"],
      ["tulay","bridge"],["ospital","hospital"],["botika","pharmacy"],["bangko","bank"],
      ["tindahan","store"],["paliparan","airport"],["parke","park"],["opisina","office"],
      ["bukid","farm / field"],["tabing-dagat","beach"]
    ]
  },
  "Directions & Position": {
    emoji: "🧭",
    words: [
      ["kanan","right"],["kaliwa","left"],["diretso","straight ahead"],["taas","up / top"],
      ["baba","down / bottom"],["loob","inside"],["labas","outside"],["harap","front"],
      ["likuran","behind / rear"],["gitna","middle / center"],["tabi","side / beside"],["itaas","above"],
      ["ibaba","below"],["sulok","corner"],["pagitan","between"]
    ]
  },
  "Colors": {
    emoji: "🎨",
    words: [
      ["pula","red"],["asul","blue"],["dilaw","yellow"],["berde","green"],
      ["itim","black"],["puti","white"],["kayumanggi","brown"],["rosas","pink"],
      ["kahel","orange (color)"],["lila","purple"],["kulay-abo","gray"]
    ]
  },
  "Clothing": {
    emoji: "👕",
    words: [
      ["damit","clothes"],["sapatos","shoes"],["tsinelas","slippers"],["pantalon","pants"],
      ["palda","skirt"],["sumbrero","hat"],["medyas","socks"],["sinturon","belt"],
      ["relo","watch (wrist)"]
    ]
  },
  "Money & Shopping": {
    emoji: "🛒",
    words: [
      ["presyo","price"],["bayad","payment"],["sukli","change (money back)"],["barya","coins"],
      ["diskwento","discount"],["utang","debt / credit"],["resibo","receipt"],["bili","purchase / buy"],
      ["benta","sale / sell"],["kita","earnings / income"],["gastos","expense"],["ipon","savings"],
      ["bayarin","bill / due payment"]
    ]
  },
  "Travel & Transport": {
    emoji: "🚍",
    words: [
      ["sasakyan","vehicle"],["dyip","jeepney"],["bus","bus"],["tren","train"],
      ["eroplano","airplane"],["barko","ship"],["bangka","boat"],["bisikleta","bicycle"],
      ["motorsiklo","motorcycle"],["traysikel","tricycle"],["biyahe","trip / travel"],["pamasahe","fare"],
      ["pasahero","passenger"],["tiket","ticket"],["bagahe","luggage"]
    ]
  },
  "Health & Sickness": {
    emoji: "🤒",
    words: [
      ["lagnat","fever"],["ubo","cough"],["sipon","colds / runny nose"],["sugat","wound"],
      ["gamot","medicine"],["pawis","sweat"],["luha","tears"],["hilo","dizziness"],
      ["pilay","sprain"],["bukol","lump / bump"],["paltos","blister"],["galos","scratch / graze"]
    ]
  },
  "Cooking": {
    emoji: "🍳",
    words: [
      ["luto","cooked"],["hilaw","raw / unripe"],["prito","fried"],["nilaga","boiled stew"],
      ["inihaw","grilled"],["ginisa","sautéed"],["hiwain","to slice"],["timpla","seasoning / mix"],
      ["sangkap","ingredient"],["takip","lid / cover"],["kawali","frying pan"],["sandok","ladle"],
      ["lutong-bahay","home-cooked"]
    ]
  },
  "School & Office": {
    emoji: "🏫",
    words: [
      ["aralin","lesson"],["takdang-aralin","homework"],["pagsusulit","exam / test"],["papel","paper"],
      ["lapis","pencil"],["bolpen","ballpen"],["pisara","blackboard"],["kuwaderno","notebook"],
      ["klase","class"],["sagot","answer"],["tanong","question"],["proyekto","project"],
      ["grado","grade / level"],["pulong","meeting"]
    ]
  },
  "Sports & Hobbies": {
    emoji: "⚽",
    words: [
      ["laro","game / play"],["palakasan","sports"],["basketbol","basketball"],["bola","ball"],
      ["sayaw","dance"],["kanta","song"],["gitara","guitar"],["larawan","photo / picture"],
      ["pelikula","movie"],["ehersisyo","exercise"],["hilig","hobby / interest"],["libangan","pastime / leisure"]
    ]
  },
  "Nature & Animals": {
    emoji: "🌿",
    words: [
      ["aso","dog"],["pusa","cat"],["ulan","rain"],["hangin","wind / air"],
      ["apoy","fire"],["lupa","ground / earth"],["langit","sky"],["dagat","sea"],
      ["bundok","mountain"],["puno","tree"],["bulaklak","flower"],["ibon","bird"],
      ["daga","mouse / rat"],["ahas","snake"],["palaka","frog"],["gagamba","spider"],
      ["langgam","ant"],["lamok","mosquito"],["ipis","cockroach"],["kabayo","horse"],
      ["kalabaw","carabao / water buffalo"],["kambing","goat"],["butiki","house lizard / gecko"],["paru-paro","butterfly"],
      ["bagyo","storm / typhoon"],["kidlat","lightning"],["kulog","thunder"],["baha","flood"],
      ["lindol","earthquake"],["ulap","cloud"],["bituin","star"],["init","heat"],
      ["lamig","coldness"],["tag-ulan","rainy season"],["tag-init","hot season / summer"]
    ]
  },
  "Action Verbs II": {
    emoji: "🤸",
    words: [
      ["buksan","to open"],["isara","to close"],["itulak","to push"],["hilahin","to pull"],
      ["ilagay","to put"],["alisin","to remove"],["buhatin","to lift / carry"],["hawakan","to hold"],
      ["bitawan","to let go"],["bilangin","to count"],["sukatin","to measure"],["takpan","to cover"],
      ["punasan","to wipe"],["walisin","to sweep"]
    ]
  }
};
