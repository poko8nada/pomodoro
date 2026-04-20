type TimerCycleStatusProps = {
  remainingCycles: number;
  totalCycles: number;
};

export default function TimerCycleStatus({ remainingCycles, totalCycles }: TimerCycleStatusProps) {
  return (
    <div class='text-center' aria-live='polite'>
      <p class='font-mono text-xl sm:text-2xl'>
        {remainingCycles}
        <span class='text-sm sm:text-base'> / {totalCycles}</span>
      </p>
    </div>
  );
}
