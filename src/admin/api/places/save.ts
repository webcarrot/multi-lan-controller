import { savePlace } from "@webcarrot/multi-lan-controller/common/db";
import { Place } from "@webcarrot/multi-lan-controller/common/db/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const save: AdminApiFunction<Place, Place> = async (
  placeToSave,
  { dbAccess, user }
) => {
  checkIsAdmin(user);
  return await savePlace(dbAccess, placeToSave);
};
