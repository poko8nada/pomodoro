import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createIdleTimerState,
  decreasePhaseMinutes,
  getCurrentTimerPhase,
  getRemainingTimeMs,
  increasePhaseMinutes,
  moveToNextPhase,
  pauseTimer,
  resumeTimer,
  startTimer,
} from '@/components/timer/timer-state';
import type { RunningTimerState, TimerSettings } from '@/components/timer/timer-types';

const BASE_SETTINGS: TimerSettings = {
  focusMinutes: 25,
  breakMinutes: 5,
  totalCycles: 2,
};

describe('timer-state', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('increases focus minutes by 5 while staying within the total limit', () => {
    expect(increasePhaseMinutes(BASE_SETTINGS, 'focus')).toEqual({
      focusMinutes: 30,
      breakMinutes: 5,
      totalCycles: 2,
    });
  });

  it('does not increase minutes when the total would exceed 60', () => {
    const settings: TimerSettings = {
      focusMinutes: 55,
      breakMinutes: 5,
      totalCycles: 2,
    };

    expect(increasePhaseMinutes(settings, 'focus')).toEqual(settings);
    expect(increasePhaseMinutes(settings, 'break')).toEqual(settings);
  });

  it('does not decrease minutes below 5', () => {
    const settings: TimerSettings = {
      focusMinutes: 5,
      breakMinutes: 5,
      totalCycles: 2,
    };

    expect(decreasePhaseMinutes(settings, 'focus')).toEqual(settings);
    expect(decreasePhaseMinutes(settings, 'break')).toEqual(settings);
  });

  it('starts a running timer with a snapshot of the current settings', () => {
    const timer = startTimer(BASE_SETTINGS);

    expect(timer).toEqual({
      status: 'running',
      phase: 'focus',
      remainingCycles: 2,
      endTime: 1_501_000,
      sessionSettings: BASE_SETTINGS,
    });
    expect(timer.sessionSettings).not.toBe(BASE_SETTINGS);
  });

  it('pauses and resumes using the remaining milliseconds', () => {
    const runningTimer = startTimer(BASE_SETTINGS);

    vi.spyOn(Date, 'now').mockReturnValue(61_000);
    const pausedTimer = pauseTimer(runningTimer);

    expect(pausedTimer).toEqual({
      status: 'paused',
      phase: 'focus',
      remainingCycles: 2,
      remainingMs: 1_440_000,
      sessionSettings: BASE_SETTINGS,
    });

    vi.spyOn(Date, 'now').mockReturnValue(100_000);
    expect(resumeTimer(pausedTimer)).toEqual({
      status: 'running',
      phase: 'focus',
      remainingCycles: 2,
      endTime: 1_540_000,
      sessionSettings: BASE_SETTINGS,
    });
  });

  it('moves from focus to break without changing remaining cycles', () => {
    const runningTimer = startTimer(BASE_SETTINGS);

    vi.spyOn(Date, 'now').mockReturnValue(2_000);
    expect(moveToNextPhase(runningTimer)).toEqual({
      status: 'running',
      phase: 'break',
      remainingCycles: 2,
      endTime: 302_000,
      sessionSettings: BASE_SETTINGS,
    });
  });

  it('moves from break to focus and decrements remaining cycles', () => {
    const runningBreakTimer: RunningTimerState = {
      status: 'running',
      phase: 'break',
      remainingCycles: 2,
      endTime: 0,
      sessionSettings: BASE_SETTINGS,
    };

    vi.spyOn(Date, 'now').mockReturnValue(2_000);
    expect(moveToNextPhase(runningBreakTimer)).toEqual({
      status: 'running',
      phase: 'focus',
      remainingCycles: 1,
      endTime: 1_502_000,
      sessionSettings: BASE_SETTINGS,
    });
  });

  it('returns to idle after the final break ends', () => {
    const finalBreakTimer: RunningTimerState = {
      status: 'running',
      phase: 'break',
      remainingCycles: 1,
      endTime: 0,
      sessionSettings: BASE_SETTINGS,
    };

    expect(moveToNextPhase(finalBreakTimer)).toEqual(createIdleTimerState());
  });

  it('reports remaining time for running timers and clamps negative values to zero', () => {
    vi.spyOn(Date, 'now').mockReturnValue(3_000);

    expect(
      getRemainingTimeMs({
        status: 'running',
        phase: 'focus',
        remainingCycles: 2,
        endTime: 5_000,
        sessionSettings: BASE_SETTINGS,
      }),
    ).toBe(2_000);

    expect(
      getRemainingTimeMs({
        status: 'running',
        phase: 'focus',
        remainingCycles: 2,
        endTime: 2_000,
        sessionSettings: BASE_SETTINGS,
      }),
    ).toBe(0);
  });

  it('reports remaining time for idle and paused timers', () => {
    expect(getRemainingTimeMs(createIdleTimerState())).toBe(0);
    expect(
      getRemainingTimeMs({
        status: 'paused',
        phase: 'break',
        remainingCycles: 1,
        remainingMs: 123_000,
        sessionSettings: BASE_SETTINGS,
      }),
    ).toBe(123_000);
  });

  it('reports the current phase and defaults idle timers to focus', () => {
    expect(getCurrentTimerPhase(createIdleTimerState())).toBe('focus');
    expect(
      getCurrentTimerPhase({
        status: 'paused',
        phase: 'break',
        remainingCycles: 1,
        remainingMs: 123_000,
        sessionSettings: BASE_SETTINGS,
      }),
    ).toBe('break');
  });
});
