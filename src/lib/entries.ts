export type Entry = { text: string; createdAt: number };

export const STORAGE_KEY = "pomodoro-log:entries";

export type StorageLike = Pick<Storage, "getItem" | "setItem">;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatClock(timestamp: number): string {
  const d = new Date(timestamp);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function dayKey(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function isSameLocalDay(a: number, b: number): boolean {
  return dayKey(a) === dayKey(b);
}

// 今日（ローカル日付）の分だけを、新しい順で返す
export function todaysEntries(entries: Entry[], now: number): Entry[] {
  return entries
    .filter((e) => isSameLocalDay(e.createdAt, now))
    .sort((a, b) => b.createdAt - a.createdAt);
}

// 空（空白のみ）なら追加せず、元の配列を返す
export function addEntry(entries: Entry[], text: string, now: number): Entry[] {
  const trimmed = text.trim();
  if (trimmed === "") return entries;
  return [...entries, { text: trimmed, createdAt: now }];
}

function isEntry(v: unknown): v is Entry {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.text === "string" && typeof o.createdAt === "number" && Number.isFinite(o.createdAt);
}

export function loadEntries(storage: StorageLike): Entry[] {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isEntry) : [];
  } catch {
    return [];
  }
}

export function saveEntries(storage: StorageLike, entries: Entry[]): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // 保存できなくても画面は動かす
  }
}
