import { saveAction } from "@webcarrot/multi-lan-controller/common/db";
import { Action } from "@webcarrot/multi-lan-controller/common/db/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const save: AdminApiFunction<Action, Action> = async (
  deviceToSave,
  { dbAccess, user }
) => {
  checkIsAdmin(user);
  return await saveAction(dbAccess, deviceToSave);
};
