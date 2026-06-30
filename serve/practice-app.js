// Kaipher Practice — app logic
// Word data lives in practicetag.js (WORD_CATEGORIES); context phrases in phrases.js (PHRASES).

// ---------- data ----------
const LS = { custom: "tq_custom", prog: "tq_progress", best: "tq_best" };
const DAILY_KEY = "tq_daily", STREAK_KEY = "tq_streak", NEWCAP_KEY = "tq_newCap";
const REV_KEY = "tq_reverse", PHRASE_KEY = "tq_phrases", DECK_KEY = "tq_deck";
let customWords = JSON.parse(localStorage.getItem(LS.custom) || "[]");
const PHRASE_DATA = (typeof PHRASES !== "undefined") ? PHRASES : {};

// ---------- deck: words vs sentences ----------
// Two parallel decks share one engine. Words live in WORD_CATEGORIES (practicetag.js);
// everyday sentences in SENTENCE_CATEGORIES (practicesentences.js). Progress keys never collide
// because the Tagalog text differs. Custom "My Words" entries belong to the words deck only.
const SENTENCE_CATS = (typeof SENTENCE_CATEGORIES !== "undefined") ? SENTENCE_CATEGORIES : {};
const CONJ_CATS = (typeof CONJUGATION_CATEGORIES !== "undefined") ? CONJUGATION_CATEGORIES : {};
const JUDGE_CATS = (typeof JUDGE_CATEGORIES !== "undefined") ? JUDGE_CATEGORIES : {};
const DECKS = { words: () => WORD_CATEGORIES, sentences: () => SENTENCE_CATS, conj: () => CONJ_CATS, judge: () => JUDGE_CATS };
let deckMode = localStorage.getItem(DECK_KEY) || "words"; // "words" | "sentences" | "conj" | "judge"
if (!DECKS[deckMode]) deckMode = "words";
function inSentences() { return deckMode === "sentences"; }
function inJudge() { return deckMode === "judge"; }
function deckUnit() { return inJudge() ? "sentences" : inSentences() ? "phrases" : "words"; }
let CATS = DECKS[deckMode]();
function allWords() {
  const out = [];
  Object.values(CATS).forEach(c => out.push(...c.words));
  if (deckMode === "words") out.push(...customWords);
  return out;
}
// Map each word -> its group (category) so multiple-choice decoys can be drawn
// from RELATED words even when practicing the one big "All Words" list.
let GROUP_OF = {};
function rebuildGroupIndex() {
  GROUP_OF = {};
  Object.entries(CATS).forEach(([name, c]) => c.words.forEach(([tl]) => { GROUP_OF[tl] = name; }));
}
rebuildGroupIndex();
function setDeck(mode) {
  if (mode === deckMode || !DECKS[mode]) return;
  deckMode = mode;
  localStorage.setItem(DECK_KEY, mode);
  CATS = DECKS[mode]();
  rebuildGroupIndex();
  updateDeckToggle();
  renderHome();
}
function updateDeckToggle() {
  const ids = { words: "deckWords", sentences: "deckSentences", conj: "deckConj", judge: "deckJudge" };
  Object.entries(ids).forEach(([mode, id]) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("active", deckMode === mode);
  });
}

// ---------- state ----------
let progress = JSON.parse(localStorage.getItem(LS.prog) || "{}"); // {key: {ok, miss, box, due}}
let score = 0, streak = 0, best = +(localStorage.getItem(LS.best) || 0);
let words = [], current = null, answered = false, currentCat = null;
let sessionMode = "normal"; // "normal" | "reviewDue" | "trouble"
let sessionGoal = 0, sessionDone = 0, normalDoneShown = false;

// ---------- settings ----------
function reverseOn() { return localStorage.getItem(REV_KEY) !== "off"; }   // default on
function phrasesOn() { return localStorage.getItem(PHRASE_KEY) !== "off"; } // default on
// "Words in play": how many un-mastered words may be active at once. A new word
// is introduced only when fewer than this are still being learned (chunked SRS).
function newCap() { return +(localStorage.getItem(NEWCAP_KEY) || 3); }
const MASTER_AT = 3; // correct answers needed before a word counts as mastered

// ---------- daily stats + streak ----------
function todayStr() { return new Date().toLocaleDateString("en-CA"); }
function getDaily() {
  let d = JSON.parse(localStorage.getItem(DAILY_KEY) || "null");
  if (!d || d.date !== todayStr()) d = { date: todayStr(), answeredN: 0, newSeen: 0, correct: 0, wrong: 0, trouble: {} };
  return d;
}
function saveDaily(d) { localStorage.setItem(DAILY_KEY, JSON.stringify(d)); }
function getStreak() { return JSON.parse(localStorage.getItem(STREAK_KEY) || "null") || { count: 0, last: null }; }
function bumpStreak() {
  const t = todayStr();
  const s = getStreak();
  if (s.last === t) return s;
  const y = new Date(Date.now() - 864e5).toLocaleDateString("en-CA");
  s.count = (s.last === y) ? s.count + 1 : 1;
  s.last = t;
  localStorage.setItem(STREAK_KEY, JSON.stringify(s));
  return s;
}

