import {
  listPlaces,
  listDevices,
  getActionById,
  readSettings,
} from "@webcarrot/multi-lan-controller/common/db";
import {
  makeQuery,
  performAction,
} from "@webcarrot/multi-lan-controller/common/device";
import { AdminApiFunction } from "../types";

export const action: AdminApiFunction<
  {
    readonly actionId: string;
    readonly devicesIds: ReadonlyArray<string>;
  },
  ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly success: boolean;
  }>
> = async ({ actionId, devicesIds }, { dbAccess, user }) => {
  let places = await listPlaces(dbAccess);
  let devices = await listDevices(dbAccess);
  const { reverseOut } = await readSettings(dbAccess);

  const action = await getActionById(dbAccess, actionId);

  if (
    !action ||
    (user.actions !== "all" && !user.actions.includes(action.id))
  ) {
    throw new Error("Invalid action");
  }

  const query = makeQuery(action, reverseOut);
  if (!query) {
    throw new Error("Invalid action");
  }

  if (user.places !== "all") {
    places = places.filter(({ id }) => user.places.includes(id));
  }

  const out: Array<{
    readonly id: string;
    readonly name: string;
    readonly success: boolean;
  }> = [];

  await Promise.all(
    places
      .filter(({ isActive }) => isActive)
      .map(async (place) => {
        await Promise.all(
          devices
            .filter(
              ({ id, placeId, isActive }) =>
                isActive && placeId === place.id && devicesIds.includes(id)
            )
            .map(async (device) => {
              try {
                await performAction(device, query);
                out.push({
                  id: device.id,
                  name: device.name,
                  success: true,
                });
              } catch (_) {
                out.push({
                  id: device.id,
                  name: device.name,
                  success: false,
                });
              }
            })
        );
      })
  );
  return out;
};
