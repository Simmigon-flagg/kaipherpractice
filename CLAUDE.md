# Kaipher Practice — Tagalog quiz app

Personal Tagalog practice tool for Simmigon (daily 4–5 PM practice block, Mon–Fri).
Plain HTML/JS, no build step — open `Tagalog-Practice-standalone.html` directly in Chrome (file://).

## 🚫🔊 LOCKED: DO NOT TOUCH THE VOICES OR SOUND (owner rule, 2026-07-01)

The audio is DONE and working exactly how Kaipher wants: Google Filipino TTS (primary) + English
readout + reward sounds + AudioContext unlock. **Any Claude, any terminal, any session: NEVER
modify, "improve", refactor, remove, cache, add a service worker to, or change the fallback of the
TTS/voice block or the reward-sounds block — UNLESS Kaipher explicitly says so in that same request.**
If a task seems to need audio changes, STOP and ask first. This rule exists because touching it
already caused hours of breakage. Look for the 🚫 banners in `Tagalog-Practice-standalone.html`.

## Files
- `Tagalog-Practice-standalone.html` — THE app. Everything (markup, styles, word data, all logic)
  is inlined in this single self-contained file. ALL code edits happen here.
  IMPORTANT: do NOT rename or move this file — browser progress/streak is keyed to its file:// path.
- `archive/` — old split-source version (kaipher-practice.html + practice*.js, phrases.js, etc.),
  superseded by the standalone. Kept for reference only; not used to run the app.
- `expo-app/`, `serve/` — separate experiments, not the daily app.

## Features
- **Home page**: category grid with mastery bars + due counts, learned banner ("X of Y learned"), Speed Round card
- **Quiz**: hear Tagalog (TTS) → answer → reward sound + spoken English meaning
- **Answer modes** (toggle in Settings or ⌨️ button on quiz screen, saved): multiple choice | typed recall
  - Typed checking: local exact/slash-variant/1-typo (Levenshtein) match free; near-misses optionally judged by Claude Haiku (`claude-haiku-4-5-20251001`, key saved in localStorage via Settings)
- **SRS**: Leitner boxes 0–5 per word, intervals 30s/10m/1h/1d/3d/1w; due words served first, then unseen. Wrong → box 0. "Learned/mastered" = 3+ correct.
- **Speed Round**: 60s, mastered words only, text-only (no voices), short ding on correct, separate best score
- **Sounds**: win sound selectable in Settings (4 built-in WebAudio synths + user-uploaded audio files stored in IndexedDB)
- **Backup**: Settings → Export/Import JSON (localStorage keys + custom sound blobs as data URLs)

## Audio
- Tagalog TTS: Google Translate endpoint (`translate_tts?...&tl=tl`), unofficial — if it breaks, switch to Google Cloud TTS (fil-PH) with API key. Fallback: installed Filipino system voice, then text display. NOTE: macOS has no Filipino system voice.
- English meaning spoken with light female system voice (Samantha/Google US English), pitch 1.3.
- Autoplay block on page load is NOT treated as TTS failure (NotAllowedError ignored).

## Storage (all keyed to file:// path — moving/renaming the folder wipes it; export backup first)
- localStorage: `tq_progress` (per-word {ok, miss, box, due}), `tq_best`, `tq_speedBest`, `tq_custom` (user words), `tq_winSound`, `tq_answerMode`, `tq_apiKey`
- IndexedDB `kaipher-practice` / store `sounds`: uploaded reward sounds

## User preferences
- Direct, step-by-step, one action at a time; flag risks up front
- Big fonts (bad eyes) — keep UI text ≥1.15rem
- Reward loop matters: correct answers must feel rewarding (sound + spoken confirmation)
- Drill method for chat practice: 3-word chunks, cycle 3×, shrink chunk if missed 4–5×

## Possible next features (discussed, not built)
- Reverse cards (English → type Tagalog) as separate SRS items
- New-word pacing (daily cap, e.g. 10/day)
- Context sentences after correct answers
- Session wrap-up stats + daily streak counter
