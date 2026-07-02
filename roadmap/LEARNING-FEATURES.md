# 📋 Learning-Features Roadmap — Kaipher Practice

**This is the master to-do sheet for the missing learning techniques. Read it at the start of every session.**

## 🚦 WORKFLOW RULES (do not break these)
1. **One feature at a time.** Never start the next until the current one is DONE.
2. **Each feature gets its OWN branch** (branch name in the table below). Never build a feature on `main`.
3. **STOP after building one feature.** Wait for Kaipher to **test it AND merge it** before touching the next.
4. Update this sheet's **Status** column as you go. Mark ✅ merged only after Kaipher confirms.
5. Do **not** touch the locked audio/voices while doing any of these (see the 🚫 rule in `CLAUDE.md`) unless the feature IS the audio and Kaipher said so.

## Status legend
`⬜ not started` · `🔵 in progress (on its branch)` · `🧪 awaiting Kaipher's test` · `🟠 testing feedback` · `✅ tested + merged`

## Queue (strongest-learning-impact first — reorder if Kaipher wants)

| # | Feature | What it adds | Branch | Status |
|---|---------|--------------|--------|--------|
| 0 | **Playback speed control** | Slow/Normal/Fast/Faster for the Tagalog audio | `new-feature` | 🧪 awaiting test + merge |
| 1 | **Recall-before-recognition** | Hide the choices ~3s on *seen* words (with a "show now" tap) so you recall before you recognize. Strengthens the #1 technique (active recall). | `feat/recall-before-recognition` | ⬜ |
| 2 | **Dual coding (images)** | Pair a small picture with each word so meaning is stored visually + verbally. Biggest untapped gap. | `feat/dual-coding-images` | ⬜ |
| 3 | **Metacognition (confidence rating)** | After answering, tap how sure you were; feed it into the SRS scheduling. | `feat/confidence-rating` | ⬜ |
| 4 | **Elaboration / self-explanation** | Prompt a quick "why / how it connects" or show a usage note to deepen encoding. | `feat/elaboration` | ⬜ |
| 5 | **Mnemonics / keyword hooks** | Optional memory hook per word (keyword method). | `feat/mnemonics` | ⬜ |
| 6 | **Cross-deck interleaving** | Mix words + sentences (and categories) in one session instead of separate decks. | `feat/interleaving` | ⬜ |

## Notes
- These came from the gap analysis 2026-07-02: the app already uses active recall, spaced repetition, distributed practice, production, listening, context, grammar-judgment, fluency, interleaving-within-deck, feedback, and gamification. The list above is what it does NOT yet use.
- Delete this file / the CLAUDE.md pointer only when every row is ✅.
