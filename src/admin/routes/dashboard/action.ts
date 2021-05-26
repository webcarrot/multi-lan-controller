import { RouteAction } from "./types";
import { Success } from "@webcarrot/router";

export const action: RouteAction = async (payload, { mode }, { adminApi }) => ({
  url: payload.url,
  status: 200 as Success,
  title: "Multi Lan Controller",
  dashboards: await adminApi("Dashboard/Status", null),
  settings: await adminApi("Settings/Read", null),
  actions: await adminApi("Dashboard/Actions", null),
  sort: mode === "sort",
});
