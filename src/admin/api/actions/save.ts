import { saveAction } from "@webcarrot/multi-lan-controller/common/db";
import { Action } from "@webcarrot/multi-lan-controller/common/db/types";
import { LoggerAdminRecord } from "@webcarrot/multi-lan-controller/common/logger/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const save: AdminApiFunction<Action, Action> = async (
  actionToSave,
  { dbAccess, user, logger }
) => {
  checkIsAdmin(user);
  const newAction = await saveAction(dbAccess, actionToSave);
  logger.append<LoggerAdminRecord>({
    type: "admin",
    userId: user.id,
    component: "action",
    id: newAction.id,
  });
  return newAction;
};
