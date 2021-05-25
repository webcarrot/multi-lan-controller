import { parseAction } from "./parse";
import { DbAccess, Action } from "./types";
import { v4 } from "uuid";

export const list = async (access: DbAccess): Promise<ReadonlyArray<Action>> =>
  (await access.read()).actions;

export const getById = async (
  access: DbAccess,
  id: string
): Promise<Action> => {
  const actions = await list(access);
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    if (action.isActive && action.id === id) {
      return action;
    }
  }
  return null;
};

export const save = async (access: DbAccess, item: Action): Promise<Action> => {
  let itemToSave = parseAction(item);
  await access.save(async (db) => {
    if (itemToSave.id) {
      if (!db.actions.find(({ id }) => id === itemToSave.id)) {
        throw new Error("Unknown action");
      }
      return {
        ...db,
        actions: db.actions.map((action) => {
          if (action.id === itemToSave.id) {
            return itemToSave;
          } else {
            return action;
          }
        }),
      };
    } else {
      itemToSave = {
        ...itemToSave,
        id: v4(),
      };
      return {
        ...db,
        actions: [...db.actions, itemToSave],
      };
    }
  });
  return itemToSave;
};
