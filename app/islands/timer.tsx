import { useEffect, useState } from 'hono/jsx';

type TimerProps = {
  status: 'idle' | 'running' | 'paused';
  phase: 'focus' | 'break';
  endTime: number;
  remainingMs: number;
  cycles: number;
};

const FOCUS_MINUTES = 0.25;
const FOCUS_TIME = FOCUS_MINUTES * 1000 * 60;
const BREAK_TIME = 0.2 * 1000 * 60;

const getMinutes = (ms: number) => Math.floor((ms / (1000 * 60)) % 60);
const getSeconds = (ms: number) => Math.floor((ms / 1000) % 60);

export default function Timer() {
  const [timer, setTimer] = useState<TimerProps>({
    status: 'idle',
    phase: 'focus',
    endTime: Date.now() + FOCUS_TIME,
    remainingMs: FOCUS_TIME,
    cycles: 1,
  });

  useEffect(() => {
    if (timer.status !== 'running') return;
    const interval = setInterval(() => {
      setTimer((prev) => ({
        ...prev,
        remainingMs: Math.max(0, prev.endTime - Date.now()),
      }));
    }, 250);
    return () => clearInterval(interval);
  }, [timer.status]);

  useEffect(() => {
    if (timer.remainingMs !== 0) return;
    if (timer.phase === 'focus') {
      setTimer((prev) => ({
        ...prev,
        phase: 'break',
        remainingMs: BREAK_TIME,
        endTime: Date.now() + BREAK_TIME,
      }));
      return;
    }
    setTimer((prev) => ({
      ...prev,
      phase: 'focus',
      remainingMs: FOCUS_TIME,
      endTime: Date.now() + FOCUS_TIME,
    }));
  }, [timer.remainingMs, timer.phase]);

  useEffect(() => {
    if (timer.phase !== 'break' || timer.remainingMs !== 0) return;
    if (timer.cycles > 1) {
      setTimer((prev) => ({
        ...prev,
        cycles: prev.cycles - 1,
      }));
      return;
    }
    setTimer(() => ({
      status: 'idle',
      phase: 'focus',
      endTime: 0,
      remainingMs: FOCUS_TIME,
      cycles: 1,
    }));
  }, [timer.cycles, timer.phase, timer.remainingMs]);

  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      setTimer((prev) => ({
        ...prev,
        endTime: Date.now() + prev.remainingMs,
      }));
    });
  }, []);

  const handleClick = () => {
    switch (timer.status) {
      case 'running':
        setTimer((prev) => ({
          ...prev,
          status: 'paused',
          endTime: Date.now() + prev.remainingMs,
        }));
        break;
      case 'idle':
        setTimer((prev) => ({
          ...prev,
          status: 'running',
          endTime: Date.now() + FOCUS_TIME,
          remainingMs: FOCUS_TIME,
        }));
        break;
      case 'paused':
        setTimer((prev) => ({
          ...prev,
          status: 'running',
          endTime: Date.now() + prev.remainingMs,
        }));
        break;
    }
  };

  return (
    <div>
      <h2>{timer.phase.toUpperCase()}</h2>
      <h2>
        {getMinutes(timer.remainingMs)}:{getSeconds(timer.remainingMs)}
      </h2>
      <button type='button' class={'btn'} onClick={handleClick}>
        {timer.status == 'running' ? 'Pause' : 'Start'}
      </button>
    </div>
  );
}
