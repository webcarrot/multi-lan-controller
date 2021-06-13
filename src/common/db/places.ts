import { parsePlace } from "./parse";
import { DbAccess, Place } from "./types";
import { v4 } from "uuid";

export const list = async (access: DbAccess): Promise<ReadonlyArray<Place>> =>
  (await access.read()).places;

export const save = async (access: DbAccess, item: Place): Promise<Place> => {
  let itemToSave = parsePlace(item);
  await access.save(async (db) => {
    if (itemToSave.id) {
      if (!db.places.find(({ id }) => id === itemToSave.id)) {
        throw new Error("Unknown place");
      }
      return {
        ...db,
        places: db.places.map((place) => {
          if (place.id === itemToSave.id) {
            return itemToSave;
          } else {
            return place;
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
        places: [...db.places, itemToSave],
      };
    }
  });
  return itemToSave;
};

export const remove = async (access: DbAccess, item: Place): Promise<void> => {
  let itemToRemove = parsePlace(item);
  await access.save(async (db) => {
    if (!db.places.find(({ id }) => id === itemToRemove.id)) {
      throw new Error("Unknown place");
    }
    return {
      ...db,
      places: db.places.filter(({ id }) => id !== itemToRemove.id),
      devices: db.devices.map((device) => {
        if (device.placeId === itemToRemove.id) {
          return {
            ...device,
            placeId: null,
          };
        } else {
          return device;
        }
      }),
      users: db.users.map((user) => {
        if (user.places !== "all" && user.places.includes(itemToRemove.id)) {
          return {
            ...user,
            places: user.places.filter((id) => id !== itemToRemove.id),
          };
        } else {
          return user;
        }
      }),
    };
  });
};
