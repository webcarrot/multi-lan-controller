import { saveDevice } from "@webcarrot/multi-lan-controller/common/db";
import { Device } from "@webcarrot/multi-lan-controller/common/db/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const save: AdminApiFunction<Device, Device> = async (
  deviceToSave,
  { dbAccess, user }
) => {
  checkIsAdmin(user);
  return await saveDevice(dbAccess, deviceToSave);
};
