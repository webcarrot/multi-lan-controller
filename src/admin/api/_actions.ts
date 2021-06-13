import * as dashboard from "./dashboard";
import * as devices from "./devices";
import * as _actions from "./actions";

import * as places from "./places";
import * as users from "./users";
import * as settings from "./settings";
import * as logger from "./logger";

import { apiErrorHandlerWrapper as ew } from "@webcarrot/multi-lan-controller/common/utils/apiErrorHandlerWrapper";

export const actions = {
  // Dashboard
  "Dashboard/Status": ew(dashboard.status),
  "Dashboard/Actions": ew(dashboard.actions),
  "Dashboard/Action": ew(dashboard.action),
  // Devices
  "Devices/List": ew(devices.list),
  "Devices/Save": ew(devices.save),
  "Devices/Remove": ew(devices.remove),
  // Actions
  "Actions/List": ew(_actions.list),
  "Actions/Save": ew(_actions.save),
  "Actions/Remove": ew(_actions.remove),
  // Places
  "Places/List": ew(places.list),
  "Places/Save": ew(places.save),
  "Places/Remove": ew(places.remove),
  // Users
  "Users/List": ew(users.list),
  "Users/Save": ew(users.save),
  "Users/Remove": ew(users.remove),
  // Settings
  "Settings/Read": ew(settings.read),
  "Settings/Save": ew(settings.save),
  "Settings/Sort": ew(settings.sort),
  // Logger
  "Logger/List": ew(logger.list),
};
