import type { TimerSettings } from '@/components/timer/timer-types';

type TimerSettingsPanelProps = {
  cycleOptions: readonly number[];
  settings: TimerSettings;
  onDecreaseBreakMinutes: () => void;
  onDecreaseFocusMinutes: () => void;
  onIncreaseBreakMinutes: () => void;
  onIncreaseFocusMinutes: () => void;
  onSelectTotalCycles: (value: number) => void;
};

type MinutesFieldProps = {
  label: 'focus' | 'break';
  minutes: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

function MinutesField({ label, minutes, onDecrease, onIncrease }: MinutesFieldProps) {
  return (
    <div class='w-fit space-y-1 text-center'>
      <p class='text-sm'>{label}</p>
      <div class='inline-flex items-center justify-center gap-1 rounded-box px-1 py-1'>
        <button
          type='button'
          class='btn btn-square btn-xs btn-outline rounded-full'
          onClick={onDecrease}
        >
          ー
        </button>
        <div class='flex min-w-11 flex-col text-[10px] leading-none'>
          <span className='font-mono text-xl sm:text-2xl'>
            <span aria-live='polite' aria-label={minutes}>
              {minutes.toString().padStart(2, '0')}
            </span>
          </span>
          min
        </div>
        <button
          type='button'
          class='btn btn-square btn-xs btn-outline rounded-full'
          onClick={onIncrease}
        >
          ＋
        </button>
      </div>
    </div>
  );
}

export default function TimerSettingsPanel({
  cycleOptions,
  settings,
  onDecreaseBreakMinutes,
  onDecreaseFocusMinutes,
  onIncreaseBreakMinutes,
  onIncreaseFocusMinutes,
  onSelectTotalCycles,
}: TimerSettingsPanelProps) {
  return (
    <section class='w-full max-w-md space-y-3' aria-label='timer settings'>
      <div class='flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-center sm:gap-10'>
        <MinutesField
          label='focus'
          minutes={settings.focusMinutes}
          onDecrease={onDecreaseFocusMinutes}
          onIncrease={onIncreaseFocusMinutes}
        />
        <MinutesField
          label='break'
          minutes={settings.breakMinutes}
          onDecrease={onDecreaseBreakMinutes}
          onIncrease={onIncreaseBreakMinutes}
        />
      </div>
      <div class='space-y-1.5 text-center'>
        <p class='text-sm'>cycles</p>
        <div className='rating rating-xs space-x-1 sm:rating-sm'>
          {cycleOptions.map((cycleCount) => (
            <input
              type='radio'
              name='cycles'
              key={cycleCount}
              className='mask mask-circle'
              value={cycleCount}
              aria-label={`${cycleCount} times`}
              checked={settings.totalCycles === cycleCount}
              onClick={() => onSelectTotalCycles(cycleCount)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
