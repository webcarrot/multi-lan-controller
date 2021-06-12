import { savePlace } from "@webcarrot/multi-lan-controller/common/db";
import { Place } from "@webcarrot/multi-lan-controller/common/db/types";
import { LoggerAdminRecord } from "@webcarrot/multi-lan-controller/common/logger/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const save: AdminApiFunction<Place, Place> = async (
  placeToSave,
  { dbAccess, user, logger }
) => {
  checkIsAdmin(user);
  const newPlace = await savePlace(dbAccess, placeToSave);
  logger.append<LoggerAdminRecord>({
    type: "admin",
    userId: user.id,
    message: `${placeToSave.id ? "Change" : "Add"} place ${newPlace.id}/${
      newPlace.name
    }`,
  });
  return newPlace;
};