// ---------- audio: reward sounds ----------
let actx;
function ctx() { if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)(); return actx; }
function chimeNote(freq, dt, dur, vol) {
  const c = ctx(), t = c.currentTime + dt;
  [[1, vol], [4, vol * 0.15]].forEach(([mult, v]) => {
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sine"; o.frequency.value = freq * mult;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(v, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  });
}
function bellStrike(freq, dt, dur, vol) {
  const c = ctx(), t = c.currentTime + dt;
  [[1, vol], [2.0, vol * 0.35], [2.92, vol * 0.2], [4.2, vol * 0.08]].forEach(([mult, v]) => {
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sine"; o.frequency.value = freq * mult;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(v, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  });
}
function wuf(dt) {
  const c = ctx(), t = c.currentTime + dt;
  const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
  o.type = "triangle";
  o.frequency.setValueAtTime(220, t);
  o.frequency.exponentialRampToValueAtTime(110, t + 0.12);
  f.type = "lowpass"; f.frequency.value = 600;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.3, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
  o.connect(f).connect(g).connect(c.destination);
  o.start(t); o.stop(t + 0.2);
}
function buzz() {
  const c = ctx(), t = c.currentTime;
  const o = c.createOscillator(), g = c.createGain();
  o.type = "sawtooth"; o.frequency.setValueAtTime(140, t);
  g.gain.setValueAtTime(0.12, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + .25);
  o.connect(g).connect(c.destination); o.start(t); o.stop(t + .3);
}

// reverb: generated impulse response fed through a ConvolverNode (built once, reused)
function getReverb() {
  const c = ctx();
  if (!getReverb.node) {
    const len = Math.floor(c.sampleRate * 2.5);
    const buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.5);
    }
    const conv = c.createConvolver(); conv.buffer = buf;
    const wet = c.createGain(); wet.gain.value = 0.6;
    conv.connect(wet); wet.connect(c.destination);
    getReverb.node = conv;
  }
  return getReverb.node;
}
function singleBellReverb() {
  // Properly tuned MAJOR-THIRD bell, prime = A5 (880 Hz).
  // Campanology ratios hum:prime:tierce:quint:nominal = 0.5 : 1 : 1.25 : 1.5 : 2
  // (tierce raised from the traditional 1.2 minor third to 1.25 major third = brighter/happier).
  // All partials ≤ 1760 Hz — below the 2–4 kHz sharpness/annoyance band (Zwicker/Fastl).
  // Decay mirrors a physical bell: low partials ring longest, high partials die first.
  const c = ctx(), t = c.currentTime, conv = getReverb();
  const PRIME = 880;
  // [ratio, amplitude, decay seconds]
  [
    [0.5,  0.10, 2.2],  // hum
    [1.0,  0.22, 1.6],  // prime
    [1.25, 0.12, 1.3],  // tierce (major third)
    [1.5,  0.07, 1.0],  // quint
    [2.0,  0.10, 0.7]   // nominal (strike brightness)
  ].forEach(([mult, v, dur]) => {
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sine"; o.frequency.value = PRIME * mult;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(v, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(c.destination); // dry
    g.connect(conv);          // wet
    o.start(t); o.stop(t + dur + 0.1);
  });
}

function dingSound() {
  // Service-desk "ding!": small metal dome — high pitch, fast strike, quick decay.
  // The shimmer comes from paired oscillators a few Hz apart (slow beating),
  // plus inharmonic upper partials typical of struck metal.
  const c = ctx(), t = c.currentTime, conv = getReverb();
  const F = 1175; // D6 — diner counter bell: bigger dome, lower pitch, longer ring
  // [freq, amplitude, decay]
  [
    [F,        0.22, 1.4],  // fundamental, rings out
    [F + 6,    0.18, 1.4],  // detuned pair -> ~6 Hz wobble (the "driiing" shimmer)
    [F * 2.15, 0.08, 0.7],  // inharmonic body partial
    [F * 3.4,  0.04, 0.35]  // strike sparkle, dies fast
  ].forEach(([freq, v, dur]) => {
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(v, t + 0.004); // very fast strike
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(c.destination);
    g.connect(conv);
    o.start(t); o.stop(t + dur + 0.1);
  });
}

// ---------- win sound settings (dropdown + custom uploads) ----------
const SOUND_KEY = "tq_winSound";
const BUILTIN_SOUNDS = {};
const BUILTIN_GROUPS = {};
// ---------- generated sound catalog: pings, dings, doorbells, rings, bells, chimes… ----------
const NOTES = { G4: 392.0, A4: 440.0, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
  A5: 880.0, C6: 1046.5, D6: 1174.66, E6: 1318.5, G6: 1567.98, A6: 1760.0, C7: 2093.0, E7: 2637.0 };
function _osc(f, dt, dur, vol, wet) {
  const c = ctx(), t = c.currentTime + dt, conv = getReverb();
  const o = c.createOscillator(), g = c.createGain();
  o.type = "sine"; o.frequency.value = f;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(c.destination);
  if (wet) g.connect(conv);
  o.start(t); o.stop(t + dur + 0.1);
}
const _ping = f => () => { _osc(f, 0, 0.35, 0.2, true); _osc(f * 3, 0, 0.18, 0.04, true); };
const _dingv = (f, beat, dur) => () => {
  _osc(f, 0, dur, 0.2, true); _osc(f + beat, 0, dur, 0.16, true);
  _osc(f * 2.15, 0, dur * 0.5, 0.07, true); _osc(f * 3.4, 0, dur * 0.25, 0.03, true);
};
const _doorbell = (f2, three) => () => { // classic ding-dong: major third above key, then key
  const f1 = f2 * 1.25;
  const note = (f, dt, v) => { _osc(f, dt, 0.9, v, true); _osc(f * 2, dt, 0.5, v * 0.2, true); };
  note(f1, 0, 0.2);
  if (three) { note(f1, 0.35, 0.16); note(f2, 0.7, 0.2); }
  else note(f2, 0.45, 0.2);
};
const _ring = (f, am, dur, bursts) => () => { // telephone-style trill (amplitude-modulated)
  const c = ctx(), conv = getReverb();
  for (let b = 0; b < bursts; b++) {
    const t0 = c.currentTime + b * (dur + 0.22);
    const o = c.createOscillator(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain(), env = c.createGain();
    o.type = "sine"; o.frequency.value = f;
    lfo.type = "square"; lfo.frequency.value = am;
    lg.gain.value = 0.085; g.gain.value = 0.1;
    lfo.connect(lg); lg.connect(g.gain);
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.linearRampToValueAtTime(1, t0 + 0.02);
    env.gain.setValueAtTime(1, t0 + dur - 0.05);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(env); env.connect(c.destination); env.connect(conv);
    o.start(t0); o.stop(t0 + dur + 0.05); lfo.start(t0); lfo.stop(t0 + dur + 0.05);
  }
};
const _bellv = (f, minor) => () => {
  const tierce = minor ? 1.2 : 1.25;
  [[0.5, 0.10, 2.2], [1, 0.22, 1.6], [tierce, 0.12, 1.3], [1.5, 0.07, 1.0], [2, 0.10, 0.7]]
    .forEach(([m, v, d]) => _osc(f * m, 0, d, v, true));
};
const _chime = (f, iv) => () => { chimeNote(f, 0, 0.45, 0.2); chimeNote(f * iv, 0.14, 0.6, 0.2); };
const _marimba = f => () => chimeNote(f, 0, 0.3, 0.25);
const _pop = f => () => {
  const c = ctx(), t = c.currentTime;
  const o = c.createOscillator(), g = c.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(f, t);
  o.frequency.exponentialRampToValueAtTime(f * 2.2, t + 0.07);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.25, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.15);
};
const _sparkle = f => () => [1, 1.25, 1.5, 2].forEach((m, i) => chimeNote(f * m, i * 0.07, 0.3, 0.16));
function addSoundGroup(label, entries) {
  BUILTIN_GROUPS[label] = entries.map(e => e[0]);
  entries.forEach(([n, fn]) => BUILTIN_SOUNDS[n] = fn);
}
// SINGLE SOUNDS ONLY — every entry is one strike, never a sequence.
// Chime: soft single strike with a faint high shimmer (like "Chime F5 (single)").
const _chimeSingle = f => () => { _osc(f, 0, 0.9, 0.24, true); _osc(f * 4, 0, 0.45, 0.04, true); };
// Ding: one bright, short strike — snappier and higher-decay than a chime.
const _dingSingle = f => () => { _osc(f, 0, 0.5, 0.24, true); _osc(f * 2.6, 0, 0.18, 0.05, true); };
const TONE_NOTES = ["G4","A4","C5","D5","E5","F5","G5","A5","C6","D6","E6","G6","A6","C7","E7"];
// single chimes (keep "Chime F5 (single)" name EXACT so the current selection survives)
addSoundGroup("Chimes", TONE_NOTES.map(n => ["Chime " + n + " (single)", _chimeSingle(NOTES[n])]));
// single dings
addSoundGroup("Dings", TONE_NOTES.map(n => ["Ding " + n + " (single)", _dingSingle(NOTES[n])]));

let winSoundName = localStorage.getItem(SOUND_KEY) || "Chime F5 (single)";
let customSounds = {}; // name -> Blob

function openSoundDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open("kaipher-practice", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("sounds", { keyPath: "name" });
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}
async function loadCustomSounds() {
  try {
    const db = await openSoundDB();
    const rows = await new Promise((res, rej) => {
      const r = db.transaction("sounds").objectStore("sounds").getAll();
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
    customSounds = {};
    rows.forEach(r => customSounds[r.name] = r.blob);
  } catch (e) { console.warn("IndexedDB unavailable:", e); }
  renderSoundSelect();
}
async function saveCustomSound(name, blob) {
  const db = await openSoundDB();
  await new Promise((res, rej) => {
    const tx = db.transaction("sounds", "readwrite");
    tx.objectStore("sounds").put({ name, blob });
    tx.oncomplete = res; tx.onerror = () => rej(tx.error);
  });
  customSounds[name] = blob;
}
async function deleteCustomSound(name) {
  const db = await openSoundDB();
  await new Promise((res, rej) => {
    const tx = db.transaction("sounds", "readwrite");
    tx.objectStore("sounds").delete(name);
    tx.oncomplete = res; tx.onerror = () => rej(tx.error);
  });
  delete customSounds[name];
}
function renderSoundSelect() {
  const sel = document.getElementById("soundSelect");
  sel.innerHTML = "";
  const all = [...Object.keys(BUILTIN_SOUNDS), ...Object.keys(customSounds)];
  if (!all.includes(winSoundName)) winSoundName = "Chime F5 (single)";
  if (Object.keys(customSounds).length) {
    const og = document.createElement("optgroup");
    og.label = "My Sounds";
    Object.keys(customSounds).forEach(n => {
      const o = document.createElement("option");
      o.value = n; o.textContent = n;
      og.appendChild(o);
    });
    sel.appendChild(og);
  }
  Object.entries(BUILTIN_GROUPS).forEach(([label, names]) => {
    const og = document.createElement("optgroup");
    og.label = label;
    names.forEach(n => {
      if (!BUILTIN_SOUNDS[n]) return;
      const o = document.createElement("option");
      o.value = n; o.textContent = n;
      og.appendChild(o);
    });
    sel.appendChild(og);
  });
  sel.value = winSoundName;
  document.getElementById("deleteSoundBtn").style.display = BUILTIN_SOUNDS[winSoundName] ? "none" : "inline-block";
}
let customAudioEl = null;
function correctSound() {
  if (BUILTIN_SOUNDS[winSoundName]) { BUILTIN_SOUNDS[winSoundName](); return; }
  const fallback = BUILTIN_SOUNDS["Chime F5 (single)"];
  const blob = customSounds[winSoundName];
  if (!blob) { fallback(); return; }
  if (customAudioEl) customAudioEl.pause();
  customAudioEl = new Audio(URL.createObjectURL(blob));
  customAudioEl.play().catch(() => fallback());
}

// ---------- TTS ----------
// Tagalog — primary: Google Translate TTS. Fallback: installed Filipino voice. Last resort: show text.
// English — light, young female voice where available, with raised pitch.
let filVoice = null, enVoice = null;
let gttsOk = true;
function pickVoice() {
  const vs = speechSynthesis.getVoices();
  filVoice = vs.find(v => /^fil|^tl\b|tl[-_]|tagalog/i.test(v.lang) || /filipino|tagalog/i.test(v.name)) || null;
  const en = vs.filter(v => /^en[-_]/i.test(v.lang));
  enVoice =
    en.find(v => /samantha|ava|allison|susan|zoe|jenny|aria|google us english/i.test(v.name)) ||
    en.find(v => /female|woman|girl/i.test(v.name)) ||
    en.find(v => /en[-_]US/i.test(v.lang)) ||
    en[0] || null;
  updateVoiceNote();
}
function updateVoiceNote() {
  const note = document.getElementById("voiceNote");
  let txt = gttsOk ? "Tagalog: Google Translate (online)" :
    filVoice ? "Tagalog: " + filVoice.name : "⚠️ No Tagalog audio — showing words as text";
  if (enVoice) txt += " · English: " + enVoice.name;
  note.textContent = txt;
}
speechSynthesis.onvoiceschanged = pickVoice;
pickVoice();

let currentAudio = null;
let gttsFails = 0; // consecutive Google-TTS failures; only give up after several in a row
function speakFallback(word) {
  if (filVoice) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.voice = filVoice; u.lang = filVoice.lang; u.rate = 0.85;
    speechSynthesis.speak(u);
  } else {
    showPrompt(true);
  }
}
function speak(word) {
  if (gttsOk) {
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    const url = "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=tl&q=" + encodeURIComponent(word);
    const a = new Audio(); a.referrerPolicy = "no-referrer"; a.src = url;
    currentAudio = a;
    const onFail = err => {
      if (err && err.name === "NotAllowedError") return; // autoplay block, not a real failure
      // one blip shouldn't kill audio for the whole session: fall back for THIS word,
      // keep trying Google on the next one, and only latch off after 3 in a row.
      if (++gttsFails >= 3) { gttsOk = false; updateVoiceNote(); }
      speakFallback(word);
    };
    a.addEventListener("playing", () => { gttsFails = 0; }); // success resets the counter
    a.play().then(() => { gttsFails = 0; }).catch(onFail);
    a.onerror = () => onFail({});
    return;
  }
  if (filVoice) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.voice = filVoice; u.lang = filVoice.lang; u.rate = 0.85;
    speechSynthesis.speak(u);
    return;
  }
  showPrompt(true);
}
function speakEnglish(text) {
  const u = new SpeechSynthesisUtterance(text.replace(/\s*\/\s*/g, ", ").replace(/\(.*?\)/g, ""));
  if (enVoice) u.voice = enVoice;
  u.lang = "en-US";
  u.rate = 1.0;
  u.pitch = 1.3; // lighter / younger
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

// ---------- SRS: Leitner boxes (items = forward "tl" and reverse "rev:tl") ----------
const SRS_INTERVALS = [
  30 * 1000,                 // box 0: 30 sec (just missed)
  10 * 60 * 1000,            // box 1: 10 min
  60 * 60 * 1000,            // box 2: 1 hour
  24 * 60 * 60 * 1000,       // box 3: 1 day
  3 * 24 * 60 * 60 * 1000,   // box 4: 3 days
  7 * 24 * 60 * 60 * 1000    // box 5: 1 week
];
function quizItems(wordList) {
  // judge deck: each item is [sentence, isGood, explanation]; never reversed
  if (inJudge()) {
    return wordList.map(([tl, good, expl]) => ({ tl, good, expl, key: tl, rev: false, judge: true }));
  }
  const rev = reverseOn();
  const items = [];
  wordList.forEach(([tl, en]) => {
    items.push({ tl, en, key: tl, rev: false });
    if (rev) items.push({ tl, en, key: "rev:" + tl, rev: true });
  });
  return items;
}
function isDueKey(key) {
  const p = progress[key];
  return p && p.due !== undefined && p.due <= Date.now();
}
function dueCount(wordList) { return quizItems(wordList).filter(it => isDueKey(it.key)).length; }
function srsCorrect(p) {
  p.box = Math.min((p.box || 0) + 1, 5);
  p.due = Date.now() + SRS_INTERVALS[p.box];
}
function srsWrong(p) {
  p.box = 0;
  p.due = Date.now() + SRS_INTERVALS[0];
}
function dueItems(wl) { return quizItems(wl).filter(it => isDueKey(it.key)); }
function troubleWords() {
  // weak spots: missed at least twice and missed at least as often as gotten right
  return allWords().filter(([tl]) => { const p = progress[tl]; return p && p.miss >= 2 && p.miss >= (p.ok || 0); });
}
function pickItem() {
  const items = quizItems(words);
  // review-all-due mode: serve only due items, nothing else
  if (sessionMode === "reviewDue") {
    const d = items.filter(it => isDueKey(it.key));
    return d.length ? d[Math.floor(Math.random() * d.length)] : null;
  }
  // 1) due reviews first
  const due = items.filter(it => isDueKey(it.key));
  if (due.length) return due[Math.floor(Math.random() * due.length)];
  // 2) introduce a NEW word only when fewer than N are still being learned.
  // This is the "3 at a time" chunk: you drill a small active set via spaced
  // repetition; each time you master one, the next word in the list unlocks.
  // New words enter in list order, so every word gets its own question in turn.
  const activeUnmastered = items.filter(it => {
    const p = progress[it.key];
    return p && (p.ok || 0) < MASTER_AT;
  }).length;
  const unseen = items.filter(it => !progress[it.key]);
  if (unseen.length && activeUnmastered < newCap()) {
    return unseen[0];
  }
  // 3) practice ahead on seen items (or unseen if literally nothing has been seen)
  const seen = items.filter(it => progress[it.key]);
  const pool = seen.length ? seen : items;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---------- typed recall mode (toggleable) ----------
const MODE_KEY = "tq_answerMode", API_KEY = "tq_apiKey";
let answerMode = localStorage.getItem(MODE_KEY) || "choice"; // "choice" | "typed"
function setAnswerMode(mode) {
  answerMode = mode;
  localStorage.setItem(MODE_KEY, mode);
  document.getElementById("modeBtn").textContent = mode === "typed" ? "⌨️ Typed: ON" : "⌨️ Typed: off";
  document.getElementById("modeSelect").value = mode;
}
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}
function normAnswer(s) {
  return s.toLowerCase().trim().replace(/[.,!?'"]/g, "").replace(/\(.*?\)/g, "").replace(/^(a|an|the|to) /, "").trim();
}
function checkTypedLocal(input, target) {
  const given = normAnswer(input);
  if (!given) return false;
  const accepted = target.split("/").map(normAnswer).concat([normAnswer(target)]);
  return accepted.some(a => a === given || (a.length > 3 && levenshtein(a, given) <= 1));
}
async function haikuJudge(tl, en, input, rev) {
  const key = localStorage.getItem(API_KEY);
  if (!key) return false;
  const q = rev
    ? 'The English word/phrase "' + en + '" translates to Tagalog as "' + tl + '". A student answered: "' + input + '". Is that an acceptable Tagalog translation (close variants and synonyms count, unrelated words do not)? Reply with only YES or NO.'
    : 'The Tagalog word "' + tl + '" means "' + en + '". A student translating it to English answered: "' + input + '". Is that an acceptable translation (synonyms and close variations count, unrelated words do not)? Reply with only YES or NO.';
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 5,
        messages: [{ role: "user", content: q }]
      })
    });
    const d = await r.json();
    return /yes/i.test((d.content && d.content[0] && d.content[0].text) || "");
  } catch (e) { console.warn("Haiku judge failed:", e); return false; }
}
async function submitTyped() {
  if (answered || !current) return;
  const input = document.getElementById("typedInput").value;
  if (!input.trim()) return;
  answered = true;
  document.getElementById("typedInput").disabled = true;
  document.getElementById("typedSubmit").disabled = true;
  const target = current.rev ? current.tl : current.en;
  let ok = checkTypedLocal(input, target);
  if (!ok && localStorage.getItem(API_KEY)) {
    document.getElementById("verdict").textContent = "🤔 checking…";
    ok = await haikuJudge(current.tl, current.en, input, current.rev);
  }
  finishAnswer(ok);
}

