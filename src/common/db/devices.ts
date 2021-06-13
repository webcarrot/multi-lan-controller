import { parseDevice } from "./parse";
import { DbAccess, Device } from "./types";
import { v4 } from "uuid";
import { DeviceStatus } from "../device/types";

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

export const status = (access: DbAccess, item: Device): DeviceStatus =>
  access.status()[item.id] || null;

export const remove = async (access: DbAccess, item: Device): Promise<void> => {
  let itemToRemove = parseDevice(item);
  await access.save(async (db) => {
    if (!db.devices.find(({ id }) => id === itemToRemove.id)) {
      throw new Error("Unknown device");
    }
    return {
      ...db,
      devices: db.devices.filter(({ id }) => id !== itemToRemove.id),
    };
  });
};
