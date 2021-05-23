import { readSettings } from "@webcarrot/multi-lan-controller/common/db";
import { Settings } from "@webcarrot/multi-lan-controller/common/db/types";
import { AdminApiFunction } from "../types";

export const read: AdminApiFunction<null, Settings> = async (_, { dbAccess }) =>
  await readSettings(dbAccess);
