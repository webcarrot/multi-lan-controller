import { watchFile, unwatchFile } from "fs";
import { exist, read } from "./utils";
import {
  STATIC_MANIFEST,
  ADMIN_LEGACY_MANIFEST,
  ADMIN_MODERN_MANIFEST,
} from "./constants";
import { createHash } from "crypto";

type Manifests = "static" | "admin-legacy" | "admin-modern";

type BuildCache = Map<string, string>;
type Cache = {
  hash: string;
  flat: ReadonlyArray<string>;
  manifests: Map<Manifests, BuildCache>;
};
let CACHE: Cache = null;

export const getManifestFile = async (
  path: string,
  tryAgain: boolean
): Promise<BuildCache> => {
  try {
    if (await exist(path)) {
      const manifest: { [key: string]: string } = JSON.parse(
        (await read(path)).toString()
      );
      const data: BuildCache = new Map();
      Object.keys(manifest).forEach((name) => {
        data.set(name, manifest[name]);
      });
      watchFile(
        path,
        {
          persistent: false,
        },
        () => {
          CACHE = null;
          unwatchFile(path);
        }
      );
      CACHE = null;
      return data;
    } else if (tryAgain) {
      setTimeout(() => getManifestFile(path, true), 1000);
    }
  } catch (_) {
    if (tryAgain) {
      setTimeout(() => getManifestFile(path, true), 1000);
    }
    return null;
  }
};

export const getManifests = async (): Promise<Cache> => {
  if (CACHE) {
    return CACHE;
  } else {
    const staticFiles = await getManifestFile(STATIC_MANIFEST, true);

    const adminLegacy = await getManifestFile(ADMIN_LEGACY_MANIFEST, false);
    const adminModern = await getManifestFile(ADMIN_MODERN_MANIFEST, true);
    const manifests = new Map();
    manifests.set("static", staticFiles);
    manifests.set("admin-legacy", adminLegacy);
    manifests.set("admin-modern", adminModern);
    const flat: Array<string> = [];
    if (staticFiles) {
      staticFiles.forEach((value) => flat.push(value));
    }
    if (adminLegacy) {
      adminLegacy.forEach((value) => flat.push(value));
    }
    if (adminModern) {
      adminModern.forEach((value) => flat.push(value));
    }

    const hash =
      adminModern && staticFiles
        ? createHash("md5").update(JSON.stringify(flat)).digest("hex")
        : null;

    CACHE = {
      hash,
      flat,
      manifests,
    };
    return CACHE;
  }
};
