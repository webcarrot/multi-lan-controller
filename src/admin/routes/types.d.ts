import { FullContext, RoutesMap } from "@webcarrot/router";
import { AppContext } from "../app/types";

import { Route as Dashboard } from "./dashboard/types";
import { Route as NotFound } from "./notFound/types";
import { Route as Users } from "./users/types";
import { Route as Places } from "./places/types";
import { Route as Devices } from "./devices/types";
import { Route as Settings } from "./settings/types";
import { Route as Actions } from "./actions/types";
import { Route as Logger } from "./logger/types";
import { Route as Stats } from "./stats/types";

export type RoutesType =
  | Dashboard
  | NotFound
  | Users
  | Places
  | Devices
  | Settings
  | Actions
  | Logger
  | Stats;
export type Routes = RoutesMap<RoutesType>;
export type RouteContext = FullContext<RoutesType, AppContext>;
export type Mode = "list" | "edit" | "add";
