import { saveUser } from "@webcarrot/multi-lan-controller/common/db";
import { User } from "@webcarrot/multi-lan-controller/common/db/types";
import { LoggerAdminRecord } from "@webcarrot/multi-lan-controller/common/logger/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const save: AdminApiFunction<User, User> = async (
  userToSave,
  { dbAccess, user, logger }
) => {
  checkIsAdmin(user);
  const newUser = await saveUser(dbAccess, userToSave);
  logger.append<LoggerAdminRecord>({
    type: "admin",
    userId: user.id,
    component: "user",
    id: newUser.id,
  });
  return newUser;
};
