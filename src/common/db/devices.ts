import { parseDevice } from "./parse";
import { DbAccess, Device } from "./types";
import { v4 } from "uuid";

export const list = async (access: DbAccess): Promise<ReadonlyArray<Device>> =>
  (await access.read()).devices;

export const save = async (access: DbAccess, item: Device): Promise<Device> => {
  let itemToSave = parseDevice(item);
  await access.save(async (db) => {
    if (itemToSave.id) {
      if (!db.devices.find(({ id }) => id === itemToSave.id)) {
        throw new Error("Unknown device");
      }
      return {
        ...db,
        devices: db.devices.map((device) => {
          if (device.id === itemToSave.id) {
            return itemToSave;
          } else {
            return device;
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
        devices: [...db.devices, itemToSave],
      };
    }
  });
  return itemToSave;
};
