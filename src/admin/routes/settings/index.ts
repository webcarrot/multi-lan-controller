import { makeRoute } from "@webcarrot/router";
import { make as makeMatch } from "@webcarrot/router-match";

import { Route, Match } from "./types";
import { RouteContext } from "../types";

const { match, build } = makeMatch<Match, RouteContext>(["/settings"]);

export const route: Route = makeRoute(
  "settings",
  match,
  build,
  () => import(/* webpackChunkName: "routes/settings/init" */ "./init")
);
