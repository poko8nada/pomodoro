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
    <div class='space-y-2'>
      <p>{label}</p>
      <div class='flex gap-2 justify-center'>
        <button
          type='button'
          class='btn btn-square btn-xs btn-outline rounded-full self-center'
          onClick={onDecrease}
        >
          ー
        </button>
        <div class='flex flex-col text-sm'>
          <span className='font-mono text-2xl'>
            <span aria-live='polite' aria-label={minutes}>
              {minutes.toString().padStart(2, '0')}
            </span>
          </span>
          min
        </div>
        <button
          type='button'
          class='btn btn-square btn-xs btn-outline rounded-full self-center'
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
    <div class='space-y-0'>
      <div class='flex gap-8 justify-center'>
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
      <div class='space-y-2'>
        <p>cycles</p>
        <div className='rating rating-sm space-x-1'>
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
    </div>
  );
}
