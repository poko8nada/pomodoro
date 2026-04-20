export type TimerPhase = 'focus' | 'break';

export type TimerSettings = {
  focusMinutes: number;
  breakMinutes: number;
  totalCycles: number;
};

type TimerSession = {
  phase: TimerPhase;
  remainingCycles: number;
  sessionSettings: TimerSettings;
};

export type IdleTimerState = {
  status: 'idle';
};

export type RunningTimerState = TimerSession & {
  status: 'running';
  endTime: number;
};

export type PausedTimerState = TimerSession & {
  status: 'paused';
  remainingMs: number;
};

export type TimerState = IdleTimerState | RunningTimerState | PausedTimerState;
