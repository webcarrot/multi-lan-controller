import {
  LoggerActionRecord,
  LoggerAdminRecord,
  LoggerAuthRecord,
  LoggerInfoQuery,
  LoggerRecordType,
  LoggerStatusRecord,
} from "@webcarrot/multi-lan-controller/common/logger/types";
import { checkIsAdmin } from "../access";
import { AdminApiContext } from "../types";
import {
  InternalActionLoggerRecord,
  InternalLoggerMeta,
  InternalAdminLoggerRecord,
  InternalAuthLoggerRecord,
  InternalLogger,
  InternalStatusLoggerRecord,
} from "./types";

export const list = async <T extends LoggerRecordType>(
  query: LoggerInfoQuery<T>,
  { user, logger, dbAccess }: AdminApiContext
): Promise<InternalLogger> => {
  checkIsAdmin(user);
  const data = await logger.read(query);
  const { actions, devices, places, users } = await dbAccess.read();
  const getActionName = (rId: string) =>
    actions.find(({ id }) => id === rId)?.name || "Unknown action";
  const getDeviceName = (rId: string) =>
    devices.find(({ id }) => id === rId)?.name || "Unknown device";
  const getPlaceName = (rId: string) =>
    places.find(({ id }) => id === rId)?.name || "Unknown place";
  const getDevicePlaceName = (rId: string) =>
    getPlaceName(devices.find(({ id }) => id === rId)?.placeId);
  const getUserName = (rId: string) =>
    users.find(({ id }) => id === rId)?.name || "Unknown user";

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
            if (changeType === "remove") {
              name = item.name || "";
            } else {
              switch (item.component) {
                case "action":
                  name = getActionName(item.id);
                  break;
                case "device":
                  name = getDeviceName(item.id);
                  break;
                case "place":
                  name = getPlaceName(item.id);
                  break;
                case "user":
                  name = getUserName(item.id);
                  break;
              }
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
