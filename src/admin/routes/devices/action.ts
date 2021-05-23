import { Action } from "./types";
import { Redirection, Success } from "@webcarrot/router";
import { Mode } from "../types";
import { Device } from "@webcarrot/multi-lan-controller/common/db/types";

export const action: Action = async (payload, params, { route, adminApi }) => {
  let item: Device = null;
  let mode: Mode = "list";
  let title: string;
  const list = await adminApi("Devices/List", null);
  const places = await adminApi("Places/List", null);
  if (params && params.mode) {
    switch (params.mode) {
      case "add":
        mode = "add";
        title = "Add new device";
        break;
      case "edit":
        mode = "edit";
        item = list.find(({ id }) => id === params.id);
        if (!item) {
          throw new Error("Device not found");
        }
        title = `Edit "${item.name}" token unit`;
        break;
      default:
        return {
          status: 301 as Redirection,
          url: route.makeLink("devices", {}),
        };
    }
  } else {
    title = "List of devices";
  }
  return {
    url: payload.url,
    status: 200 as Success,
    title,
    item,
    list,
    places,
    mode,
  };
};
