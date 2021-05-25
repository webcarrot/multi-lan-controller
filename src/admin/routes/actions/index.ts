import { makeRoute } from "@webcarrot/router";
import { make as makeMatch } from "@webcarrot/router-match";

import { Route, Match } from "./types";
import { RouteContext } from "../types";
import { eq, oneOf, shape } from "@webcarrot/parse";
import { parseId } from "@webcarrot/multi-lan-controller/common/db/parse";

export const parseMatch = oneOf<Match>([
  shape({
    method: eq<"GET">("GET"),
    mode: eq<"list">("list", { optional: true }),
  }),
  shape({
    method: eq<"GET">("GET"),
    mode: eq<"edit">("edit"),
    id: parseId,
  }),
  shape({
    method: eq<"GET">("GET"),
    mode: eq<"add">("add"),
  }),
]);

const { match, build } = makeMatch<Match, RouteContext>(
  ["/actions/:mode/:id?", "/actions"],
  parseMatch
);

export const route: Route = makeRoute(
  "actions",
  match,
  build,
  () => import(/* webpackChunkName: "routes/actions/init" */ "./init")
);
