import {
  MatchInfo,
  Output as OutputInt,
  Action as ActionInt,
  Component as ComponentInt,
  RouteInterface,
} from "@webcarrot/router";

import { RouteContext } from "../types";
import { AppContext } from "@webcarrot/multi-lan-controller/admin/app/types";

export type ID = "notFound";

export type Match = MatchInfo;

export type Action = ActionInt<Match, Output, RouteContext>;

export type Output = OutputInt;

export type Component = ComponentInt<ID, Match, Output, RouteContext>;

export type Route = RouteInterface<ID, Match, Output, AppContext>;
