# 📋 Learning-Features Roadmap — Kaipher Practice

**This is the master to-do sheet for the missing learning techniques. Read it at the start of every session.**

## 🚦 WORKFLOW RULES (do not break these)
1. **One feature at a time.** Never start the next until the current one is DONE.
2. **Build directly on `main` — no separate branches** (Kaipher, 2026-07-21: "one repo now"). The old per-feature-branch rule is retired.
3. **STOP after building one feature.** Wait for Kaipher to **test it** before touching the next.
4. **Temporary highlight:** each new feature must flash the on-screen 🆕 "new feature" flag (`flagNewFeature(label)`) and/or wear an `nf-badge` so Kaipher can see when it's active while testing. Remove all highlights once features are settled.
5. Update this sheet's **Status** column as you go. Mark ✅ only after Kaipher confirms.
6. Do **not** touch the locked audio/voices while doing any of these (see the 🚫 rule in `CLAUDE.md`) unless the feature IS the audio and Kaipher said so.

## Status legend
`⬜ not started` · `🔵 in progress (on its branch)` · `🧪 awaiting Kaipher's test` · `🟠 testing feedback` · `✅ tested + merged`

## Queue

**BUILD ORDER (Kaipher, 2026-07-02): #0 → #1 → #6 → #2 → #3 → #4 → #5.** Table is in build order; the `#` column is the stable feature ID.

| # | Feature | What it adds | Branch | Status |
|---|---------|--------------|--------|--------|
| 0 | **Playback speed control** | Slow/Normal/Fast/Faster for the Tagalog audio | `main` (folded in) | 🧪 awaiting test |
| 1 | **Recall-before-recognition** | Hide the choices ~3s on *seen* words (with a "show now" tap) so you recall before you recognize. Strengthens the #1 technique (active recall). | `feat/recall-before-recognition` | ⬜ |
| 6 | **Cross-deck interleaving** | Mix words + sentences (and categories) in one session instead of separate decks — so you see sentences using learned words during "Start Today's Practice." | `feat/interleaving` | ⬜ ← **NEXT after #1** |
| 2 | **Dual coding (images)** | Pair a small picture with each word so meaning is stored visually + verbally. Biggest untapped gap. | `feat/dual-coding-images` | ⬜ |
| 3 | **Metacognition (confidence rating)** | After answering, tap how sure you were; feed it into the SRS scheduling. | `feat/confidence-rating` | ⬜ |
| 4 | **Elaboration / self-explanation** | Prompt a quick "why / how it connects" or show a usage note to deepen encoding. | `feat/elaboration` | ⬜ |
| 5 | **Mnemonics / keyword hooks** | Optional memory hook per word (keyword method). | `feat/mnemonics` | ⬜ |

## Notes
- These came from the gap analysis 2026-07-02: the app already uses active recall, spaced repetition, distributed practice, production, listening, context, grammar-judgment, fluency, interleaving-within-deck, feedback, and gamification. The list above is what it does NOT yet use.
- Delete this file / the CLAUDE.md pointer only when every row is ✅.
