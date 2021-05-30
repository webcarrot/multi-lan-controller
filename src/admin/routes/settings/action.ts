import { RouteAction } from "./types";
import { Success } from "@webcarrot/router";
import { DashboardPlace } from "../../api/dashboard/types";

export const action: RouteAction = async (payload, _, { adminApi }) => {
  const places = await adminApi("Places/List", null);
  const devices = await adminApi("Devices/List", null);
  return {
    url: payload.url,
    status: 200 as Success,
    title: "Settings",
    settings: await adminApi("Settings/Read", null),
    actions: await adminApi("Actions/List", null),
    dashboard: places.map<DashboardPlace>((place) => ({
      id: place.id,
      name: place.name,
      devices: devices
        .filter((device) => device.placeId === place.id)
        .map((device) => ({
          id: device.id,
          isOnline: false,
          name: device.name,
          status: null,
        })),
    })),
  };
};
