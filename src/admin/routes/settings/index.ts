import { makeRoute } from "@webcarrot/router";
import { make as makeMatch } from "@webcarrot/router-match";

import { Route, Match } from "./types";
import { RouteContext } from "../types";
import { eq, oneOf, shape } from "@webcarrot/parse";

export const parseMatch = oneOf<Match>([
  shape({
    method: eq<"GET">("GET"),
  }),
]);

const { match, build } = makeMatch<Match, RouteContext>(
  ["/settings"],
  parseMatch
);

export const route: Route = makeRoute(
  "settings",
  match,
  build,
  () => import(/* webpackChunkName: "routes/settings/init" */ "./init")
);
