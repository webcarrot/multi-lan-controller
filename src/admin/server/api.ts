import { getJsonBody } from "@webcarrot/multi-lan-controller/common/utils/getBody";
import { Context } from "koa";
import { make as makeApi } from "../api";
import {
  DbAccess,
  User,
} from "@webcarrot/multi-lan-controller/common/db/types";
import { Logger } from "@webcarrot/multi-lan-controller/common/logger/types";

export const adminApiHandler = async (
  ctx: Context,
  dbAccess: DbAccess,
  logger: Logger,
  user: User
) => {
  ctx.compress = true;
  const { action, payload, batch } = await getJsonBody(ctx);
  const callApi = await makeApi(dbAccess, logger, user);
  let data: any;
  if (batch instanceof Array) {
    data = await Promise.all(
      batch.map(async ({ action, payload }) => {
        try {
          return {
            ok: true,
            value: await callApi(action, payload),
          };
        } catch (err) {
          return {
            ok: false,
            value: err,
          };
        }
      })
    );
  } else {
    data = await callApi(action, payload);
  }
  ctx.type = "json";
  ctx.status = 200;
  ctx.body = JSON.stringify(data);
};