// ---------- speed round ----------
const SPEED_SECONDS = 60;
const SPEED_BEST_KEY = "tq_speedBest", SPEED_BEST_KEY_SENT = "tq_speedBestSentences";
function speedBestKey() { return inSentences() ? SPEED_BEST_KEY_SENT : SPEED_BEST_KEY; }
let speedMode = false, speedInterval = null, timeLeft = 0;
function speedDing() { bellStrike(1568, 0, 0.18, 0.2); }
function knownWords() {
  return allWords().filter(([tl]) => (progress[tl] || {}).ok >= 3);
}
function startSpeedRound() {
  const pool = knownWords();
  if (pool.length < 4) {
    alert("Speed Round unlocks once you've mastered at least 4 words (3 correct answers each). You have " + pool.length + ".");
    return;
  }
  speedMode = true;
  sessionMode = "normal";
  words = pool;
  currentCat = "⚡ Speed Round";
  document.getElementById("homeScreen").style.display = "none";
  document.getElementById("quizScreen").style.display = "flex";
  document.getElementById("sessBar").style.display = "none";
  document.getElementById("catLabel").textContent = "⚡ Speed Round (" + pool.length + " known words)";
  document.getElementById("subTitle").textContent = "Read fast, click fast — ding = point";
  document.getElementById("timeWrap").style.display = "inline";
  score = 0; streak = 0;
  timeLeft = SPEED_SECONDS;
  document.getElementById("timeLeft").textContent = timeLeft;
  document.getElementById("best").textContent = +(localStorage.getItem(speedBestKey()) || 0);
  clearInterval(speedInterval);
  speedInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timeLeft").textContent = timeLeft;
    if (timeLeft <= 0) endSpeedRound();
  }, 1000);
  document.getElementById("score").textContent = 0;
  nextQuestion();
}
function endSpeedRound() {
  clearInterval(speedInterval); speedInterval = null;
  const prevBest = +(localStorage.getItem(speedBestKey()) || 0);
  const isRecord = score > prevBest;
  if (isRecord) localStorage.setItem(speedBestKey(), score);
  const v = document.getElementById("verdict");
  v.textContent = "⏱ Time! " + score + " correct" + (isRecord ? " — NEW RECORD! 🎉" : " (best: " + Math.max(prevBest, score) + ")");
  v.className = "verdict good";
  if (isRecord) correctSound();
  const box = document.getElementById("choices");
  box.innerHTML = "";
  const again = document.createElement("button");
  again.className = "choice"; again.textContent = "⚡ Play again";
  again.onclick = startSpeedRound;
  const home = document.createElement("button");
  home.className = "choice"; home.textContent = "← Home";
  home.onclick = goHome;
  box.appendChild(again); box.appendChild(home);
  document.getElementById("wordDisplay").textContent = "";
  speedMode = false;
}

