import {
  listPlaces,
  listDevices,
} from "@webcarrot/multi-lan-controller/common/db";
import { InternalActionLoggerRecord } from "../logger/types";
import { prepareLoggerRecords } from "../logger/utils";
import { AdminApiFunction } from "../types";

export const logs: AdminApiFunction<
  {
    fromDate?: string;
    toDate?: string;
  },
  ReadonlyArray<InternalActionLoggerRecord>
> = async ({ fromDate, toDate } = {}, { dbAccess, user, logger }) => {
  let places = await listPlaces(dbAccess);
  let devices = await listDevices(dbAccess);
  if (user.places !== "all") {
    places = places.filter(({ id }) => user.places.includes(id));
  }
  const placesIds = places.map(({ id }) => id);
  const devicesIds = devices
    .filter(({ placeId }) => placesIds.includes(placeId))
    .map(({ id }) => id);
  const { items } = await prepareLoggerRecords(
    dbAccess,
    await logger.read({
      type: "action",
      limit: Number.MAX_SAFE_INTEGER,
      offset: 0,
      fromDate,
      toDate,
      ids: devicesIds,
    })
  );
  return items as ReadonlyArray<InternalActionLoggerRecord>;
};
