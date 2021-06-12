import { makeRoute } from "@webcarrot/router";
import { make as makeMatch } from "@webcarrot/router-match";

import { Route, Match } from "./types";
import { RouteContext } from "../types";

const { match, build } = makeMatch<Match, RouteContext>(["/logger"]);

export const route: Route = makeRoute(
  "logger",
  match,
  build,
  () => import(/* webpackChunkName: "routes/logger/init" */ "./init")
);
