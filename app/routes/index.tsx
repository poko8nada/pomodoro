import { createRoute } from 'honox/factory';
import Timer from '@/islands/timer';

export default createRoute((c) => {
  return c.render(
    <main class='mx-auto flex min-h-screen w-full max-w-4xl items-start justify-center px-4 py-6 sm:px-6 sm:py-10'>
      <title>pomodoro</title>
      <div class='w-full max-w-2xl space-y-6 text-center sm:space-y-8'>
        <header class='space-y-2'>
          <h1 class='text-2xl font-bold sm:text-4xl'>Pomodoro</h1>
        </header>
        <Timer />
      </div>
    </main>,
  );
});
