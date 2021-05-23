import { join } from "path";
import * as etag from "etag";
import { lookup as mLookup, charset as mCharset } from "mime-types";
import { Stats } from "fs";
import { exist, info } from "./utils";
import { BUILD_DIR } from "./constants";
import { getManifests } from "./manifest";

export type Compression = "none" | "gzip" | "lzma" | "br";
type Extension = "gz" | "xz" | "br";

const COMPRESSION_METHODS: Array<Compression> = ["br", "lzma", "gzip", "none"];

const COMPRESSION_METHODS_EXTS: Array<[Extension, Compression]> = [
  ["gz", "gzip"],
  ["xz", "lzma"],
  ["br", "br"],
];

class FileInfo {
  public readonly path: string;
  public readonly type: string;
  public readonly compression: Compression;
  public readonly size: number;
  public readonly modified: string;
  public readonly etag: string;
  constructor(
    path: string,
    type: string,
    compression: Compression,
    info: Stats
  ) {
    this.path = path;
    this.type = type;
    this.compression = compression;
    this.size = info.size;
    this.modified = info.mtime.toUTCString();
    this.etag = etag(info);
  }
}

class FileProvider {
  private readonly path: string;
  private readonly files: Map<Compression, FileInfo>;
  constructor(path: string) {
    this.path = path;
    this.files = new Map();
  }
  async prepare(_flat: ReadonlyArray<string>) {
    const path = this.path;
    const type = mLookup(this.path) || "";
    const charset = (type && mCharset(type)) || "";
    const fullType = type && charset ? `${type}; charset=${charset}` : type;
    const fp = join(BUILD_DIR, path);
    this.files.set("none", new FileInfo(fp, fullType, "none", await info(fp)));
    await Promise.all(
      COMPRESSION_METHODS_EXTS.map(async ([ext, compression]) => {
        const p = `${path}.${ext}`;
        const fp = join(BUILD_DIR, p);
        if (await exist(fp)) {
          this.files.set(
            compression,
            new FileInfo(fp, fullType, compression, await info(fp))
          );
        }
      })
    );
  }
  getFileInfo(accept: Set<Compression>): FileInfo {
    const files = this.files;
    const method = COMPRESSION_METHODS.find(
      (method) => accept.has(method) && files.has(method)
    );
    return files.get(method);
  }
}

type Cache = Map<string, FileProvider>;
let CACHE: Cache = new Map();

export const getFileProvider = async (path: string): Promise<FileProvider> => {
  if (!CACHE.has(path)) {
    const { flat } = await getManifests();
    if (flat.includes(path) && (await exist(join(BUILD_DIR, path)))) {
      const fileInfo = new FileProvider(path);
      await fileInfo.prepare(flat);
      CACHE.set(path, fileInfo);
    } else {
      CACHE.set(path, null);
    }
  }
  return CACHE.get(path);
};
