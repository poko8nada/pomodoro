import tailwindcss from '@tailwindcss/vite';
import client from 'honox/vite/client';
import honox from 'honox/vite';
import ssg from '@hono/vite-ssg';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const appDir = fileURLToPath(new URL('./app', import.meta.url));

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      resolve: {
        alias: {
          '@': appDir,
        },
      },
      build: {
        rollupOptions: {
          input: ['./app/client.ts', './app/style.css'],
        },
        manifest: true,
        emptyOutDir: false,
      },
      plugins: [client(), tailwindcss()],
    };
  }

  return {
    resolve: {
      alias: {
        '@': appDir,
      },
    },
    build: {
      emptyOutDir: false,
    },
    plugins: [
      honox({
        client: { input: ['/app/client.ts', '/app/style.css'] },
      }),
      tailwindcss(),
      ssg({
        entry: './app/server.ts',
      }),
    ],
  };
});
