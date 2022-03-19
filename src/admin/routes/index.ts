import { Routes } from "./types";

import { route as dashboard } from "./dashboard";
import { route as notFound } from "./notFound";
import { route as users } from "./users";
import { route as places } from "./places";
import { route as devices } from "./devices";
import { route as settings } from "./settings";
import { route as actions } from "./actions";
import { route as logger } from "./logger";
import { route as stats } from "./stats";

export const routes: Routes = {
  dashboard,
  users,
  places,
  devices,
  settings,
  actions,
  logger,
  stats,
  notFound,
};
