import { AdminApiContext } from "./types";
import { makeApi } from "@webcarrot/api/node";

import { AdminApiContextValue, AdminApiData } from "./types";
import { actions } from "./actions";
import {
  DbAccess,
  User,
} from "@webcarrot/multi-lan-controller/common/db/types";

export const make = async (
  dbAccess: DbAccess,
  user: User
): Promise<AdminApiContextValue> => {
  return makeApi<AdminApiData, AdminApiContext>({
    actions,
    context: {
      dbAccess,
      user,
    },
  });
};
