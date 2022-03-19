import {
  Output as GenericOutput,
  Action as ActionInt,
  Component as ComponentInt,
  RouteInterface,
} from "@webcarrot/router";

import { RouteContext } from "../types";
import { AppContext } from "@webcarrot/multi-lan-controller/admin/app/types";

export type ID = "stats";

export type Match = {
  method?: "GET";
};

export type RouteAction = ActionInt<Match, Output, RouteContext>;

export type Output = GenericOutput;

export type Component = ComponentInt<ID, Match, Output, RouteContext>;

export type Route = RouteInterface<ID, Match, Output, AppContext>;
