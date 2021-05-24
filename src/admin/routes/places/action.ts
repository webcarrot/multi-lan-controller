import { Action } from "./types";
import { Redirection, Success } from "@webcarrot/router";
import { Mode } from "../types";
import { Place } from "@webcarrot/multi-lan-controller/common/db/types";

export const action: Action = async (payload, params, { route, adminApi }) => {
  let item: Place = null;
  let mode: Mode = "list";
  let title: string;
  const list = await adminApi("Places/List", null);
  if (params && params.mode) {
    switch (params.mode) {
      case "add":
        mode = "add";
        title = "Add new place";
        break;
      case "edit":
        mode = "edit";
        item = list.find(({ id }) => id === params.id);
        if (!item) {
          throw new Error("Place not found");
        }
        title = `Edit "${item.name}" place`;
        break;
      default:
        return {
          status: 301 as Redirection,
          url: route.makeLink("places", {}),
        };
    }
  } else {
    title = "List of places";
  }
  return {
    url: payload.url,
    status: 200 as Success,
    title,
    item,
    list,
    mode,
  };
};
