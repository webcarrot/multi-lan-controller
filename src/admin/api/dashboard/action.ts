import {
  listPlaces,
  listDevices,
  getActionById,
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
  null
> = async ({ actionId, devicesIds }, { dbAccess, user }) => {
  let places = await listPlaces(dbAccess);
  let devices = await listDevices(dbAccess);
  const action = await getActionById(dbAccess, actionId);

  if (
    !action ||
    (user.actions !== "all" && !user.actions.includes(action.id))
  ) {
    return null;
  }

  const query = makeQuery(action);
  if (!query) {
    return null;
  }

  if (user.places !== "all") {
    places = places.filter(({ id }) => user.places.includes(id));
  }

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
              } catch (_) {}
            })
        );
      })
  );
  return null;
};
