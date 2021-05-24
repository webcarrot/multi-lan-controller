import {
  MatchInfo,
  Output as OutputInt,
  Action as ActionInt,
  Component as ComponentInt,
  RouteInterface,
} from "@webcarrot/router";

import { RouteContext } from "../types";
import { AppContext } from "@webcarrot/multi-lan-controller/admin/app/types";
import { DashboardPlace } from "../../api/dashboard/types";
import { Settings } from "@webcarrot/multi-lan-controller/common/db/types";
import { DeviceOutNo } from "../../device/types";

export type ID = "dashboard";

export type Match = MatchInfo;

export type Action = ActionInt<Match, Output, RouteContext>;

export type Output = OutputInt & {
  readonly settings: Settings;
  readonly dashboards: ReadonlyArray<DashboardPlace>;
};

export type Component = ComponentInt<ID, Match, Output, RouteContext>;

export type Route = RouteInterface<ID, Match, Output, AppContext>;

export type ActiveOut = { readonly name: string; readonly no: DeviceOutNo };
