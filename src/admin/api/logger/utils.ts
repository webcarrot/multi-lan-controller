import { DbAccess } from "@webcarrot/multi-lan-controller/common/db/types";
import {
  LoggerInfo,
  LoggerRecord,
  LoggerAdminRecord,
  LoggerAuthRecord,
  LoggerStatusRecord,
  LoggerActionRecord,
} from "@webcarrot/multi-lan-controller/common/logger/types";
import {
  InternalLoggerMeta,
  InternalAdminLoggerRecord,
  InternalAuthLoggerRecord,
  InternalStatusLoggerRecord,
  InternalActionLoggerRecord,
  InternalLogger,
} from "./types";

export const prepareLoggerRecords = async (
  dbAccess: DbAccess,
  data: LoggerInfo<LoggerRecord>
): Promise<InternalLogger> => {
  const { actions, devices, places, users } = await dbAccess.read();
  const getActionName = (rId: string, defaultName?: string) =>
    actions.find(({ id }) => id === rId)?.name ||
    defaultName ||
    "Unknown action";
  const getDeviceName = (rId: string, defaultName?: string) =>
    devices.find(({ id }) => id === rId)?.name ||
    defaultName ||
    "Unknown device";
  const getPlaceName = (rId: string, defaultName?: string) =>
    places.find(({ id }) => id === rId)?.name || defaultName || "Unknown place";
  const getDevicePlaceName = (rId: string) =>
    getPlaceName(devices.find(({ id }) => id === rId)?.placeId);
  const getUserName = (rId: string, defaultName?: string) =>
    users.find(({ id }) => id === rId)?.name || defaultName || "Unknown user";

  const meta: InternalLoggerMeta = {
    fromDate: data.meta.fromDate,
    toDate: data.meta.toDate,
    limit: data.meta.limit,
    offset: data.meta.offset,
    total: data.meta.total,
  };
  switch (data.meta.type) {
    case "admin":
      return {
        type: "admin",
        items: data.items.map<InternalAdminLoggerRecord>(
          (item: LoggerAdminRecord) => {
            const changeType = item.changeType || "edit";
            let name = "";
            switch (item.component) {
              case "action":
                name = getActionName(item.id, item.name);
                break;
              case "device":
                name = getDeviceName(item.id, item.name);
                break;
              case "place":
                name = getPlaceName(item.id, item.name);
                break;
              case "user":
                name = getUserName(item.id, item.name);
                break;
            }
            return {
              date: item.date,
              user: getUserName(item.userId),
              component: item.component,
              changeType,
              name,
            };
          }
        ),
        meta,
      };
    case "auth":
      return {
        type: "auth",
        items: data.items.map<InternalAuthLoggerRecord>(
          (item: LoggerAuthRecord) => ({
            date: item.date,
            user: getUserName(item.userId),
            logIn: item.logIn,
          })
        ),
        meta,
      };
    case "status":
      return {
        type: "status",
        items: data.items.map<InternalStatusLoggerRecord>(
          (item: LoggerStatusRecord) => ({
            date: item.date,
            name: getDeviceName(item.deviceId),
            place: getDevicePlaceName(item.deviceId),
            isOnline: item.isOnline,
          })
        ),
        meta,
      };
    case "action":
      return {
        type: "action",
        items: data.items.map<InternalActionLoggerRecord>(
          (item: LoggerActionRecord) => ({
            date: item.date,
            user: getUserName(item.userId),
            action: getActionName(item.actionId),
            device: getDeviceName(item.deviceId),
            place: getDevicePlaceName(item.deviceId),
            success: item.success,
          })
        ),
        meta,
      };
  }
};
