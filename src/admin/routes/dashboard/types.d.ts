import {
  MatchInfo,
  Output as OutputInt,
  Action as ActionInt,
  Component as ComponentInt,
  RouteInterface,
} from "@webcarrot/router";

import { RouteContext } from "../types";
import { AppContext } from "@webcarrot/multi-lan-controller/admin/app/types";
import { DashboardAction, DashboardPlace } from "../../api/dashboard/types";
import {
  DeviceOutNo,
  Settings,
} from "@webcarrot/multi-lan-controller/common/db/types";

export type ID = "dashboard";

export type Match =
  | {
      mode?: undefined;
      method?: "GET";
    }
  | {
      mode: "sort";
      method?: "GET";
    };

export type RouteAction = ActionInt<Match, Output, RouteContext>;

export type Output = OutputInt & {
  readonly settings: Settings;
  readonly actions: ReadonlyArray<DashboardAction>;
  readonly dashboards: ReadonlyArray<DashboardPlace>;
  readonly sort: boolean;
};

export type Component = ComponentInt<ID, Match, Output, RouteContext>;

export type Route = RouteInterface<ID, Match, Output, AppContext>;

export type ActiveOut = { readonly name: string; readonly no: DeviceOutNo };

export type Prepare = Route["prepare"];
