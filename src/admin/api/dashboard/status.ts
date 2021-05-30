import {
  listPlaces,
  listDevices,
  getDeviceStatus,
} from "@webcarrot/multi-lan-controller/common/db";
import { DeviceStatus } from "@webcarrot/multi-lan-controller/common/device/types";
import { AdminApiFunction } from "../types";
import { DashboardDevice, DashboardPlace } from "./types";

export const status: AdminApiFunction<null, ReadonlyArray<DashboardPlace>> =
  async (_, { dbAccess, user }) => {
    let places = await listPlaces(dbAccess);
    let devices = await listDevices(dbAccess);
    if (user.places !== "all") {
      places = places.filter(({ id }) => user.places.includes(id));
    }
    return places
      .filter(({ isActive }) => isActive)
      .map<DashboardPlace>((place) => ({
        ...place,
        devices: devices
          .filter(({ placeId, isActive }) => placeId === place.id && isActive)
          .map((device): DashboardDevice => {
            const status: DeviceStatus = getDeviceStatus(dbAccess, device);
            return {
              id: device.id,
              name: device.name,
              isOnline: status !== null,
              status,
            };
          }),
      }))
      .filter((place) => place.devices.length > 0);
  };
