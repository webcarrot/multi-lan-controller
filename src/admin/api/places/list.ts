import { listPlaces } from "@webcarrot/multi-lan-controller/common/db";
import { Place } from "@webcarrot/multi-lan-controller/common/db/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const list: AdminApiFunction<null, ReadonlyArray<Place>> = async (
  _,
  { dbAccess, user }
) => {
  checkIsAdmin(user);
  return await listPlaces(dbAccess);
};