// ---------- home screen ----------
function masteryOf(wordList) {
  if (!wordList.length) return 0;
  const seen = wordList.filter(([tl]) => (progress[tl] || {}).ok >= 3).length;
  return Math.round(100 * seen / wordList.length);
}
function renderHome() {
  const grid = document.getElementById("catGrid");
  grid.innerHTML = "";
  const all = allWords();
  // learned banner: "X of Y learned" + streak + today's session stats
  const learned = knownWords().length;
  const due = dueCount(all);
  const d = getDaily();
  const s = getStreak();
  const trouble = Object.entries(d.trouble).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([w]) => w);
  let line2 = "🔥 " + s.count + "-day streak · today: " + d.answeredN + " answered (" + d.newSeen + " new, " + d.wrong + " missed)";
  if (trouble.length) line2 += " · trouble: " + trouble.join(", ");
  document.getElementById("learnedBanner").innerHTML =
    "📖 " + learned + " of " + all.length + " learned" +
    "<small>" + (due ? due + " card" + (due === 1 ? "" : "s") + " due for review" : "nothing due — learn something new") + "</small>" +
    "<small>" + line2 + "</small>";
  const makeCard = (name, emoji, wordList, isAll) => {
    const dEl = document.createElement("div");
    dEl.className = "cat-card" + (isAll ? " all" : "");
    const m = masteryOf(wordList);
    const nDue = dueCount(wordList);
    dEl.innerHTML = '<span class="emoji">' + emoji + '</span>' +
      '<div class="name">' + name + '</div>' +
      '<div class="count">' + wordList.length + ' ' + deckUnit() + ' · ' + m + '% mastered' +
      (nDue ? ' · <span style="color:var(--accent)">' + nDue + ' due</span>' : '') + '</div>' +
      '<div class="mastery"><div style="width:' + m + '%"></div></div>';
    dEl.onclick = () => startQuiz(name, wordList);
    grid.appendChild(dEl);
  };
  makeCard(inJudge() ? "All Sentences" : inSentences() ? "All Sentences" : "All Words",
    inJudge() ? "🤔" : inSentences() ? "💬" : "📚", all, true);
  // speed round card (not in judge mode — yes/no answers don't fit speed play)
  if (!inJudge()) {
    const known = knownWords().length;
    const sd = document.createElement("div");
    sd.className = "cat-card all";
    sd.innerHTML = '<span class="emoji">⚡</span><div class="name">Speed Round</div>' +
      '<div class="count">' + known + ' known ' + deckUnit() + ' · ' + SPEED_SECONDS + 's · no voices, just dings · best: ' +
      (+(localStorage.getItem(speedBestKey()) || 0)) + '</div>';
    sd.onclick = startSpeedRound;
    grid.appendChild(sd);
  }
  // review-all-due card (only when something is due)
  const totalDue = dueCount(all);
  if (totalDue) {
    const rv = document.createElement("div");
    rv.className = "cat-card all";
    rv.innerHTML = '<span class="emoji">🔁</span><div class="name">Review (all due)</div>' +
      '<div class="count"><span style="color:var(--accent)">' + totalDue + ' due</span> across all ' + deckUnit() + ' · clears your queue</div>';
    rv.onclick = startReviewAll;
    grid.appendChild(rv);
  }
  // trouble words card (only when enough weak spots exist)
  const tw = troubleWords();
  if (tw.length >= 4) {
    const tb = document.createElement("div");
    tb.className = "cat-card all";
    tb.innerHTML = '<span class="emoji">🩹</span><div class="name">Trouble Words</div>' +
      '<div class="count">' + tw.length + ' most-missed ' + deckUnit() + ' · drill your weak spots</div>';
    tb.onclick = startTrouble;
    grid.appendChild(tb);
  }
  // categories are listed in recommended learning order; number them and flag where to resume
  let upNextMarked = false;
  Object.entries(CATS).forEach(([name, c], i) => {
    let label = (i + 1) + ". " + name;
    if (!upNextMarked && masteryOf(c.words) < 80) {
      label = "👉 " + label;
      upNextMarked = true;
    }
    makeCard(label, c.emoji, c.words, false);
  });
  if (!inSentences() && customWords.length) makeCard("My Words", "✍️", customWords, false);
}
function startQuiz(name, wordList, mode) {
  currentCat = name;
  words = wordList.slice();
  sessionMode = mode || "normal";
  sessionDone = 0; normalDoneShown = false;
  // session goal: review/trouble = finite set; normal = today's due + planned new
  if (sessionMode === "reviewDue" || sessionMode === "trouble") {
    sessionGoal = dueItems(words).length || quizItems(words).length;
  } else {
    const items = quizItems(words);
    const due = items.filter(it => isDueKey(it.key)).length;
    const unseen = items.filter(it => !progress[it.key]).length;
    sessionGoal = due + Math.min(unseen, newCap());
  }
  document.getElementById("homeScreen").style.display = "none";
  document.getElementById("quizScreen").style.display = "flex";
  document.getElementById("catLabel").textContent = name;
  document.getElementById("subTitle").textContent = "Listen → answer → earn the reward";
  document.getElementById("sessBar").style.display = sessionGoal ? "block" : "none";
  updateSessBar();
  score = 0; streak = 0;
  updateStats();
  nextQuestion();
}
function updateSessBar() {
  const pct = sessionGoal ? Math.min(100, Math.round(100 * sessionDone / sessionGoal)) : 0;
  document.getElementById("sessFill").style.width = pct + "%";
}
function startReviewAll() {
  if (!dueItems(allWords()).length) { alert("Nothing is due for review right now — come back later or learn new words."); return; }
  startQuiz("🔁 Review (all due)", allWords(), "reviewDue");
}
function startTrouble() {
  const t = troubleWords();
  if (t.length < 4) { alert("Not enough trouble words yet — keep practicing and your most-missed words will collect here."); return; }
  startQuiz("🩹 Trouble Words", t, "trouble");
}
function finishSession(canContinue) {
  const d = getDaily();
  speechSynthesis.cancel();
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  document.getElementById("typedArea").style.display = "none";
  document.getElementById("playBtn").style.display = "none";
  document.getElementById("phraseBox").innerHTML = "";
  document.getElementById("sessFill").style.width = "100%";
  const wd = document.getElementById("wordDisplay");
  wd.className = "tl-word"; wd.textContent = "✅ Done!";
  const v = document.getElementById("verdict");
  const trouble = Object.entries(d.trouble).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([w]) => w);
  v.className = "verdict good";
  v.innerHTML = "Today: " + d.answeredN + " answered · " + d.newSeen + " new · " + d.wrong + " missed" +
    (trouble.length ? "<br><span style='color:var(--muted);font-weight:400'>trouble: " + trouble.join(", ") + "</span>" : "");
  correctSound();
  const box = document.getElementById("choices");
  box.style.display = "grid"; box.innerHTML = "";
  if (canContinue) {
    const cont = document.createElement("button");
    cont.className = "choice"; cont.textContent = "Keep practicing";
    cont.onclick = () => { normalDoneShown = true; document.getElementById("playBtn").style.display = "block"; nextQuestion(); };
    box.appendChild(cont);
  }
  const home = document.createElement("button");
  home.className = "choice"; home.textContent = "← Home";
  home.onclick = goHome;
  box.appendChild(home);
}
function goHome() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  speechSynthesis.cancel();
  speedMode = false;
  sessionMode = "normal";
  clearInterval(speedInterval); speedInterval = null;
  document.getElementById("timeWrap").style.display = "none";
  document.getElementById("sessBar").style.display = "none";
  document.getElementById("playBtn").style.display = "block";
  answered = false; current = null;
  document.getElementById("quizScreen").style.display = "none";
  document.getElementById("homeScreen").style.display = "block";
  document.getElementById("subTitle").textContent = "Pick a category to start";
  renderHome(); // refresh mastery bars + today's stats
}

