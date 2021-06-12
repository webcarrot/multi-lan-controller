import {
  DbAccess,
  User,
} from "@webcarrot/multi-lan-controller/common/db/types";
import {
  loginUser,
  getUserById,
} from "@webcarrot/multi-lan-controller/common/db";

import { Context } from "koa";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { getBody } from "@webcarrot/multi-lan-controller/common/utils/getBody";
import { Login } from "./login";
import {
  Logger,
  LoggerAuthRecord,
} from "@webcarrot/multi-lan-controller/common/logger/types";

export const getUser = async (
  ctx: Context,
  dbAccess: DbAccess
): Promise<User> => {
  if (ctx.session.userId) {
    const user = await getUserById(dbAccess, ctx.session.userId);
    if (!user) {
      ctx.session = null;
    }
    return user;
  }
  return null;
};

export const authHandler = async (
  ctx: Context,
  dbAccess: DbAccess,
  logger: Logger
): Promise<void> => {
  let error = false;
  if (ctx.method === "POST") {
    try {
      const { login, password } = await getBody(ctx);
      const user = await loginUser(dbAccess, login, password);
      if (user) {
        ctx.session.userId = user.id;
        ctx.session.save();
        ctx.redirect(ctx.path);
        logger.append<LoggerAuthRecord>({
          type: "auth",
          userId: user.id,
          message: `User ${login} logged in`,
        });
        return;
      } else {
        ctx.session = null;
        error = true;
      }
    } catch (_) {
      error = true;
    }
  }

  const meta = [
    {
      name: "viewport",
      content:
        ctx.headers["user-agent"] &&
        /iPad|iPhone/.test(ctx.headers["user-agent"])
          ? "width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
          : "width=device-width,minimum-scale=1.0",
    },
  ];

  ctx.type = "html";
  ctx.body =
    "<!doctype html>" +
    renderToStaticMarkup(
      createElement(Login, {
        title: `Login`,
        error,
        meta,
      })
    );
};

export const signOutHandler = async (ctx: Context) => {
  ctx.session = null;
  ctx.redirect("/");
};
