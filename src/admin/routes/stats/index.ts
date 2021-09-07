import { makeRoute } from "@webcarrot/router";
import { make as makeMatch } from "@webcarrot/router-match";

import { Route, Match } from "./types";
import { RouteContext } from "../types";

const { match, build } = makeMatch<Match, RouteContext>(["/stats"]);

export const route: Route = makeRoute(
  "stats",
  match,
  build,
  () => import(/* webpackChunkName: "routes/stats/init" */ "./init")
);
