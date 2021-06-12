import { saveDevice } from "@webcarrot/multi-lan-controller/common/db";
import { Device } from "@webcarrot/multi-lan-controller/common/db/types";
import { LoggerAdminRecord } from "@webcarrot/multi-lan-controller/common/logger/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const save: AdminApiFunction<Device, Device> = async (
  deviceToSave,
  { dbAccess, user, logger }
) => {
  checkIsAdmin(user);
  const newDevice = await saveDevice(dbAccess, deviceToSave);
  logger.append<LoggerAdminRecord>({
    type: "admin",
    userId: user.id,
    component: "device",
    id: newDevice.id,
  });
  return newDevice;
};
