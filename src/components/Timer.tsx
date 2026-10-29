"use client";

import { useEffect, useState } from "react";
import { formatTime, initialTimer, PHASE_LABEL, tick, type TimerState } from "@/lib/pomodoro";

export function Timer() {
  const [timer, setTimer] = useState<TimerState>(() => initialTimer());
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTimer((prev) => {
        const next = tick(prev);
        if (next.switched) setRunning(false);
        return next.state;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const reset = () => {
    setRunning(false);
    setTimer((prev) => initialTimer(prev.phase));
  };

  return (
    <section className="timer">
      <div className={running ? "phase phase-active" : "phase"}>{PHASE_LABEL[timer.phase]}</div>
      <div className="time" role="timer">
        {formatTime(timer.remaining)}
      </div>
      <div className="row">
        <button type="button" className="btn" onClick={() => setRunning((r) => !r)}>
          {running ? "一時停止" : "開始"}
        </button>
        <button type="button" className="btn" onClick={reset}>
          リセット
        </button>
      </div>
    </section>
  );
}
