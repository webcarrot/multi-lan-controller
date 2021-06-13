import { saveUser } from "@webcarrot/multi-lan-controller/common/db";
import { User } from "@webcarrot/multi-lan-controller/common/db/types";
import { LoggerAdminRecord } from "@webcarrot/multi-lan-controller/common/logger/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const save: AdminApiFunction<User, User> = async (
  toSave,
  { dbAccess, user, logger }
) => {
  checkIsAdmin(user);
  const saved = await saveUser(dbAccess, toSave);
  logger.append<LoggerAdminRecord>({
    type: "admin",
    userId: user.id,
    component: "user",
    changeType: toSave.id ? "edit" : "add",
    name: toSave.id ? toSave.name : saved.name,
    id: saved.id,
  });
  return saved;
};
