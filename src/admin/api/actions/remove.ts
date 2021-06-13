import { removeAction } from "@webcarrot/multi-lan-controller/common/db";
import { Action } from "@webcarrot/multi-lan-controller/common/db/types";
import { LoggerAdminRecord } from "@webcarrot/multi-lan-controller/common/logger/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const remove: AdminApiFunction<Action, null> = async (
  toRemove,
  { dbAccess, user, logger }
) => {
  checkIsAdmin(user);
  await removeAction(dbAccess, toRemove);
  logger.append<LoggerAdminRecord>({
    type: "admin",
    userId: user.id,
    component: "action",
    changeType: "remove",
    name: toRemove.name,
    id: toRemove.id,
  });
  return null;
};
