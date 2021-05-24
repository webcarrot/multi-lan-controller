import { Context } from "koa";

export const keepAliveHandler = (ctx: Context, next: () => Promise<any>) => {
  ctx.set({
    Connection: "keep-alive",
    "Keep-Alive": "timeout=5, max=180000"
  });
  return next();
};
