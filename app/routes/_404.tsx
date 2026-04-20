import type { NotFoundHandler } from 'hono';

const handler: NotFoundHandler = (c) => {
  c.status(404);
  return c.render('Page not found.');
};

export default handler;