// ---------- quiz flow ----------
function nextQuestion() {
  if (!words.length) return;
  // session completion checks (skip in speed round)
  if (!speedMode) {
    if (sessionMode === "reviewDue" && !dueItems(words).length) return finishSession(false);
    if (sessionMode === "trouble" && sessionDone >= sessionGoal) return finishSession(false);
    if (sessionMode === "normal" && !normalDoneShown && sessionGoal && sessionDone >= sessionGoal && !dueItems(words).length) {
      return finishSession(true);
    }
  }
  answered = false;
  document.getElementById("phraseBox").innerHTML = "";
  current = speedMode
    ? (() => { const [tl, en] = words[Math.floor(Math.random() * words.length)]; return { tl, en, key: tl, rev: false }; })()
    : pickItem();
  if (!current) return finishSession(sessionMode === "normal"); // nothing left to serve
  const { tl, en, rev } = current;
  const judge = inJudge() && !speedMode;
  const typed = !judge && answerMode === "typed" && !speedMode;
  document.getElementById("typedArea").style.display = typed ? "flex" : "none";
  document.getElementById("choices").style.display = typed ? "none" : "grid";
  document.getElementById("peekBtn").style.display = rev ? "none" : "inline-block";
  const box = document.getElementById("choices");
  box.innerHTML = "";
  if (judge) {
    [["✅ Makes sense", true], ["❌ Doesn't make sense", false]].forEach(([label, val]) => {
      const b = document.createElement("button");
      b.className = "choice"; b.textContent = label;
      b.onclick = () => answer(b, val);
      box.appendChild(b);
    });
  } else if (typed) {
    const inputEl = document.getElementById("typedInput");
    inputEl.value = ""; inputEl.disabled = false;
    inputEl.placeholder = rev ? "type the Tagalog word…" : "type the English meaning…";
    document.getElementById("typedSubmit").disabled = false;
    inputEl.focus();
  } else {
    // distractors: same side (English for forward, Tagalog for reverse)
    const answerOf = w => rev ? w[0] : w[1];
    const target = rev ? tl : en;
    const grp = GROUP_OF[tl];
    // Prefer decoys from the SAME group (related words) for sensible choices;
    // fall back to the whole deck, then everything, if a group is too small.
    let pool = words.filter(w => answerOf(w) !== target && GROUP_OF[w[0]] === grp);
    if (pool.length < 3) pool = words.filter(w => answerOf(w) !== target);
    if (pool.length < 3) pool = pool.concat(allWords().filter(w => answerOf(w) !== target));
    const distractors = [];
    while (distractors.length < 3 && pool.length) {
      const i = Math.floor(Math.random() * pool.length);
      const cand = answerOf(pool.splice(i, 1)[0]);
      if (!distractors.includes(cand)) distractors.push(cand);
    }
    // Fisher-Yates shuffle: every slot equally likely, so the correct answer
    // isn't biased toward any position (a .sort(()=>Math.random()-.5) is not uniform).
    const options = [...distractors, target];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    options.forEach(opt => {
      const b = document.createElement("button");
      b.className = "choice"; b.textContent = opt;
      b.onclick = () => answer(b, opt);
      box.appendChild(b);
    });
  }
  document.getElementById("verdict").textContent = "";
  document.getElementById("verdict").className = "verdict";
  const wd = document.getElementById("wordDisplay");
  if (speedMode) { showPrompt(true); return; } // speed round: read it, no voices
  if (judge) {
    // judge mode: show the sentence (reading helps grammar judgment) and speak it
    wd.textContent = tl; wd.className = "tl-word";
    document.getElementById("catLabel").textContent = currentCat + " · 🤔 makes sense?";
    speak(tl);
  } else if (rev) {
    // reverse card: show the English, produce the Tagalog
    wd.textContent = en; wd.className = "tl-word";
    document.getElementById("catLabel").textContent = currentCat + " · 🔁 reverse";
    speakEnglish(en);
  } else {
    document.getElementById("catLabel").textContent = currentCat;
    if (gttsOk || filVoice) { wd.textContent = "(listen first — tap 👁 to peek)"; wd.className = "hidden-word"; }
    else showPrompt(true);
    speak(tl);
  }
}
function showPrompt(force) {
  const wd = document.getElementById("wordDisplay");
  if (!current) { wd.textContent = ""; return; }
  wd.textContent = current.rev && !force ? current.en : current.tl;
  wd.className = "tl-word";
}
function answer(btn, choice) {
  if (answered) return;
  answered = true;
  // judge mode: choice is a boolean (does the sentence make sense?)
  if (current.judge) {
    const correct = choice === current.good;
    document.querySelectorAll(".choice").forEach(b => b.disabled = true);
    btn.classList.add(correct ? "correct" : "wrong");
    finishAnswer(correct);
    return;
  }
  const { tl, en, rev } = current;
  const target = rev ? tl : en;
  if (speedMode) {
    if (choice === target) { speedDing(); score++; btn.classList.add("correct"); }
    else {
      buzz(); btn.classList.add("wrong");
      document.querySelectorAll(".choice").forEach(b => { if (b.textContent === target) b.classList.add("correct"); });
    }
    document.querySelectorAll(".choice").forEach(b => b.disabled = true);
    document.getElementById("score").textContent = score;
    setTimeout(() => { if (speedMode) nextQuestion(); }, choice === target ? 200 : 600);
    return;
  }
  document.querySelectorAll(".choice").forEach(b => {
    b.disabled = true;
    if (b === btn && choice !== target) b.classList.add("wrong");
    if (b.textContent === target) b.classList.add(choice === target && b === btn ? "correct" : "correct");
  });
  finishAnswer(choice === target);
}
function finishAnswer(ok) {
  const { tl, en, key, rev } = current;
  const isNew = !progress[key];
  const p = progress[key] = progress[key] || { ok: 0, miss: 0 };
  const v = document.getElementById("verdict");
  showPrompt(true);
  // daily stats + streak
  const d = getDaily();
  d.answeredN++;
  if (isNew) d.newSeen++;
  let extraDelay = 0;
  const judge = !!current.judge;
  if (ok) {
    correctSound();
    p.ok++; score++; streak++; d.correct++;
    srsCorrect(p);
    if (streak > best) { best = streak; localStorage.setItem(LS.best, best); }
    if (judge) {
      v.textContent = (current.good ? "✅ Yes — it makes sense." : "✅ Right — it does NOT make sense.");
      v.className = "verdict good";
      document.getElementById("phraseBox").innerHTML = '<div class="phrase-en">' + current.expl + '</div>';
      extraDelay = 1400;
    } else {
      v.textContent = "✅ Correct! " + tl + " = " + en;
      v.className = "verdict good";
      if (rev) setTimeout(() => speak(tl), 800);        // reinforce the Tagalog you produced
      else setTimeout(() => speakEnglish(en), 800);     // say the meaning after the bell
      if (!rev && phrasesOn() && PHRASE_DATA[tl]) {
        const [ptl, pen] = PHRASE_DATA[tl];
        document.getElementById("phraseBox").innerHTML =
          '<div class="phrase-tl">' + ptl + '</div><div class="phrase-en">' + pen + '</div>';
        setTimeout(() => speak(ptl), 1800);
        extraDelay = 1600;
      }
    }
  } else {
    buzz();
    p.miss++; streak = 0; d.wrong++;
    d.trouble[tl] = (d.trouble[tl] || 0) + 1;
    srsWrong(p);
    if (judge) {
      v.textContent = (current.good ? "❌ Actually it DOES make sense." : "❌ Actually it does NOT make sense.");
      v.className = "verdict bad";
      document.getElementById("phraseBox").innerHTML = '<div class="phrase-en">' + current.expl + '</div>';
      extraDelay = 1800;
    } else {
      v.textContent = "❌ " + tl + " = " + en;
      v.className = "verdict bad";
    }
  }
  saveDaily(d);
  bumpStreak();
  localStorage.setItem(LS.prog, JSON.stringify(progress));
  sessionDone++;
  updateSessBar();
  updateStats();
  const inQuiz = () => document.getElementById("quizScreen").style.display !== "none";
  setTimeout(() => { if (inQuiz() && !speedMode) nextQuestion(); }, (ok ? 2400 : 2600) + extraDelay);
}
function updateStats() {
  document.getElementById("score").textContent = score;
  document.getElementById("streak").textContent = streak;
  document.getElementById("best").textContent = best;
}

