import { savePlace } from "@webcarrot/multi-lan-controller/common/db";
import { Place } from "@webcarrot/multi-lan-controller/common/db/types";
import { LoggerAdminRecord } from "@webcarrot/multi-lan-controller/common/logger/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const save: AdminApiFunction<Place, Place> = async (
  toSave,
  { dbAccess, user, logger }
) => {
  checkIsAdmin(user);
  const saved = await savePlace(dbAccess, toSave);
  logger.append<LoggerAdminRecord>({
    type: "admin",
    userId: user.id,
    component: "place",
    changeType: toSave.id ? "edit" : "add",
    name: toSave.id ? toSave.name : saved.name,
    id: saved.id,
  });
  return saved;
};
