import { makeRoute } from "@webcarrot/router";
import { make as makeMatch } from "@webcarrot/router-match";

import { Route, Match } from "./types";
import { RouteContext } from "../types";

const { match, build } = makeMatch<Match, RouteContext>(["/sort", "/"]);

export const route: Route = makeRoute(
  "dashboard",
  match,
  build,
  () => import(/* webpackChunkName: "routes/dashboard/init" */ "./init")
);
