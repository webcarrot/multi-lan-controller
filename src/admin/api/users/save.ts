import { saveUser } from "@webcarrot/multi-lan-controller/common/db";
import { User } from "@webcarrot/multi-lan-controller/common/db/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const save: AdminApiFunction<User, User> = async (
  userToSave,
  { dbAccess, user }
) => {
  checkIsAdmin(user);
  return await saveUser(dbAccess, userToSave);
};
