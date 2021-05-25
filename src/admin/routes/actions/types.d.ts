import {
  Output as GenericOutput,
  Action as ActionInt,
  Component as ComponentInt,
  RouteInterface,
} from "@webcarrot/router";

import { Mode, RouteContext } from "../types";
import { AppContext } from "@webcarrot/multi-lan-controller/admin/app/types";
import { Action } from "@webcarrot/multi-lan-controller/common/db/types";

export type ID = "actions";

export type Match =
  | {
      mode?: "list";
      method?: "GET";
    }
  | {
      mode: "add";
      method?: "GET";
    }
  | {
      mode: "edit";
      method?: "GET";
      id: string;
    };

export type RouteAction = ActionInt<Match, Output, RouteContext>;

export type Output = GenericOutput & {
  readonly mode: Mode;
  readonly list: ReadonlyArray<Action>;
  readonly item: Action;
};

export type Component = ComponentInt<ID, Match, Output, RouteContext>;

export type Route = RouteInterface<ID, Match, Output, AppContext>;
