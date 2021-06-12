import { listActions } from "@webcarrot/multi-lan-controller/common/db";
import { Action } from "@webcarrot/multi-lan-controller/common/db/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const list: AdminApiFunction<null, ReadonlyArray<Action>> = async (
  _,
  { dbAccess, user }
) => {
  checkIsAdmin(user);
  return await listActions(dbAccess);
};
