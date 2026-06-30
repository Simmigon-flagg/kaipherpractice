import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, View, Text, StyleSheet } from "react-native";
import { C } from "./src/theme";
import Home from "./src/components/Home";
import Quiz from "./src/components/Quiz";
import { loadProgress, saveProgress, loadJSON, saveJSON, KEYS } from "./src/lib/storage";

export default function App() {
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState("home");
  const [deckKey, setDeckKey] = useState("words");
  const [progress, setProgress] = useState({});
  const [streak, setStreak] = useState(0);
  const [session, setSession] = useState({ catName: "", words: [] });

  useEffect(() => {
    (async () => {
      setProgress(await loadProgress());
      const s = await loadJSON(KEYS.STREAK, { count: 0, last: null });
      // bump streak on open (today vs yesterday)
      const today = new Date().toLocaleDateString("en-CA");
      if (s.last !== today) {
        const y = new Date(Date.now() - 864e5).toLocaleDateString("en-CA");
        s.count = s.last === y ? s.count + 1 : 1;
        s.last = today;
        saveJSON(KEYS.STREAK, s);
      }
      setStreak(s.count);
      setReady(true);
    })();
  }, []);

  function persist(p) { setProgress({ ...p }); saveProgress(p); }

  if (!ready) {
    return (
      <SafeAreaView style={s.app}><View style={s.center}><Text style={s.loading}>Loading…</Text></View></SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.app}>
      <StatusBar barStyle="light-content" />
      {screen === "home" ? (
        <Home
          deckKey={deckKey} setDeckKey={setDeckKey} progress={progress} streak={streak}
          onStart={(catName, words) => { setSession({ catName, words }); setScreen("quiz"); }}
        />
      ) : (
        <Quiz
          deckKey={deckKey} catName={session.catName} words={session.words}
          progress={progress} onProgressChange={persist} onHome={() => setScreen("home")}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  app: { flex: 1, backgroundColor: C.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loading: { color: C.muted, fontSize: 18 }
});
