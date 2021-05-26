import { makeRoute } from "@webcarrot/router";
import { make as makeMatch } from "@webcarrot/router-match";

import { Route, Match } from "./types";
import { RouteContext } from "../types";
import { eq, shape } from "@webcarrot/parse";

export const parseMatch = shape({
  method: eq<"GET">("GET"),
  mode: eq<"sort">("sort", { optional: true }),
});

const { match, build } = makeMatch<Match, RouteContext>(
  ["/:mode", "/"],
  parseMatch
);

export const route: Route = makeRoute(
  "dashboard",
  match,
  build,
  () => import(/* webpackChunkName: "routes/dashboard/init" */ "./init")
);
