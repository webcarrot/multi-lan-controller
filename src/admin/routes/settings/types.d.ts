import {
  Output as GenericOutput,
  Action as ActionInt,
  Component as ComponentInt,
  RouteInterface,
} from "@webcarrot/router";

import { RouteContext } from "../types";
import { AppContext } from "@webcarrot/multi-lan-controller/admin/app/types";
import {
  Settings,
  Action,
  Place,
  Device,
} from "@webcarrot/multi-lan-controller/common/db/types";
import { DashboardPlace } from "../../api/dashboard/types";

export type ID = "settings";

export type Match = {
  method?: "GET";
};

export type RouteAction = ActionInt<Match, Output, RouteContext>;

export type Output = GenericOutput & {
  readonly settings: Settings;
  readonly actions: ReadonlyArray<Action>;
  readonly dashboard: ReadonlyArray<DashboardPlace>;
};

export type Component = ComponentInt<ID, Match, Output, RouteContext>;

export type Route = RouteInterface<ID, Match, Output, AppContext>;
