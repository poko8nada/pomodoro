import TimerSettingsPanel from '@/components/timer/timer-settings';
import {
  createIdleTimerState,
  decreasePhaseMinutes,
  DEFAULT_TIMER_SETTINGS,
  getCurrentTimerPhase,
  getRemainingTimeMs,
  increasePhaseMinutes,
  moveToNextPhase,
  pauseTimer,
  resumeTimer,
  startTimer,
  TIMER_CYCLE_OPTIONS,
} from '@/components/timer/timer-state';
import type { TimerSettings, TimerState } from '@/components/timer/timer-types';
import { useCallback, useEffect, useState } from 'hono/jsx';

const TICK_MS = 250;

function getMinutesLabel(ms: number): string {
  return Math.floor(ms / 1000 / 60).toString();
}

function getSecondsLabel(ms: number): string {
  return Math.floor((ms / 1000) % 60).toString();
}

export default function Timer() {
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(DEFAULT_TIMER_SETTINGS);
  const [timerState, setTimerState] = useState<TimerState>(createIdleTimerState());

  useEffect(() => {
    if (timerState.status !== 'running') return;

    const timerId = setInterval(() => {
      setTimerState((prev) => {
        if (prev.status !== 'running') return prev;
        if (prev.endTime - Date.now() > 0) return { ...prev };
        return moveToNextPhase(prev);
      });
    }, TICK_MS);

    return () => clearInterval(timerId);
  }, [timerState.status]);

  useEffect(() => {
    const syncTimerWhenVisible = () => {
      if (document.visibilityState !== 'visible') return;
      setTimerState((prev) => (prev.status === 'running' ? { ...prev } : prev));
    };
    document.addEventListener('visibilitychange', syncTimerWhenVisible);
    return () => document.removeEventListener('visibilitychange', syncTimerWhenVisible);
  }, []);

  const handleStartPauseButton = useCallback(() => {
    setTimerState((prev) => {
      switch (prev.status) {
        case 'idle':
          return startTimer(timerSettings);
        case 'running':
          return pauseTimer(prev);
        case 'paused':
          return resumeTimer(prev);
      }
    });
  }, [timerSettings]);

  const handleResetButton = useCallback(() => {
    setTimerState(createIdleTimerState());
  }, []);

  const remainingTimeMs = getRemainingTimeMs(timerState);
  const currentPhase = getCurrentTimerPhase(timerState);

  return (
    <div>
      <TimerSettingsPanel
        cycleOptions={TIMER_CYCLE_OPTIONS}
        settings={timerSettings}
        onDecreaseBreakMinutes={() =>
          setTimerSettings((prev) => decreasePhaseMinutes(prev, 'break'))
        }
        onDecreaseFocusMinutes={() =>
          setTimerSettings((prev) => decreasePhaseMinutes(prev, 'focus'))
        }
        onIncreaseBreakMinutes={() =>
          setTimerSettings((prev) => increasePhaseMinutes(prev, 'break'))
        }
        onIncreaseFocusMinutes={() =>
          setTimerSettings((prev) => increasePhaseMinutes(prev, 'focus'))
        }
        onSelectTotalCycles={(value) =>
          setTimerSettings((prev) => ({ ...prev, totalCycles: value }))
        }
      />

      <div class='flex justify-center'>
        {/* For TSX uncomment the commented types below */}
        <div className='grid grid-flow-col gap-5 text-center auto-cols-max'>
          <div className='flex flex-col'>
            <span className='countdown font-mono text-5xl'>
              <span
                style={{
                  '--value':
                    timerState.status === 'idle'
                      ? timerSettings.focusMinutes.toString()
                      : getMinutesLabel(remainingTimeMs).toString(),
                  '--digits': '2',
                }}
                aria-live='polite'
                aria-label={
                  timerState.status === 'idle'
                    ? timerSettings.focusMinutes
                    : getMinutesLabel(remainingTimeMs)
                }
              >
                {timerState.status === 'idle'
                  ? timerSettings.focusMinutes
                  : getMinutesLabel(remainingTimeMs)}
              </span>
            </span>
            min
          </div>
          <div className='flex flex-col'>
            <span className='countdown font-mono text-5xl'>
              <span
                style={{
                  '--value': timerState.status === 'idle' ? '0' : getSecondsLabel(remainingTimeMs),
                  '--digits': '2',
                }}
                aria-live='polite'
                aria-label={timerState.status === 'idle' ? 0 : getSecondsLabel(remainingTimeMs)}
              >
                {timerState.status === 'idle' ? 0 : getSecondsLabel(remainingTimeMs)}
              </span>
            </span>
            sec
          </div>
        </div>
      </div>
      <h2>{currentPhase === 'focus' ? 'FOCUS' : 'BREAK'}</h2>

      <div>
        <button type='button' class='btn btn-circle' onClick={handleStartPauseButton}>
          {timerState.status === 'running' ? (
            <svg
              class='w-6 h-6 '
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                fill-rule='evenodd'
                d='M8 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H8Zm7 0a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1Z'
                clip-rule='evenodd'
              />
            </svg>
          ) : (
            <svg
              class='w-6 h-6'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                fill-rule='evenodd'
                d='M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z'
                clip-rule='evenodd'
              />
            </svg>
          )}
        </button>
        <button
          type='button'
          class='btn btn-circle'
          aria-label='reset timer'
          onClick={handleResetButton}
        >
          <svg
            class='w-6 h-6'
            fill='currentColor'
            width='20'
            height='20'
            viewBox='0 0 1920 1920'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M960 0v213.333c411.627 0 746.667 334.934 746.667 746.667S1371.627 1706.667 960 1706.667 213.333 1371.733 213.333 960c0-197.013 78.4-382.507 213.334-520.747v254.08H640V106.667H53.333V320h191.04C88.64 494.08 0 720.96 0 960c0 529.28 430.613 960 960 960s960-430.72 960-960S1489.387 0 960 0'
              fill-rule='evenodd'
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