// ---------- controls ----------
document.getElementById("playBtn").onclick = () => {
  if (!current) return;
  if (current.rev) speakEnglish(current.en); else speak(current.tl);
};
document.getElementById("modeBtn").onclick = () => {
  setAnswerMode(answerMode === "typed" ? "choice" : "typed");
  if (current && !answered && !speedMode) nextQuestion(); // re-deal in the new mode
};
document.getElementById("modeSelect").onchange = e => setAnswerMode(e.target.value);
document.getElementById("typedSubmit").onclick = submitTyped;
document.getElementById("typedInput").addEventListener("keydown", e => { if (e.key === "Enter") submitTyped(); });
document.getElementById("saveKeyBtn").onclick = () => {
  const k = document.getElementById("apiKeyInput").value.trim();
  if (k) { localStorage.setItem(API_KEY, k); alert("Key saved. Near-miss answers will now be judged by Haiku."); }
  else { localStorage.removeItem(API_KEY); alert("Key cleared — local checking only."); }
  document.getElementById("apiKeyInput").value = "";
};
document.getElementById("peekBtn").onclick = () => showPrompt(true);
document.getElementById("skipBtn").onclick = nextQuestion;
document.getElementById("homeBtn").onclick = goHome;
document.getElementById("settingsBtn").onclick = () => {
  const b = document.getElementById("settingsBox");
  b.style.display = b.style.display === "block" ? "none" : "block";
};
document.getElementById("soundSelect").onchange = e => {
  winSoundName = e.target.value;
  localStorage.setItem(SOUND_KEY, winSoundName);
  document.getElementById("deleteSoundBtn").style.display = BUILTIN_SOUNDS[winSoundName] ? "none" : "inline-block";
  correctSound(); // instant audition
};
document.getElementById("previewSoundBtn").onclick = correctSound;
document.getElementById("addSoundBtn").onclick = () => document.getElementById("soundFile").click();
document.getElementById("soundFile").onchange = async e => {
  const file = e.target.files[0];
  if (!file) return;
  let name = (prompt("Name this sound:", file.name.replace(/\.[^.]+$/, "")) || "").trim();
  if (!name) return;
  if (BUILTIN_SOUNDS[name]) { alert("That name is taken by a built-in sound."); return; }
  try {
    await saveCustomSound(name, file);
    winSoundName = name;
    localStorage.setItem(SOUND_KEY, name);
    renderSoundSelect();
    correctSound();
  } catch (err) { alert("Couldn't save sound: " + err); }
  e.target.value = "";
};
document.getElementById("deleteSoundBtn").onclick = async () => {
  if (BUILTIN_SOUNDS[winSoundName]) return;
  if (!confirm('Remove "' + winSoundName + '"?')) return;
  await deleteCustomSound(winSoundName);
  winSoundName = "Chime F5 (single)";
  localStorage.setItem(SOUND_KEY, winSoundName);
  renderSoundSelect();
};
// new settings: pacing, reverse cards, phrases
document.getElementById("newCapSelect").onchange = e => { localStorage.setItem(NEWCAP_KEY, e.target.value); renderHome(); };
document.getElementById("revSelect").onchange = e => { localStorage.setItem(REV_KEY, e.target.value); renderHome(); };
document.getElementById("phraseSelect").onchange = e => { localStorage.setItem(PHRASE_KEY, e.target.value); };
document.getElementById("deckWords").onclick = () => setDeck("words");
document.getElementById("deckSentences").onclick = () => setDeck("sentences");
document.getElementById("deckConj").onclick = () => setDeck("conj");
document.getElementById("deckJudge").onclick = () => setDeck("judge");
document.getElementById("importBtn").onclick = () => {
  const b = document.getElementById("importBox");
  b.style.display = b.style.display === "block" ? "none" : "block";
};
document.getElementById("importSave").onclick = () => {
  const lines = document.getElementById("importText").value.split("\n");
  let added = 0;
  const existing = allWords();
  lines.forEach(l => {
    const m = l.split("=");
    if (m.length === 2) {
      const tl = m[0].trim(), en = m[1].trim();
      if (tl && en && !existing.some(w => w[0] === tl)) { customWords.push([tl, en]); added++; }
    }
  });
  localStorage.setItem(LS.custom, JSON.stringify(customWords));
  document.getElementById("importText").value = "";
  document.getElementById("importBox").style.display = "none";
  renderHome();
  alert(added + " word(s) added to My Words.");
};

