import { readFile, stat, Stats } from "fs";
import { promisify } from "util";

const statP = promisify(stat);

export const info = async (path: string): Promise<Stats> => {
  try {
    return await statP(path);
  } catch (_) {
    return null;
  }
};

export const exist = async (path: string): Promise<boolean> => {
  const i = await info(path);
  return i ? i.isFile() : false;
};

export const read = promisify(readFile);
