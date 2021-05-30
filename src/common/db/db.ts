import { promises } from "fs";
import { Settings } from "http2";
import { join } from "path";
import { getDeviceStatus } from "../device";
import { DeviceStatus, DeviceStatusValues } from "../device/types";
import {
  parseAction,
  parseDevice,
  parsePlace,
  parseSettings,
  parseUser,
  validSettingsKeys,
} from "./parse";
import type { Db, DbAccess, Device } from "./types";

const EMPTY_DB: Db = {
  devices: [],
  places: [],
  users: [],
  actions: [],
  settings: {
    ...validSettingsKeys.reduce<{ [key in DeviceStatusValues]: string }>(
      (out, key) => {
        out[key] = key.toUpperCase();
        return out;
      },
      {} as { [key in DeviceStatusValues]: string }
    ),
    cols: [],
  },
};

const checkDb = ({ actions, devices, places, settings, users }: Db): Db => {
  if (!settings.cols && (settings as any).out) {
    const out = (settings as any).out as ReadonlyArray<{
      name: string;
      isActive: boolean;
    }>;
    settings = {
      ...EMPTY_DB.settings,
      ...out.reduce<Partial<Settings>>((out, { name }, no) => {
        const key = `out${no}` as DeviceStatusValues;
        return {
          ...out,
          [key]: name,
        };
      }, {}),
      cols: out.reduce<Array<DeviceStatusValues>>((out, { isActive }, no) => {
        if (isActive) {
          const key = `out${no}` as DeviceStatusValues;
          out.push(key);
        }
        return out;
      }, []),
    };
  }
  return {
    actions: actions.map((item) => parseAction(item)),
    devices: devices.map((item) => parseDevice(item)),
    places: places.map((item) => parsePlace(item)),
    settings: parseSettings(settings),
    users: users.map((item) => parseUser(item)),
  };
};

export const makeDbAccess = async (databaseDir: string): Promise<DbAccess> => {
  let dbPromise: Promise<Db>;
  try {
    let info;
    try {
      info = await promises.stat(databaseDir);
    } catch (_) {
      await promises.mkdir(databaseDir, { recursive: true });
      info = await promises.stat(databaseDir);
    }
    if (!info.isDirectory()) {
      throw new Error("Invalid database dir path");
    }
  } catch (_) {
    throw new Error("Invalid database dir path");
  }

  try {
    dbPromise = Promise.resolve<Db>(
      JSON.parse(
        await promises.readFile(join(databaseDir, "index.json"), "utf8")
      )
    )
      .then((db) => ({
        ...EMPTY_DB,
        ...db,
      }))
      .then(checkDb);
  } catch (_) {
    dbPromise = Promise.resolve<Db>(EMPTY_DB);
    await promises.writeFile(
      join(databaseDir, "index.json"),
      JSON.stringify(await dbPromise, null, 2),
      "utf8"
    );
  }

  let savePromise: Promise<Db> = dbPromise;

  const save = async (cb: (data: Db) => Promise<Db>) => {
    const promise = savePromise.then(async (data) => {
      let saved = false;
      try {
        let newData = await cb(data);
        if (newData) {
          await promises.writeFile(
            join(databaseDir, "index.json"),
            JSON.stringify(newData, null, 2),
            "utf-8"
          );
          saved = true;
          return {
            data: newData,
          };
        } else {
          return {
            data,
          };
        }
      } catch (err) {
        if (saved) {
          return {
            data,
          };
        }
        return {
          data,
          err,
        };
      }
    });
    savePromise = promise.then(({ data }) => {
      return (dbPromise = Promise.resolve(data));
    });
    return promise.then(({ data, err }) => {
      if (err) {
        throw err;
      } else {
        return data;
      }
    });
  };

  const read = async () => await dbPromise;

  const CURRENT_STATUS: { [key: string]: DeviceStatus } = {};
  const CURRENT_STATUS_CHECK = new Map<string, number>();

  const NO_CONNECTION = new Set<string>();

  const watchDeviceStatus = async (device: Device) => {
    CURRENT_STATUS_CHECK.set(device.id, null);
    try {
      const status = await getDeviceStatus(device);
      if (NO_CONNECTION.has(device.id)) {
        NO_CONNECTION.delete(device.id);
        console.info(
          `[${new Date().toISOString()}] BACK TO NORMAL: ${device.name} (${
            device.url
          })`
        );
      }
      CURRENT_STATUS[device.id] = status;
    } catch (err) {
      if (!NO_CONNECTION.has(device.id)) {
        NO_CONNECTION.add(device.id);
        console.error(
          `[${new Date().toISOString()}] ERROR: ${err.message} ${
            device.name
          } (${device.url})`
        );
      }
      CURRENT_STATUS[device.id] = null;
    }
    CURRENT_STATUS_CHECK.set(
      device.id,
      setTimeout(() => {
        watchDeviceStatus(device);
      }, 500) as any
    );
  };

  const getStatus = async () => {
    const devices = (await read()).devices.filter(({ isActive }) => isActive);
    devices
      .filter(({ id }) => !CURRENT_STATUS_CHECK.has(id))
      .forEach(watchDeviceStatus);
    [...CURRENT_STATUS_CHECK.keys()]
      .filter((id) => !devices.find((device) => device.id === id))
      .forEach((id) => {
        const timeout = CURRENT_STATUS_CHECK.get(id);
        if (timeout) {
          clearTimeout(CURRENT_STATUS_CHECK.get(id));
        }
        delete CURRENT_STATUS[id];
        CURRENT_STATUS_CHECK.delete(id);
      });
    setTimeout(getStatus, 500);
  };

  getStatus();

  const status = () => CURRENT_STATUS;

  return {
    read,
    save,
    status,
  };
};
