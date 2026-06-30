import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { C } from "../theme";
import { DECKS, deckCategories, allWords } from "../lib/decks";
import { quizItems, dueCount, masteryPct, MASTER_AT } from "../lib/srs";

export default function Home({ deckKey, setDeckKey, progress, streak, onStart }) {
  const deck = DECKS[deckKey];
  const cats = deckCategories(deckKey);
  const all = allWords(deckKey);
  const learned = all.filter(([tl]) => (progress[tl] || {}).ok >= MASTER_AT).length;
  const allItems = quizItems(all, { judge: deck.judge });
  const due = dueCount(allItems, progress);

  let upNext = false;

  return (
    <ScrollView contentContainerStyle={s.scroll}>
      <Text style={s.h1}>Kaipher Practice</Text>

      <View style={s.toggle}>
        {Object.entries(DECKS).map(([k, d]) => (
          <TouchableOpacity key={k} onPress={() => setDeckKey(k)}
            style={[s.tab, deckKey === k && s.tabActive]}>
            <Text style={[s.tabTxt, deckKey === k && s.tabTxtActive]}>{d.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.banner}>
        <Text style={s.bannerBig}>📖 {learned} of {all.length} learned</Text>
        <Text style={s.bannerSmall}>
          {due ? `${due} due for review` : "nothing due — learn something new"} · 🔥 {streak}-day streak
        </Text>
      </View>

      {cats.map((c, i) => {
        const m = masteryPct(c.words, progress);
        const items = quizItems(c.words, { judge: deck.judge });
        const nDue = dueCount(items, progress);
        let label = `${i + 1}. ${c.name}`;
        if (!upNext && m < 80) { label = "👉 " + label; upNext = true; }
        return (
          <TouchableOpacity key={c.name} style={s.cat} onPress={() => onStart(c.name, c.words)}>
            <Text style={s.emoji}>{c.emoji}</Text>
            <Text style={s.catName}>{label}</Text>
            <Text style={s.catSub}>
              {c.words.length} {deck.unit} · {m}% mastered{nDue ? `  ·  ${nDue} due` : ""}
            </Text>
            <View style={s.barBg}><View style={[s.barFill, { width: `${m}%` }]} /></View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 48, alignItems: "center" },
  h1: { color: C.text, fontSize: 28, fontWeight: "800", marginVertical: 12 },
  toggle: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 6, marginBottom: 14 },
  tab: { backgroundColor: C.card, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  tabActive: { backgroundColor: C.accent },
  tabTxt: { color: C.muted, fontWeight: "700", fontSize: 14 },
  tabTxtActive: { color: "#fff" },
  banner: { backgroundColor: C.card, borderRadius: 14, padding: 14, width: "100%", maxWidth: 560, alignItems: "center", marginBottom: 14 },
  bannerBig: { color: C.text, fontSize: 18, fontWeight: "700" },
  bannerSmall: { color: C.muted, fontSize: 13, marginTop: 4 },
  cat: { backgroundColor: C.card, borderRadius: 14, padding: 16, width: "100%", maxWidth: 560, marginBottom: 12 },
  emoji: { fontSize: 30, textAlign: "center" },
  catName: { color: C.text, fontSize: 18, fontWeight: "700", textAlign: "center", marginTop: 4 },
  catSub: { color: C.muted, fontSize: 13, textAlign: "center", marginTop: 4 },
  barBg: { height: 6, backgroundColor: C.line, borderRadius: 3, marginTop: 8, overflow: "hidden" },
  barFill: { height: 6, backgroundColor: C.good, borderRadius: 3 }
});
