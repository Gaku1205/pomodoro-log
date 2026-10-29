"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  addEntry,
  formatClock,
  loadEntries,
  saveEntries,
  todaysEntries,
  type Entry,
} from "@/lib/entries";

export function TodayLog() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [now, setNow] = useState<number | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    // localStorage はブラウザでしか読めないので、表示後に読み込む
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(loadEntries(window.localStorage));
    setNow(Date.now());
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const added = Date.now();
    const next = addEntry(entries, text, added);
    if (next === entries) return;
    setEntries(next);
    setNow(added);
    saveEntries(window.localStorage, next);
    setText("");
  };

  const loaded = now !== null;
  const today = now === null ? [] : todaysEntries(entries, now);

  return (
    <section className="log">
      <h2 className="log-title">今日の記録</h2>
      <form className="row" onSubmit={submit}>
        <input
          className="input"
          type="text"
          value={text}
          placeholder="やったことを1行で"
          aria-label="今日の記録"
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn" disabled={text.trim() === ""}>
          追加
        </button>
      </form>
      {loaded && today.length === 0 ? (
        <p className="empty">まだ記録がありません</p>
      ) : (
        <ul className="entries">
          {today.map((entry) => (
            <li key={`${entry.createdAt}-${entry.text}`} className="entry">
              <span className="entry-time">{formatClock(entry.createdAt)}</span>
              <span>{entry.text}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
