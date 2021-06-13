import { removePlace } from "@webcarrot/multi-lan-controller/common/db";
import { Place } from "@webcarrot/multi-lan-controller/common/db/types";
import { LoggerAdminRecord } from "@webcarrot/multi-lan-controller/common/logger/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const remove: AdminApiFunction<Place, null> = async (
  toRemove,
  { dbAccess, user, logger }
) => {
  checkIsAdmin(user);
  await removePlace(dbAccess, toRemove);
  logger.append<LoggerAdminRecord>({
    type: "admin",
    userId: user.id,
    component: "place",
    changeType: "remove",
    name: toRemove.name,
    id: toRemove.id,
  });
  return null;
};
