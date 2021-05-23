import { ApiResolver, ActionFunction } from "@webcarrot/api";
import { actions } from "./actions";

import {
  DbAccess,
  User,
} from "@webcarrot/multi-lan-controller/common/db/types";

export type AdminApiData = typeof actions;
export type AdminApiContextValue = ApiResolver<AdminApiData>;

export type AdminApiContext = {
  readonly dbAccess: DbAccess;
  readonly user: User;
};

export type AdminApiFunction<P, O = P> = ActionFunction<P, O, AdminApiContext>;

export type BasicContext = {
  readonly adminApi: AdminApiContext;
};
