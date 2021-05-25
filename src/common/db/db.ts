import { promises } from "fs";
import { join } from "path";
import type { Db, DbAccess } from "./types";

const EMPTY_DB: Db = {
  devices: [],
  places: [],
  users: [],
  actions: [],
  settings: {
    out: [
      {
        isActive: false,
        name: "OUT0",
      },
      {
        isActive: false,
        name: "OUT1",
      },
      {
        isActive: false,
        name: "OUT2",
      },
      {
        isActive: false,
        name: "OUT3",
      },
      {
        isActive: false,
        name: "OUT4",
      },
      {
        isActive: false,
        name: "OUT5",
      },
    ],
  },
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
    ).then((db) => ({
      ...EMPTY_DB,
      ...db,
    }));
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

  return {
    read,
    save,
  };
};
