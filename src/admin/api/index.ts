import { AdminApiContext } from "./types";
import { makeApi } from "@webcarrot/api/node";

import { AdminApiContextValue, AdminApiData } from "./types";
import { actions } from "./_actions";
import {
  DbAccess,
  User,
} from "@webcarrot/multi-lan-controller/common/db/types";
import { Logger } from "@webcarrot/multi-lan-controller/common/logger/types";

export const make = async (
  dbAccess: DbAccess,
  logger: Logger,
  user: User
): Promise<AdminApiContextValue> => {
  return makeApi<AdminApiData, AdminApiContext>({
    actions,
    context: {
      dbAccess,
      logger,
      user,
    },
  });
};
