import { ApiResolver, ActionFunction } from "@webcarrot/api";
import { actions } from "./_actions";

import {
  DbAccess,
  User,
} from "@webcarrot/multi-lan-controller/common/db/types";
import { Logger } from "@webcarrot/multi-lan-controller/common/logger/types";

export type AdminApiData = typeof actions;
export type AdminApiContextValue = ApiResolver<AdminApiData>;

export type AdminApiContext = {
  readonly dbAccess: DbAccess;
  readonly logger: Logger;
  readonly user: User;
};

export type AdminApiFunction<P, O = P> = ActionFunction<P, O, AdminApiContext>;

export type BasicContext = {
  readonly adminApi: AdminApiContext;
};
