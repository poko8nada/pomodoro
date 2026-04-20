import type {
  IdleTimerState,
  PausedTimerState,
  RunningTimerState,
  TimerPhase,
  TimerSettings,
  TimerState,
} from '@/components/timer/timer-types';

const MS_PER_MINUTE = 60 * 1000;
const MINIMUM_MINUTES = 5;
const MAXIMUM_TOTAL_MINUTES = 60;
const MINUTES_STEP = 5;

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  focusMinutes: 25,
  breakMinutes: 5,
  totalCycles: 2,
};

export const TIMER_CYCLE_OPTIONS = [1, 2, 3, 4, 5] as const;

function getFocusTimeMs(settings: TimerSettings): number {
  return settings.focusMinutes * MS_PER_MINUTE;
}

function getBreakTimeMs(settings: TimerSettings): number {
  return settings.breakMinutes * MS_PER_MINUTE;
}

export function createIdleTimerState(): IdleTimerState {
  return { status: 'idle' };
}

export function increasePhaseMinutes(settings: TimerSettings, phase: TimerPhase): TimerSettings {
  if (phase === 'focus') {
    const focusMinutes = settings.focusMinutes + MINUTES_STEP;
    if (focusMinutes + settings.breakMinutes > MAXIMUM_TOTAL_MINUTES) return settings;
    return { ...settings, focusMinutes };
  }

  const breakMinutes = settings.breakMinutes + MINUTES_STEP;
  if (settings.focusMinutes + breakMinutes > MAXIMUM_TOTAL_MINUTES) return settings;
  return { ...settings, breakMinutes };
}

export function decreasePhaseMinutes(settings: TimerSettings, phase: TimerPhase): TimerSettings {
  if (phase === 'focus') {
    const focusMinutes = Math.max(MINIMUM_MINUTES, settings.focusMinutes - MINUTES_STEP);
    return focusMinutes === settings.focusMinutes ? settings : { ...settings, focusMinutes };
  }

  const breakMinutes = Math.max(MINIMUM_MINUTES, settings.breakMinutes - MINUTES_STEP);
  return breakMinutes === settings.breakMinutes ? settings : { ...settings, breakMinutes };
}

export function startTimer(settings: TimerSettings): RunningTimerState {
  return {
    status: 'running',
    phase: 'focus',
    remainingCycles: settings.totalCycles,
    endTime: Date.now() + getFocusTimeMs(settings),
    sessionSettings: { ...settings },
  };
}

export function pauseTimer(timer: RunningTimerState): PausedTimerState {
  return {
    status: 'paused',
    phase: timer.phase,
    remainingCycles: timer.remainingCycles,
    remainingMs: Math.max(0, timer.endTime - Date.now()),
    sessionSettings: timer.sessionSettings,
  };
}

export function resumeTimer(timer: PausedTimerState): RunningTimerState {
  return {
    status: 'running',
    phase: timer.phase,
    remainingCycles: timer.remainingCycles,
    endTime: Date.now() + timer.remainingMs,
    sessionSettings: timer.sessionSettings,
  };
}

export function moveToNextPhase(timer: RunningTimerState): TimerState {
  if (timer.phase === 'focus') {
    return {
      ...timer,
      phase: 'break',
      endTime: Date.now() + getBreakTimeMs(timer.sessionSettings),
    };
  }

  if (timer.remainingCycles === 1) return createIdleTimerState();

  return {
    ...timer,
    phase: 'focus',
    remainingCycles: timer.remainingCycles - 1,
    endTime: Date.now() + getFocusTimeMs(timer.sessionSettings),
  };
}

export function getRemainingTimeMs(timer: TimerState): number {
  switch (timer.status) {
    case 'idle':
      return 0;
    case 'running':
      return Math.max(0, timer.endTime - Date.now());
    case 'paused':
      return timer.remainingMs;
  }
}

export function getCurrentTimerPhase(timer: TimerState): TimerPhase {
  return timer.status === 'idle' ? 'focus' : timer.phase;
}
