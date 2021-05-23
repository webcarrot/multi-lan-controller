import {
  listPlaces,
  listDevices,
} from "@webcarrot/multi-lan-controller/common/db";
import { setOutStatus } from "../../device";
import { AdminApiFunction } from "../types";
import { DashboardChangeOut } from "./types";

export const changeOut: AdminApiFunction<
  ReadonlyArray<DashboardChangeOut>,
  void
> = async (changes, { dbAccess, user }) => {
  const devicesIdsToChange = new Map(
    changes.map((device) => [device.id, device])
  );
  let places = await listPlaces(dbAccess);
  let devices = await listDevices(dbAccess);
  if (user.places !== "all") {
    places = places.filter(({ id }) => user.places.includes(id));
  }

  await Promise.all(
    places.map(async (place) => {
      await Promise.all(
        devices
          .filter(
            ({ id, placeId }) =>
              placeId === place.id && devicesIdsToChange.has(id)
          )
          .map(async (device) => {
            try {
              const { no, value } = devicesIdsToChange.get(device.id);
              await setOutStatus(device, no, value);
            } catch (_) {
              console.log("xxx");
            }
          })
      );
    })
  );
};
