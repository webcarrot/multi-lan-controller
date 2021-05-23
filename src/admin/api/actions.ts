import * as dashboard from "./dashboard";
import * as devices from "./devices";
import * as places from "./places";
import * as users from "./users";
import * as settings from "./settings";

import { apiErrorHandlerWrapper as ew } from "@webcarrot/multi-lan-controller/common/utils/apiErrorHandlerWrapper";

export const actions = {
  // Dashboard
  "Dashboard/Status": ew(dashboard.status),
  "Dashboard/ChangeOut": ew(dashboard.changeOut),
  // Devices
  "Devices/List": ew(devices.list),
  "Devices/Save": ew(devices.save),
  // Places
  "Places/List": ew(places.list),
  "Places/Save": ew(places.save),
  // Users
  "Users/List": ew(users.list),
  "Users/Save": ew(users.save),
  // Settings
  "Settings/Read": ew(settings.read),
  "Settings/Save": ew(settings.save),
};
