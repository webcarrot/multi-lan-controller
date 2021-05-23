import { Action } from "./types";
import { Success } from "@webcarrot/router";

export const action: Action = async (payload, {}, { adminApi }) => ({
  url: payload.url,
  status: 200 as Success,
  title: "Multi Lan Controller",
  dashboards: await adminApi("Dashboard/Status", null),
});
