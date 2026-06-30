// Kaipher Practice — daily PLAN (guided 10·25·15·10 session).
//
// One fixed loop you run every day. Each block has its own countdown; when the
// time is up you hear the reward sound and a "Next" button lights up — finish the
// card you're on, then advance. The plan auto-launches the right deck/quiz for
// each block, persists across reloads, and resets itself each new day.
//
// It leans entirely on functions already defined in practice-app.js
// (setDeck, startQuiz, startSpeedRound, startTrouble, startReviewAll, allWords,
//  knownWords, troubleWords, dueItems, goHome, correctSound) — no app logic is
// duplicated here, so future word/SRS changes flow through automatically.

(function () {
  const bar = document.getElementById("planBar");
  if (!bar) return; // plan UI not on this page

  // ---------- the daily loop ----------
  // Order matters: learn new -> use them in context -> shore up weak spots -> speed.
  const PLAN = [
    {
      id: "new", min: 10, emoji: "📚", name: "New words",
      tip: "Small fresh batch — listen, answer, lock them in.",
      run() { setDeck("words"); startQuiz("📚 New words", allWords(), "normal"); }
    },
    {
      id: "use", min: 25, emoji: "💬", name: "Sentences & conjugation",
      tip: "Put the words to work. Switch decks anytime.",
      run() { setDeck("sentences"); startQuiz("💬 Sentences", allWords(), "normal"); },
      switches: [
        { label: "💬 Sentences", run() { setDeck("sentences"); startQuiz("💬 Sentences", allWords(), "normal"); } },
        { label: "🧩 Conjugation", run() { setDeck("conj"); startQuiz("🧩 Conjugation", allWords(), "normal"); } }
      ]
    },
    {
      id: "review", min: 15, emoji: "🩹", name: "Trouble & review",
      tip: "Shore up weak spots and clear due cards.",
      run() { reviewRun(); }
    },
    {
      id: "speed", min: 10, emoji: "⚡", name: "Speed round",
      tip: "Fast recall on words you've mastered.",
      run() { setDeck("words"); speedRun(); }
    }
  ];

  function reviewRun() {
    setDeck("words");
    if (troubleWords().length >= 4) return startTrouble();
    if (dueItems(allWords()).length) return startReviewAll();
    startQuiz("🩹 Review & practice", allWords(), "normal"); // nothing weak/due yet — keep drilling
  }
  function speedRun() {
    // Speed Round needs 4 mastered words; before that, just keep practicing.
    if (knownWords().length < 4) {
      startQuiz("⚡ Warm-up (master 4 words to unlock Speed)", allWords(), "normal");
      return;
    }
    startSpeedRound();
  }

  // ---------- state (persisted, one block at a time) ----------
  const KEY = "plan_state";
  const MAX_DT = 60 * 1000; // ignore >60s gaps (sleep/wake) so they don't burn the clock
  const todayStr = () => new Date().toLocaleDateString("en-CA");

  let state = load();
  let awaiting = false;     // block timer hit 0, waiting for the user to tap Next
  let lastTick = Date.now();

  function load() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
    if (!s || s.date !== todayStr()) s = { date: todayStr(), idx: 0, elapsedMs: 0, status: "idle" };
    if (s.status === "running") s.status = "paused"; // a reload shouldn't silently keep counting
    return s;
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }

  const block = () => PLAN[state.idx];
  const blockMs = () => block().min * 60000;
  const remaining = () => Math.max(0, blockMs() - state.elapsedMs);
  const isLast = () => state.idx >= PLAN.length - 1;

  function fmt(ms) {
    const s = Math.ceil(ms / 1000);
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }
  function bork() { try { if (typeof correctSound === "function") correctSound(); } catch (e) {} }

  // ---------- DOM ----------
  const $ = id => document.getElementById(id);
  const elStep = $("planStep"), elLabel = $("planLabel"), elCd = $("planCd"),
        elNext = $("planNext"), elEnd = $("planEnd"), elSwitch = $("planSwitch"),
        card = $("planCard"), cardTitle = $("planCardTitle"), cardSub = $("planCardSub"),
        cardBtn = $("planStartBtn");

  function showBar(on) { bar.style.display = on ? "flex" : "none"; }

  function renderBar() {
    const b = block();
    elStep.textContent = "Block " + (state.idx + 1) + " / " + PLAN.length;
    elLabel.textContent = b.emoji + " " + b.name;
    if (awaiting) {
      elCd.textContent = "0:00";
      elCd.classList.add("alarm");
      bar.classList.add("alarm");
      elNext.textContent = isLast() ? "Finish ✓" : "Start: " + PLAN[state.idx + 1].name + " →";
      elNext.classList.add("pulse");
    } else {
      elCd.textContent = fmt(remaining());
      elCd.classList.remove("alarm");
      bar.classList.remove("alarm");
      elNext.textContent = isLast() ? "Finish ✓" : "Next →";
      elNext.classList.remove("pulse");
    }
    // per-block deck switches (block 2 only)
    elSwitch.innerHTML = "";
    if (b.switches) {
      b.switches.forEach(sw => {
        const x = document.createElement("button");
        x.className = "plan-mini"; x.textContent = sw.label;
        x.onclick = () => { if (state.status === "running") sw.run(); };
        elSwitch.appendChild(x);
      });
      elSwitch.style.display = "flex";
    } else {
      elSwitch.style.display = "none";
    }
  }

  function renderCard() {
    if (!card) return;
    const planTip = "4 blocks · ~60 min · 10·25·15·10";
    if (state.status === "done") {
      cardTitle.textContent = "✅ Plan done today — magaling!";
      cardSub.textContent = "Run it again anytime.";
      cardBtn.textContent = "Run again";
    } else if (state.status === "paused" && (state.idx > 0 || state.elapsedMs > 0)) {
      cardTitle.textContent = "⏸ Plan paused — Block " + (state.idx + 1);
      cardSub.textContent = block().emoji + " " + block().name + " · " + fmt(remaining()) + " left";
      cardBtn.textContent = "Resume";
    } else if (state.status === "running") {
      cardTitle.textContent = "● Plan running — Block " + (state.idx + 1);
      cardSub.textContent = block().emoji + " " + block().name;
      cardBtn.textContent = "Back to drill";
    } else {
      cardTitle.textContent = "▶ Start today's Plan";
      cardSub.textContent = planTip;
      cardBtn.textContent = "Start";
    }
  }

  // ---------- flow ----------
  function startFresh() {
    if (state.status === "done" &&
        !confirm("You already finished today's plan. Run the whole thing again?")) return;
    state.idx = 0; state.elapsedMs = 0; state.status = "running";
    awaiting = false; lastTick = Date.now();
    save(); showBar(true); renderBar(); renderCard();
    block().run();
  }
  function resume() {
    state.status = "running"; awaiting = false; lastTick = Date.now();
    save(); showBar(true); renderBar(); renderCard();
    block().run();
  }
  function pause() {
    state.status = "paused"; save(); showBar(false); renderCard();
    if (typeof goHome === "function") goHome();
  }
  function advance() {
    state.idx++; state.elapsedMs = 0; awaiting = false; lastTick = Date.now();
    if (state.idx >= PLAN.length) { complete(); return; }
    save(); renderBar(); renderCard();
    block().run();
  }
  function complete() {
    state.status = "done"; state.idx = PLAN.length - 1; awaiting = false;
    save();
    elStep.textContent = "🎉 Complete";
    elLabel.textContent = "Whole loop done — magaling!";
    elCd.textContent = ""; elCd.classList.remove("alarm");
    bar.classList.remove("alarm");
    elSwitch.style.display = "none";
    elNext.textContent = "✓ Done"; elNext.classList.remove("pulse");
    bork();
    renderCard();
    if (typeof goHome === "function") goHome();
  }
  function onBlockTimeUp() {
    awaiting = true;
    bork();
    renderBar();
  }

  // card button dispatches by status
  function onCardBtn() {
    if (state.status === "running") { block().run(); return; }   // back to the live drill
    if (state.status === "paused" && (state.idx > 0 || state.elapsedMs > 0)) { resume(); return; }
    startFresh();
  }

  cardBtn && (cardBtn.onclick = onCardBtn);
  elEnd.onclick = () => { if (confirm("Pause today's plan? You can resume right where you left off.")) pause(); };
  elNext.onclick = () => {
    if (state.status === "done") { showBar(false); return; } // "✓ Done" dismisses the bar
    if (state.status === "running") advance();
  };
  // tapping the label/countdown re-opens the current block's drill (handy after going Home)
  [elLabel, elCd].forEach(el => el && (el.onclick = () => { if (state.status === "running") block().run(); }));

  // ---------- clock ----------
  function tick() {
    if (state.status === "running" && !awaiting && document.visibilityState === "visible") {
      const now = Date.now(), dt = now - lastTick; lastTick = now;
      if (dt > 0 && dt < MAX_DT) state.elapsedMs += dt;
      if (remaining() <= 0) onBlockTimeUp();
    } else {
      lastTick = Date.now();
    }
    if (state.status === "running") renderBar();
  }

  document.addEventListener("visibilitychange", () => { lastTick = Date.now(); save(); });
  window.addEventListener("beforeunload", save);
  setInterval(save, 5000);
  setInterval(tick, 1000);

  // ---------- init ----------
  showBar(state.status === "running"); // after a reload this is downgraded to "paused", so bar stays hidden until resume
  renderBar();
  renderCard();
})();
