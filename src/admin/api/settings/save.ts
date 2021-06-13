import { saveSettings } from "@webcarrot/multi-lan-controller/common/db";
import { Settings } from "@webcarrot/multi-lan-controller/common/db/types";
import { LoggerAdminRecord } from "@webcarrot/multi-lan-controller/common/logger/types";
import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

export const save: AdminApiFunction<Settings, Settings> = async (
  settings,
  { dbAccess, user, logger }
) => {
  checkIsAdmin(user);
  const saved = await saveSettings(dbAccess, settings);
  logger.append<LoggerAdminRecord>({
    type: "admin",
    userId: user.id,
    component: "settings",
    changeType: "edit",
    name: "",
    id: null,
  });
  return saved;
};
