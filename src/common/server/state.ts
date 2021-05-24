import { STATE_ENDPOINT } from "@webcarrot/multi-lan-controller/endpoints";
import { Context, Next } from "koa";
import { v4 } from "uuid";

export const makeStateHandlers = (): [
  (state: string, init: string) => string,
  (ctx: Context, next: Next) => Promise<any>
] => {
  const states = new Map<string, string>();
  const path = `/${STATE_ENDPOINT}/`;
  return [
    (state: string, init: string): string => {
      const id = v4();
      const value = `window.APP_STATE=JSON.parse(${JSON.stringify(
        state
      )});${init}`;
      states.set(id, value);
      setTimeout(() => {
        states.delete(id);
      }, 10000);
      return id;
    },
    (ctx: Context, next: Next) => {
      if (ctx.method === "GET" && ctx.path.startsWith(path)) {
        const id = ctx.path.substring(path.length);
        const value = states.has(id)
          ? states.get(id)
          : "document.location.reload()";
        ctx.type = "js";
        ctx.set({
          "Cache-Control": "private, max-age=10000, immutable",
        });
        ctx.body = value;
      } else {
        return next();
      }
    },
  ];
};
