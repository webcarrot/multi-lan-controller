import * as Koa from "koa";
import * as Compress from "koa-compress";
import { randomBytes } from "crypto";
import { makeBuildHandler } from "./build";

import { makeAdminHandlers } from "@webcarrot/multi-lan-controller/admin/server";
import { keepAliveHandler } from "./keepAlive";
import { makeStateHandlers } from "./state";
import * as session from "koa-session";
import { DbAccess } from "../db/types";
import { Logger } from "../logger/types";

export const makeApp = async (
  dbAccess: DbAccess,
  logger: Logger,
  devMode: boolean
) => {
  const server = new Koa();
  server.keys = devMode ? ["dev"] : [randomBytes(128).toString("hex")];
  const [storeState, stateHandler] = makeStateHandlers();
  server
    .use(keepAliveHandler)
    .use(stateHandler)
    .use(makeBuildHandler())
    .use(
      Compress({
        br: false,
        deflate: false,
      })
    )
    .use(session(server))
    .use(makeAdminHandlers(storeState, dbAccess, logger));
  return server;
};
