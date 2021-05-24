import { parseSettings } from "./parse";
import { DbAccess, Settings } from "./types";

export const read = async (access: DbAccess): Promise<Settings> =>
  (await access.read()).settings;

export const save = async (
  access: DbAccess,
  settings: Settings
): Promise<Settings> => {
  settings = parseSettings(settings);
  await access.save(async (db) => {
    return {
      ...db,
      settings,
    };
  });
  return settings;
};
