import { RouteAction } from "./types";
import { Success } from "@webcarrot/router";

export const action: RouteAction = async (payload) => ({
  url: payload.url,
  status: 200 as Success,
  title: "Logger",
});
