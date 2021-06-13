import {
  LoggerInfoQuery,
  LoggerRecordType,
} from "@webcarrot/multi-lan-controller/common/logger/types";
import { checkIsAdmin } from "../access";
import { AdminApiContext } from "../types";
import { InternalLogger } from "./types";
import { prepareLoggerRecords } from "./utils";

export const list = async <T extends LoggerRecordType>(
  query: LoggerInfoQuery<T>,
  { user, logger, dbAccess }: AdminApiContext
): Promise<InternalLogger> => {
  checkIsAdmin(user);
  return await prepareLoggerRecords(dbAccess, await logger.read(query));
};
