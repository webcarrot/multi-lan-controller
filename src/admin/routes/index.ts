import { Routes } from "./types";

import { route as dashboard } from "./dashboard";
import { route as notFound } from "./notFound";
import { route as users } from "./users";
import { route as places } from "./places";
import { route as devices } from "./devices";
import { route as settings } from "./settings";

export const routes: Routes = {
  dashboard,
  users,
  places,
  devices,
  settings,
  notFound,
};
