import { jsxRenderer } from 'hono/jsx-renderer';
import { Link, Script } from 'honox/server';

export default jsxRenderer(({ children }) => {
  return (
    <html lang='ja' data-theme='nord'>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='description' content='A small pomodoro timer app.' />
        <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
        <Link href='/app/style.css' rel='stylesheet' />
        <Script src='/app/client.ts' async />
      </head>
      <body>{children}</body>
    </html>
  );
});
