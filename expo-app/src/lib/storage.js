// Cross-platform persistence. AsyncStorage works on iOS, Android, and Web.
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROG = "tq_progress";
const STREAK = "tq_streak";
const DAILY = "tq_daily";

export async function loadProgress() {
  try { return JSON.parse((await AsyncStorage.getItem(PROG)) || "{}"); } catch { return {}; }
}
export async function saveProgress(p) {
  try { await AsyncStorage.setItem(PROG, JSON.stringify(p)); } catch {}
}
export async function loadJSON(key, fallback) {
  try { const v = await AsyncStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
export async function saveJSON(key, val) {
  try { await AsyncStorage.setItem(key, JSON.stringify(val)); } catch {}
}
export const KEYS = { PROG, STREAK, DAILY };
