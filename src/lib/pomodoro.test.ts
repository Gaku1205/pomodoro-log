import { describe, expect, it } from "vitest";
import { formatTime, initialTimer, nextPhase, PHASE_SECONDS, tick } from "./pomodoro";

describe("pomodoro", () => {
  it("集中は25分、休憩は5分", () => {
    expect(PHASE_SECONDS.focus).toBe(1500);
    expect(PHASE_SECONDS.break).toBe(300);
  });

  it("残り秒数を mm:ss にする", () => {
    expect(formatTime(1500)).toBe("25:00");
    expect(formatTime(300)).toBe("05:00");
    expect(formatTime(61)).toBe("01:01");
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(-3)).toBe("00:00");
  });

  it("集中と休憩が入れ替わる", () => {
    expect(nextPhase("focus")).toBe("break");
    expect(nextPhase("break")).toBe("focus");
  });

  it("1秒ずつ減る", () => {
    const r = tick(initialTimer());
    expect(r.state).toEqual({ phase: "focus", remaining: 1499 });
    expect(r.switched).toBe(false);
  });

  it("0になったら次の区間に切り替わる", () => {
    expect(tick({ phase: "focus", remaining: 1 })).toEqual({
      state: { phase: "break", remaining: 300 },
      switched: true,
    });
    expect(tick({ phase: "break", remaining: 1 })).toEqual({
      state: { phase: "focus", remaining: 1500 },
      switched: true,
    });
  });
});
