import {
  listPlaces,
  listDevices,
} from "@webcarrot/multi-lan-controller/common/db";
import { getDeviceStatus } from "../../device";
import { DeviceStatus } from "../../device/types";
import { AdminApiFunction } from "../types";
import { DashboardDevice, DashboardPlace } from "./types";

export const status: AdminApiFunction<null, ReadonlyArray<DashboardPlace>> =
  async (_, { dbAccess, user }) => {
    let places = await listPlaces(dbAccess);
    let devices = await listDevices(dbAccess);
    if (user.places !== "all") {
      places = places.filter(({ id }) => user.places.includes(id));
    }
    return (
      await Promise.all(
        places
          .filter(({ isActive }) => isActive)
          .map(async (place): Promise<DashboardPlace> => {
            return {
              ...place,
              devices: await Promise.all(
                devices
                  .filter(
                    ({ placeId, isActive }) => placeId === place.id && isActive
                  )
                  .map(async (device): Promise<DashboardDevice> => {
                    let status: DeviceStatus;
                    let isOnline = false;
                    try {
                      status = await getDeviceStatus(device);
                      isOnline = true;
                    } catch (_) {}
                    return {
                      id: device.id,
                      name: device.name,
                      isOnline,
                      status,
                    };
                  })
              ),
            };
          })
      )
    ).filter((place) => place.devices.length > 0);
  };
