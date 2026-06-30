// Audio. On WEB this is a faithful copy of the browser app (v1): Google Translate
// endpoint for Tagalog + the same hand-picked female English system voice, same
// fallback behavior. On NATIVE it uses expo-speech.
import { Platform } from "react-native";
import * as Speech from "expo-speech";

const isWeb = Platform.OS === "web";
const SS = (isWeb && typeof window !== "undefined") ? window.speechSynthesis : null;

// ---------- voice picking (verbatim from v1's pickVoice) ----------
let filVoice = null, enVoice = null, gttsOk = true, gttsFails = 0, currentAudio = null;
function pickVoice() {
  if (!SS) return;
  const vs = SS.getVoices();
  filVoice = vs.find(v => /^fil|^tl\b|tl[-_]|tagalog/i.test(v.lang) || /filipino|tagalog/i.test(v.name)) || null;
  const en = vs.filter(v => /^en[-_]/i.test(v.lang));
  enVoice =
    en.find(v => /samantha|ava|allison|susan|zoe|jenny|aria|google us english/i.test(v.name)) ||
    en.find(v => /female|woman|girl/i.test(v.name)) ||
    en.find(v => /en[-_]US/i.test(v.lang)) ||
    en[0] || null;
}
if (SS) { SS.onvoiceschanged = pickVoice; pickVoice(); }

// ---------- Tagalog ----------
// On localhost the Google endpoint 403s, so on web we PREFER the browser's own
// Filipino voice (Chrome ships "Google Filipino"), then fall back to the Google
// endpoint, then to a Google-TTS <audio>. macOS Safari has no Filipino voice —
// use Chrome.
export function speakTagalog(word) {
  if (isWeb) {
    // Google voice, but with NO referrer so localhost isn't rejected (the reason
    // the file:// HTML works and localhost didn't). Fall back to a system Filipino
    // voice if the request still fails.
    try {
      if (currentAudio) { currentAudio.pause(); currentAudio = null; }
      const url = "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=tl&q=" + encodeURIComponent(word);
      const a = new window.Audio();
      a.referrerPolicy = "no-referrer";
      a.src = url;
      currentAudio = a;
      a.play().catch(err => { if (!(err && err.name === "NotAllowedError")) webFilFallback(word); });
      a.onerror = () => webFilFallback(word);
    } catch { webFilFallback(word); }
    return;
  }
  Speech.stop();
  Speech.speak(word, { language: "fil-PH", rate: 0.9 });
}
function webFilFallback(word) {
  if (!filVoice) pickVoice();
  if (filVoice && SS) {
    SS.cancel();
    const u = new window.SpeechSynthesisUtterance(word);
    u.voice = filVoice; u.lang = filVoice.lang || "fil-PH"; u.rate = 0.85;
    SS.speak(u);
  }
}

// ---------- English (verbatim from v1's speakEnglish) ----------
export function speakEnglish(text) {
  const clean = text.replace(/\s*\/\s*/g, ", ").replace(/\(.*?\)/g, "");
  if (isWeb && SS) {
    const u = new window.SpeechSynthesisUtterance(clean);
    if (enVoice) u.voice = enVoice;
    u.lang = "en-US"; u.rate = 1.0; u.pitch = 1.3;
    SS.cancel(); SS.speak(u);
    return;
  }
  Speech.stop();
  Speech.speak(clean, { language: "en-US", rate: 1.0, pitch: 1.2 });
}

// ---------- reward chime (F5, same as v1's favorite) ----------
let actx = null;
export function rewardChime() {
  if (isWeb && (window.AudioContext || window.webkitAudioContext)) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t = actx.currentTime;
      [[698.46, 0.9, 0.24], [698.46 * 4, 0.45, 0.04]].forEach(([f, dur, vol]) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(vol, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur + 0.05);
      });
    } catch {}
  }
}