// ---------- backup: export/import everything ----------
const BACKUP_LS_KEYS = [LS.custom, LS.prog, LS.best, SPEED_BEST_KEY, SPEED_BEST_KEY_SENT, SOUND_KEY, MODE_KEY,
  DAILY_KEY, STREAK_KEY, NEWCAP_KEY, REV_KEY, PHRASE_KEY, DECK_KEY];
function blobToDataURL(blob) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result); r.onerror = () => rej(r.error);
    r.readAsDataURL(blob);
  });
}
document.getElementById("exportBtn").onclick = async () => {
  const data = { version: 2, exported: new Date().toISOString(), localStorage: {}, sounds: {} };
  BACKUP_LS_KEYS.forEach(k => { const v = localStorage.getItem(k); if (v !== null) data.localStorage[k] = v; });
  for (const [name, blob] of Object.entries(customSounds)) {
    data.sounds[name] = await blobToDataURL(blob);
  }
  const out = new Blob([JSON.stringify(data)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(out);
  a.download = "kaipher-practice-backup-" + new Date().toISOString().slice(0, 10) + ".json";
  a.click();
  URL.revokeObjectURL(a.href);
};
document.getElementById("importBackupBtn").onclick = () => document.getElementById("backupFile").click();
document.getElementById("backupFile").onchange = async e => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!data || !data.localStorage) throw new Error("not a Kaipher Practice backup");
    if (!confirm("Restore backup from " + (data.exported || "unknown date") + "? This overwrites current progress.")) return;
    Object.entries(data.localStorage).forEach(([k, v]) => localStorage.setItem(k, v));
    for (const [name, dataUrl] of Object.entries(data.sounds || {})) {
      const blob = await (await fetch(dataUrl)).blob();
      await saveCustomSound(name, blob);
    }
    alert("Backup restored.");
    location.reload();
  } catch (err) { alert("Couldn't import backup: " + err.message); }
  e.target.value = "";
};
document.getElementById("resetBtn").onclick = () => {
  if (confirm("Reset all progress and custom words?")) {
    [LS.custom, LS.prog, LS.best, SPEED_BEST_KEY, SPEED_BEST_KEY_SENT, DAILY_KEY, STREAK_KEY].forEach(k => localStorage.removeItem(k));
    location.reload();
  }
};

// ---------- init ----------
updateDeckToggle();
renderHome();
loadCustomSounds();
setAnswerMode(answerMode);
document.getElementById("newCapSelect").value = String(newCap());
document.getElementById("revSelect").value = reverseOn() ? "on" : "off";
document.getElementById("phraseSelect").value = phrasesOn() ? "on" : "off";
