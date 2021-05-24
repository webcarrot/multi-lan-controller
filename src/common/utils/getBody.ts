import { Context } from "koa";
import * as BodyParse from "co-body";

export const getBody = async (ctx: Context) => {
  if (ctx.method === "POST") {
    if ("body" in ctx.req) {
      return (ctx.req as any).body;
    } else {
      return (await BodyParse.form(ctx, { limit: "100mb" })) || {};
    }
  }
};

export const getJsonBody = async (ctx: Context) => {
  if (ctx.method === "POST") {
    if ("body" in ctx.req) {
      return (ctx.req as any).body;
    } else {
      return (await BodyParse.json(ctx, { limit: "100mb" })) || {};
    }
  }
};
