import { Action } from "./types";
import { Success } from "@webcarrot/router";

export const action: Action = async (payload, _, { adminApi }) => {
  const settings = await adminApi("Settings/Read", null);
  return {
    url: payload.url,
    status: 200 as Success,
    title: "Settings",
    settings,
  };
};
