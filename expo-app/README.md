# Kaipher Practice — Expo app (Android / iOS / Web)

A cross-platform rebuild of the Tagalog practice app. **Web-first**, also runs native.

## Architecture (the thing you asked for — logic separated from UI)
```
src/
  data/        ← pure word/sentence/phrase data (portable, no UI)
  lib/         ← pure logic: srs.js, typed.js, decks.js, storage.js, audio.js
  components/  ← UI only: Home.js, Quiz.js
  theme.js
App.js         ← wires state + screens
```
`src/lib/*` and `src/data/*` have **no UI code**. `test-lib.mjs` unit-tests them
headlessly: `node test-lib.mjs`.

## Run it
```bash
cd expo-app
npm install          # first time only
npx expo start --web # opens in your browser
# or: npx expo start   → press w (web), a (Android), i (iOS), or scan the QR in Expo Go
```
For your phone over the network: `npx expo start`, install **Expo Go** on the
phone (same WiFi), scan the QR. For plain browser use on the phone, run
`npx expo start --web` and open the shown LAN URL in mobile Safari/Chrome.

## What's in v1
- 4 decks (Words, Sentences, Conjugation, Makes Sense?), category list, mastery + due counts
- Listen → multiple-choice → reward chime + spoken answer
- Spaced repetition (Leitner), reverse cards on word decks, daily streak
- Progress persists via AsyncStorage (works on web + native)
- Tagalog TTS: Google endpoint on web, expo-speech (fil-PH) on native; English via expo-speech

## Not yet ported from the web version (next steps)
- Typed-answer mode (logic is ready in `lib/typed.js`, needs a UI input)
- Speed Round, Review-all-due / Trouble-Words sessions, session progress bar
- The 100 synthesized sounds + custom sound upload (web-only WebAudio; native needs audio files)
- Study timer / countdown alarm
The original web app (../kaipher-practice.html) still has all of these.
