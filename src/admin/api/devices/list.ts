import { listDevices } from "@webcarrot/multi-lan-controller/common/db";
import { Device } from "@webcarrot/multi-lan-controller/common/db/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const list: AdminApiFunction<null, ReadonlyArray<Device>> = async (
  _,
  { dbAccess, user }
) => {
  checkIsAdmin(user);
  return await listDevices(dbAccess);
};
