import { join } from "path";
import { APP_ROOT_DIR } from "../../constants";

export const BUILD_DIR = join(APP_ROOT_DIR, "./build");

export const STATIC_MANIFEST = join(BUILD_DIR, "static.manifest.json");

export const ADMIN_LEGACY_MANIFEST = join(
  BUILD_DIR,
  "admin.manifest.legacy.json"
);

export const ADMIN_MODERN_MANIFEST = join(
  BUILD_DIR,
  "admin.manifest.modern.json"
);
