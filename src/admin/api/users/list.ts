import { listUsers } from "@webcarrot/multi-lan-controller/common/db";
import { User } from "@webcarrot/multi-lan-controller/common/db/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const list: AdminApiFunction<null, ReadonlyArray<User>> = async (
  _,
  { dbAccess, user }
) => {
  checkIsAdmin(user);
  return await listUsers(dbAccess);
};
