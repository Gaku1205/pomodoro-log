export type Phase = "focus" | "break";

export const PHASE_SECONDS: Record<Phase, number> = {
  focus: 25 * 60,
  break: 5 * 60,
};

export const PHASE_LABEL: Record<Phase, string> = {
  focus: "集中",
  break: "休憩",
};

export function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export function nextPhase(phase: Phase): Phase {
  return phase === "focus" ? "break" : "focus";
}

export type TimerState = { phase: Phase; remaining: number };

export function initialTimer(phase: Phase = "focus"): TimerState {
  return { phase, remaining: PHASE_SECONDS[phase] };
}

// 1秒進める。0になったら次の区間に切り替え、切り替わったかも返す
export function tick(state: TimerState): { state: TimerState; switched: boolean } {
  const remaining = state.remaining - 1;
  if (remaining <= 0) {
    return { state: initialTimer(nextPhase(state.phase)), switched: true };
  }
  return { state: { ...state, remaining }, switched: false };
}
