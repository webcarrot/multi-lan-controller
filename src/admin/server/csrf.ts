import { Context } from "koa";
import * as Tokens from "csrf";
import { CSRF_HEADER } from "./constants";

const csrfProvider = async (ctx: Context, tokens: Tokens) => {
  const secret =
    ctx.session.CSRF_TOKEN || (ctx.session.CSRF_TOKEN = await tokens.secret());
  if (ctx.method === "POST") {
    const token = ctx.get(CSRF_HEADER);
    if (!token || !tokens.verify(secret, token)) {
      throw new Error("invalid csrf token");
    }
  }
  return tokens.create(secret);
};

export const makeCsrfProvider = () => {
  const tokens = new Tokens({});
  return (ctx: Context) => csrfProvider(ctx, tokens);
};
