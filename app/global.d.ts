import 'hono';

declare module 'hono' {
  interface Env {
    Variables: {};
    Bindings: {};
  }
}
