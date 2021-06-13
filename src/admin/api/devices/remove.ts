import { removeDevice } from "@webcarrot/multi-lan-controller/common/db";
import { Device } from "@webcarrot/multi-lan-controller/common/db/types";
import { LoggerAdminRecord } from "@webcarrot/multi-lan-controller/common/logger/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const remove: AdminApiFunction<Device, null> = async (
  toRemove,
  { dbAccess, user, logger }
) => {
  checkIsAdmin(user);
  await removeDevice(dbAccess, toRemove);
  logger.append<LoggerAdminRecord>({
    type: "admin",
    userId: user.id,
    component: "device",
    changeType: "remove",
    name: toRemove.name,
    id: toRemove.id,
  });
  return null;
};
