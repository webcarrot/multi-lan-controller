import { RouteAction } from "./types";
import { Redirection, Success } from "@webcarrot/router";
import { Mode } from "../types";
import { Action } from "@webcarrot/multi-lan-controller/common/db/types";

export const action: RouteAction = async (
  payload,
  params,
  { route, adminApi }
) => {
  let item: Action = null;
  let mode: Mode = "list";
  let title: string;
  const list = await adminApi("Actions/List", null);
  if (params && params.mode) {
    switch (params.mode) {
      case "add":
        mode = "add";
        title = "Add new action";
        break;
      case "edit":
        mode = "edit";
        item = list.find(({ id }) => id === params.id);
        if (!item) {
          throw new Error("Action not found");
        }
        title = `Edit "${item.name}" token unit`;
        break;
      default:
        return {
          status: 301 as Redirection,
          url: route.makeLink("actions", {}),
        };
    }
  } else {
    title = "List of actions";
  }
  return {
    url: payload.url,
    status: 200 as Success,
    title,
    item,
    settings: await adminApi("Settings/Read", null),
    list,
    mode,
  };
};
