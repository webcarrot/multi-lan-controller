import { saveSettings } from "@webcarrot/multi-lan-controller/common/db";
import { Settings } from "@webcarrot/multi-lan-controller/common/db/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const save: AdminApiFunction<Settings, Settings> = async (
  settings,
  { dbAccess, user }
) => {
  checkIsAdmin(user);
  return await saveSettings(dbAccess, settings);
};
