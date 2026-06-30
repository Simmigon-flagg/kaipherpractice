// Kaipher Practice — AUTO practice timer (self-contained, own localStorage keys).
//
// Behavior (no manual start/stop needed):
//  • Accrues time ONLY while the app is visible AND you've interacted recently.
//  • Auto-pauses when you switch away/lock the screen, or go idle (no interaction
//    for IDLE_MS). Auto-resumes the instant you interact again (tap an answer, etc.).
//  • Accumulates toward a goal across sit-downs and PERSISTS, so you never lose
//    time by forgetting to restart. When the goal is reached it alarms, then
//    resets so the next block starts fresh on its own.
//  • Also keeps a lifetime "total time" clock.
//
// IDLE_MS = 2 min: long enough that normal think-time between cards never pauses
// it, short enough that walking away stops the clock quickly.

(function () {
  const K_TOTAL   = "tt_totalMs";    // lifetime active ms
  const K_GOALMIN = "tt_goalMin";    // practice goal in minutes
  const K_ELAPSED = "tt_elapsedMs";  // active ms accrued toward the current goal block

  const IDLE_MS = 2 * 60 * 1000;     // auto-pause after 2 min of no interaction
  const MAX_DT  = 60 * 1000;         // ignore gaps > 60s (sleep/wake) so they don't over-count

  const $ = id => document.getElementById(id);
  const elTotal = $("ttTotal"), elCd = $("ttCountdown"), elToggle = $("ttToggle"), elSet = $("ttSet");
  if (!elTotal) return; // timer widget not on this page

  let totalMs   = +(localStorage.getItem(K_TOTAL)   || 0);
  let goalMin   = +(localStorage.getItem(K_GOALMIN) || 60);
  let elapsedMs = +(localStorage.getItem(K_ELAPSED) || 0);
  let lastTick  = Date.now();
  let lastActivity = Date.now();
  let alarming = false, alarmTimer = null;

  // any real interaction counts as "still practicing"
  ["mousedown", "keydown", "touchstart", "pointerdown", "click"].forEach(ev =>
    window.addEventListener(ev, () => { lastActivity = Date.now(); if (alarming) stopAlarm(); }, { passive: true }));

  const goalMs = () => goalMin * 60000;
  const remaining = () => Math.max(0, goalMs() - elapsedMs);
  const isActive = () => document.visibilityState === "visible" && (Date.now() - lastActivity) < IDLE_MS;

  function fmtTotal(ms) {
    const m = Math.floor(ms / 60000); return "⏱ " + Math.floor(m / 60) + "h " + (m % 60) + "m";
  }
  function fmtRemain(ms) {
    const s = Math.ceil(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
    return (h ? h + ":" + String(m).padStart(2, "0") : m + "") + ":" + String(ss).padStart(2, "0");
  }
  function save() {
    localStorage.setItem(K_TOTAL, Math.round(totalMs));
    localStorage.setItem(K_ELAPSED, Math.round(elapsedMs));
  }

  // ---------- alarm ----------
  let actx;
  function beep() {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime;
      o.type = "sine"; o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.2, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + 0.55);
    } catch (e) {}
  }
  function fireAlarm() {
    alarming = true;
    elCd.classList.add("alarm");
    let n = 0;
    const ring = () => {
      try { (typeof correctSound === "function" ? correctSound() : beep()); } catch (e) { beep(); }
      if (++n < 8) alarmTimer = setTimeout(ring, 700);
    };
    ring();
    setTimeout(() => { if (alarming) alert("⏰ Practice goal reached — " + goalMin + " minutes of focused practice. Magaling!"); }, 300);
  }
  function stopAlarm() {
    alarming = false; clearTimeout(alarmTimer); elCd.classList.remove("alarm");
    elapsedMs = 0; save(); render();   // reset for the next block automatically
  }

  function setGoal() {
    const v = prompt("Practice goal in minutes (e.g. 60, 120):", String(goalMin));
    if (v === null) return;
    goalMin = Math.max(1, Math.min(600, parseInt(v, 10) || goalMin));
    localStorage.setItem(K_GOALMIN, goalMin);
    if (elapsedMs > goalMs()) { elapsedMs = 0; save(); }
    render();
  }
  function resetBlock() {
    if (confirm("Reset this practice block back to " + goalMin + " minutes?")) { stopAlarm(); elapsedMs = 0; save(); render(); }
  }

  function render() {
    elTotal.textContent = fmtTotal(totalMs);
    elCd.textContent = fmtRemain(remaining());
    // green dot when actively counting, grey when auto-paused
    const active = isActive() && !alarming && remaining() > 0;
    elCd.style.color = alarming ? "" : (active ? "var(--good)" : "var(--muted)");
    elToggle.textContent = active ? "●" : "❚❚";
    elToggle.title = active ? "Practicing (auto) — tap to reset block" : "Paused (auto) — interact to resume; tap to reset";
  }

  function tick() {
    const now = Date.now();
    const dt = now - lastTick;
    lastTick = now;
    if (dt > 0 && dt < MAX_DT && isActive()) {
      totalMs += dt;
      if (remaining() > 0) elapsedMs += dt;
    }
    if (remaining() <= 0 && !alarming) fireAlarm();
    render();
  }

  elToggle.onclick = resetBlock;   // manual reset of the current block (rarely needed)
  elSet.onclick = setGoal;         // set the practice goal length

  setInterval(save, 10000);
  document.addEventListener("visibilitychange", () => { lastTick = Date.now(); save(); });
  window.addEventListener("beforeunload", save);

  render();
  setInterval(tick, 1000);
})();
