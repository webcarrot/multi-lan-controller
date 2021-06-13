import { Context } from "koa";
import { getErrorHtml } from "./errorHtml";

export { getErrorHtml };

export const errorHandler = async (ctx: Context, err: any) => {
  let message: string;
  if (err && err.message) {
    message = err.message;
  } else {
    message = "Unknown error";
  }

  ctx.status = 400;
  if (ctx.accepts("html")) {
    ctx.type = "html";
    const url = `${ctx.protocol}://${ctx.host}`;
    ctx.body = await getErrorHtml(url, message, false);
  } else {
    ctx.type = "json";
    ctx.body = JSON.stringify({
      message,
    });
  }
};
