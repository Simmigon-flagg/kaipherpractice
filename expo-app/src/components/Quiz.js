import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { C } from "../theme";
import { DECKS, allWords, PHRASES } from "../lib/decks";
import { quizItems, pickItem, srsCorrect, srsWrong } from "../lib/srs";
import { speakTagalog, speakEnglish, rewardChime } from "../lib/audio";

export default function Quiz({ deckKey, catName, words, progress, onProgressChange, onHome }) {
  const deck = DECKS[deckKey];
  const reverse = deckKey !== "judge"; // reverse cards on word decks
  const items = useRef(quizItems(words, { reverse, judge: deck.judge })).current;
  const deckAll = useRef(allWords(deckKey)).current;

  const [current, setCurrent] = useState(null);
  const [options, setOptions] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [verdict, setVerdict] = useState("");
  const [verdictGood, setVerdictGood] = useState(true);
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState(0);
  const newSeenToday = useRef(0);
  const timer = useRef(null);

  useEffect(() => { next(); return () => clearTimeout(timer.current); }, []);

  function buildOptions(it) {
    if (deck.judge) return [["✅ Makes sense", true], ["❌ Doesn't make sense", false]];
    const target = it.rev ? it.tl : it.en;
    const answerOf = w => (it.rev ? w[0] : w[1]);
    let pool = deckAll.filter(w => answerOf(w) !== target);
    const decoys = [];
    while (decoys.length < 3 && pool.length) {
      const i = Math.floor(Math.random() * pool.length);
      const cand = answerOf(pool.splice(i, 1)[0]);
      if (!decoys.includes(cand)) decoys.push(cand);
    }
    const opts = [...decoys, target];
    for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
    return opts.map(o => [o, o]);
  }

  function next() {
    const it = pickItem(items, progress, { newSeenToday: newSeenToday.current });
    if (!it) { onHome(); return; }
    if (!progress[it.key]) newSeenToday.current++;
    setCurrent(it);
    setOptions(buildOptions(it));
    setAnswered(false); setVerdict(""); setReveal(false);
    // speak
    if (deck.judge) speakTagalog(it.tl);
    else if (it.rev) speakEnglish(it.en);
    else speakTagalog(it.tl);
  }

  function choose(val) {
    if (answered) return;
    setAnswered(true);
    const it = current;
    let ok;
    if (deck.judge) ok = val === it.good;
    else ok = val === (it.rev ? it.tl : it.en);

    const p = progress[it.key] || { ok: 0, miss: 0 };
    if (ok) { srsCorrect(p); rewardChime(); setScore(s => s + 1); }
    else srsWrong(p);
    progress[it.key] = p;
    onProgressChange(progress);

    setReveal(true);
    setVerdictGood(ok);
    if (deck.judge) {
      setVerdict((ok ? "✅ " : "❌ ") + (it.good ? "It makes sense." : "It does NOT make sense.") + "\n" + it.expl);
    } else {
      setVerdict((ok ? "✅ Correct!  " : "❌  ") + it.tl + " = " + it.en);
      if (ok && !it.rev && PHRASES[it.tl]) setVerdict(v => v + "\n“" + PHRASES[it.tl][0] + "” — " + PHRASES[it.tl][1]);
      if (ok && it.rev) speakTagalog(it.tl); else if (ok) speakEnglish(it.en);
    }
    timer.current = setTimeout(next, ok ? 2400 : 2800);
  }

  if (!current) return null;
  const prompt = deck.judge ? current.tl
    : current.rev ? current.en
    : (reveal ? current.tl : "🔊 listen…");

  return (
    <View style={s.wrap}>
      <View style={s.head}>
        <TouchableOpacity style={s.ghost} onPress={onHome}><Text style={s.ghostTxt}>← Home</Text></TouchableOpacity>
        <Text style={s.cat}>{catName}{deck.judge ? " · 🤔" : current.rev ? " · 🔁" : ""}</Text>
      </View>
      <Text style={s.score}>Score: {score}</Text>

      <View style={s.card}>
        <Text style={s.prompt}>{prompt}</Text>
        {options.map(([label, val], i) => {
          const target = deck.judge ? current.good : (current.rev ? current.tl : current.en);
          const isTarget = deck.judge ? (val === current.good) : (label === target);
          const showState = reveal && isTarget;
          return (
            <TouchableOpacity key={i} disabled={answered}
              style={[s.choice, showState && s.choiceGood]}
              onPress={() => choose(val)}>
              <Text style={[s.choiceTxt, showState && s.choiceTxtGood]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
        {!!verdict && <Text style={[s.verdict, { color: verdictGood ? C.good : C.bad }]}>{verdict}</Text>}
        <TouchableOpacity style={s.play}
          onPress={() => deck.judge ? speakTagalog(current.tl) : current.rev ? speakEnglish(current.en) : speakTagalog(current.tl)}>
          <Text style={s.playTxt}>🔊 Play</Text>
        </TouchableOpacity>
      </View>

      <View style={s.row}>
        {!deck.judge && !current.rev &&
          <TouchableOpacity style={s.ghost} onPress={() => setReveal(true)}><Text style={s.ghostTxt}>👁 Show</Text></TouchableOpacity>}
        <TouchableOpacity style={s.ghost} onPress={next}><Text style={s.ghostTxt}>Skip →</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", padding: 16 },
  head: { flexDirection: "row", alignItems: "center", gap: 10, width: "100%", maxWidth: 560, marginTop: 8 },
  cat: { color: C.text, fontWeight: "700", fontSize: 16 },
  score: { color: C.muted, fontSize: 16, marginVertical: 10 },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 24, width: "100%", maxWidth: 560 },
  prompt: { color: C.text, fontSize: 30, fontWeight: "800", textAlign: "center", marginBottom: 18 },
  choice: { backgroundColor: C.choice, borderRadius: 12, padding: 18, marginBottom: 10 },
  choiceGood: { backgroundColor: C.good },
  choiceTxt: { color: C.text, fontSize: 20, textAlign: "center" },
  choiceTxtGood: { color: "#10241a", fontWeight: "800" },
  verdict: { fontSize: 16, fontWeight: "700", textAlign: "center", marginTop: 12 },
  play: { backgroundColor: C.accent, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 24, alignSelf: "center", marginTop: 16 },
  playTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
  row: { flexDirection: "row", gap: 10, marginTop: 16 },
  ghost: { borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16 },
  ghostTxt: { color: C.muted, fontSize: 15 }
});
