import { makeRoute } from "@webcarrot/router";
import { Route } from "./types";

export const route: Route = makeRoute(
  "notFound",
  (_, { method }) => ({
    method
  }),
  () => "",
  () => import(/* webpackChunkName: "routes/notFound/init" */ "./init")
);
