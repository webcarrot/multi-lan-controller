import { adminPageHandler } from "./page";

import { makeCsrfProvider } from "./csrf";
import { Context } from "koa";
import { errorHandler } from "@webcarrot/multi-lan-controller/common/server/error";
import {
  API_ENDPOINT,
  SIGNOUT_ENDPOINT,
} from "@webcarrot/multi-lan-controller/endpoints";
import { adminApiHandler } from "./api";
import { DbAccess } from "@webcarrot/multi-lan-controller/common/db/types";
import { getUser, authHandler, signOutHandler } from "./auth";

const adminHandler = async (
  ctx: Context,
  next: () => Promise<any>,
  csrfProvider: (ctx: Context) => Promise<string>,
  storeState: (state: string, init: string) => string,
  dbAccess: DbAccess
) => {
  let user = await getUser(ctx, dbAccess);
  if (!user) {
    ctx.set({
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    });
    return await authHandler(ctx, dbAccess);
  }
  if (ctx.path === `/${SIGNOUT_ENDPOINT}`) {
    return await signOutHandler(ctx);
  }
  const csrfSecret = await csrfProvider(ctx);
  ctx.set({
    "Cache-Control": "private, no-cache, no-store, must-revalidate",
  });
  if (ctx.method === "POST" && ctx.path === `/${API_ENDPOINT}`) {
    return await adminApiHandler(ctx, dbAccess, user);
  } else {
    return await adminPageHandler(
      ctx,
      next,
      csrfSecret,
      storeState,
      dbAccess,
      user
    );
  }
};

export const makeAdminHandlers = (
  storeState: (state: string, init: string) => string,
  dbAccess: DbAccess
) => {
  const csrfProvider = makeCsrfProvider();
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      return await adminHandler(ctx, next, csrfProvider, storeState, dbAccess);
    } catch (error) {
      return await errorHandler(ctx, error);
    }
  };
};
