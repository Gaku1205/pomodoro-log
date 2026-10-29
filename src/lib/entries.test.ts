import { describe, expect, it } from "vitest";
import {
  addEntry,
  formatClock,
  loadEntries,
  saveEntries,
  todaysEntries,
  type StorageLike,
} from "./entries";

function memoryStorage(initial?: string): StorageLike {
  let value: string | null = initial ?? null;
  return {
    getItem: () => value,
    setItem: (_key, v) => {
      value = v;
    },
  };
}

const at = (y: number, m: number, d: number, h = 0, min = 0) =>
  new Date(y, m - 1, d, h, min).getTime();

describe("entries", () => {
  it("時刻を HH:mm にする", () => {
    expect(formatClock(at(2026, 1, 2, 9, 5))).toBe("09:05");
    expect(formatClock(at(2026, 1, 2, 23, 59))).toBe("23:59");
  });

  it("空・空白だけは追加しない", () => {
    expect(addEntry([], "", 1)).toEqual([]);
    expect(addEntry([], "   ", 1)).toEqual([]);
  });

  it("前後の空白を除いて追加する", () => {
    expect(addEntry([], " 本を読む ", 5)).toEqual([{ text: "本を読む", createdAt: 5 }]);
  });

  it("今日の分だけを新しい順で返す", () => {
    const entries = [
      { text: "昨日", createdAt: at(2026, 1, 1, 23, 59) },
      { text: "朝", createdAt: at(2026, 1, 2, 8, 0) },
      { text: "昼", createdAt: at(2026, 1, 2, 12, 0) },
    ];
    expect(todaysEntries(entries, at(2026, 1, 2, 13, 0)).map((e) => e.text)).toEqual(["昼", "朝"]);
    expect(todaysEntries(entries, at(2026, 1, 3, 0, 0))).toEqual([]);
  });

  it("保存して読み込める", () => {
    const s = memoryStorage();
    const entries = [{ text: "a", createdAt: 1 }];
    saveEntries(s, entries);
    expect(loadEntries(s)).toEqual(entries);
  });

  it("保存が無い・壊れているときは空", () => {
    expect(loadEntries(memoryStorage())).toEqual([]);
    expect(loadEntries(memoryStorage("{broken"))).toEqual([]);
    expect(loadEntries(memoryStorage('{"a":1}'))).toEqual([]);
    expect(loadEntries(memoryStorage('[{"text":1},{"text":"ok","createdAt":2}]'))).toEqual([
      { text: "ok", createdAt: 2 },
    ]);
  });
});
