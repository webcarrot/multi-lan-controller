import { listActions } from "@webcarrot/multi-lan-controller/common/db";
import { AdminApiFunction } from "../types";
import { DashboardAction } from "./types";

export const actions: AdminApiFunction<null, ReadonlyArray<DashboardAction>> =
  async (_, { dbAccess }) =>
    (await listActions(dbAccess))
      .filter(({ isActive }) => isActive)
      .map(({ id, name, color }) => ({ id, name, color }));
