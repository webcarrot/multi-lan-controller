import { RouteAction } from "./types";
import { Redirection, Success } from "@webcarrot/router";
import { Mode } from "../types";
import { User } from "@webcarrot/multi-lan-controller/common/db/types";

export const action: RouteAction = async (
  payload,
  params,
  { route, adminApi }
) => {
  let item: User = null;
  let mode: Mode = "list";
  let title: string;
  const list = await adminApi("Users/List", null);
  const places = await adminApi("Places/List", null);
  const actions = await adminApi("Actions/List", null);
  if (params && params.mode) {
    switch (params.mode) {
      case "add":
        mode = "add";
        title = "Add new user";
        break;
      case "edit":
        mode = "edit";
        item = list.find(({ id }) => id === params.id);
        if (!item) {
          throw new Error("User not found");
        }
        title = `Edit "${item.name}" token unit`;
        break;
      default:
        return {
          status: 301 as Redirection,
          url: route.makeLink("users", {}),
        };
    }
  } else {
    title = "List of users";
  }
  return {
    url: payload.url,
    status: 200 as Success,
    title,
    item,
    list,
    places,
    actions,
    mode,
  };
};
