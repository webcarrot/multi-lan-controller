import { Action } from "./types";
import { ClientError } from "@webcarrot/router";

export const action: Action = async payload => {
  return {
    url: payload.url,
    status: 404 as ClientError,
    title: "Not found"
  };
};
